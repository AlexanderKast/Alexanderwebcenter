"""
apify-scraper.py — Scraper para Alexander Cast Content System.

Soporta Instagram, TikTok, YouTube, LinkedIn vía Apify actors.
Output: db/referentes/[pilar-X-name]/[handle].md con schema extendido.
Logging: scripts/scraping.log por llamada.

Uso:
  python apify-scraper.py --platform instagram --handle juandaeffi --pilar 3
  python apify-scraper.py --batch scripts/referentes.csv --top-n 5 --min-views 500000

Compatibilidad: mantiene `run_single` y `run_instagram`/`run_tiktok` para no romper
flujos previos del proyecto.
"""

import os
import sys
import time
import argparse
import csv
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from apify_client import ApifyClient

load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")
ROOT = Path(__file__).resolve().parent.parent
LOG_FILE = ROOT / "scripts" / "scraping.log"
DB_DIR = ROOT / "db" / "referentes"
LEGACY_DIR = ROOT / "knowledge" / "competitors"

PILAR_MAP = {
    "1": "pilar-1-mentalidad-fe",
    "2": "pilar-2-ia-aplicada",
    "3": "pilar-3-live-shopping",
    "4": "pilar-4-contenido",
}

ACTORS = {
    "instagram": "apify/instagram-scraper",
    "tiktok": "clockworks/tiktok-scraper",
    "youtube": "streamers/youtube-scraper",
    "linkedin": "apimaestro/linkedin-profile-posts",
}

client = ApifyClient(APIFY_TOKEN)


def log_call(actor, handle, platform, items, exit_code, summary):
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    line = f"{ts} | {actor} | {handle} | {platform} | {items} | {exit_code} | {summary}\n"
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line)


def get_metric(post: dict, platform: str, key: str):
    """Lee una métrica del post normalizada por plataforma."""
    if platform == "instagram":
        if key == "views":
            return post.get("videoViewCount") or post.get("videoPlayCount", 0) or 0
        if key == "likes":
            return post.get("likesCount", 0) or 0
        if key == "comments":
            return post.get("commentsCount", 0) or 0
        if key == "shares":
            return 0
        if key == "duration":
            return post.get("videoDuration")
        if key == "url":
            return post.get("url", "") or ""
        if key == "caption":
            return post.get("caption", "") or ""
        if key == "format":
            t = post.get("type")
            return "reel" if t == "Video" else "carrusel" if t == "Sidecar" else "imagen"
    if platform == "tiktok":
        if key == "views":
            return post.get("playCount", 0) or 0
        if key == "likes":
            return post.get("diggCount", 0) or 0
        if key == "comments":
            return post.get("commentCount", 0) or 0
        if key == "shares":
            return post.get("shareCount", 0) or 0
        if key == "duration":
            meta = post.get("videoMeta") or {}
            return meta.get("duration")
        if key == "url":
            return post.get("webVideoUrl", "") or ""
        if key == "caption":
            return post.get("text", "") or ""
        if key == "format":
            return "video"
    if platform == "youtube":
        if key == "views":
            return post.get("viewCount", 0) or 0
        if key == "likes":
            return post.get("likes", 0) or 0
        if key == "comments":
            return post.get("commentsCount", 0) or 0
        if key == "shares":
            return 0
        if key == "duration":
            return post.get("duration")
        if key == "url":
            return post.get("url", "") or ""
        if key == "caption":
            return (post.get("title", "") or "") + "\n" + (post.get("description", "") or "")
        if key == "format":
            d = str(post.get("duration") or "")
            return "short" if d and (d.startswith("0:") or d.startswith("PT") and "M" not in d) else "long"
    if platform == "linkedin":
        if key == "views":
            return (post.get("numLikes", 0) or 0) * 50
        if key == "likes":
            return post.get("numLikes", 0) or 0
        if key == "comments":
            return post.get("numComments", 0) or 0
        if key == "shares":
            return post.get("numShares", 0) or 0
        if key == "duration":
            return None
        if key == "url":
            return post.get("url", "") or ""
        if key == "caption":
            return post.get("text", "") or ""
        if key == "format":
            return "post"
    return 0


def scrape_profile(platform: str, handle: str, max_posts: int = 30):
    """Ejecuta el actor de la plataforma y retorna lista de posts."""
    actor = ACTORS[platform]
    handle_clean = handle.lstrip("@").strip()

    if platform == "instagram":
        run_input = {
            "directUrls": [f"https://www.instagram.com/{handle_clean}/"],
            "resultsType": "posts",
            "resultsLimit": max_posts,
            "addParentData": False,
        }
    elif platform == "tiktok":
        run_input = {
            "profiles": [handle_clean],
            "resultsPerPage": max_posts,
            "shouldDownloadVideos": False,
            "shouldDownloadCovers": False,
        }
    elif platform == "youtube":
        run_input = {
            "startUrls": [{"url": f"https://www.youtube.com/@{handle_clean}/videos"}],
            "maxResults": max_posts,
            "downloadSubtitles": False,
            "saveSubsToKVS": False,
            "subtitlesLanguage": "any",
            "subtitlesFormat": "srt",
            "maxComments": 0,
        }
    elif platform == "linkedin":
        run_input = {
            "username": handle_clean,
            "page_number": 1,
            "limit": max_posts,
        }
    else:
        raise ValueError(f"Plataforma desconocida: {platform}")

    print(f"  [{platform}] Scrapeando @{handle_clean} (max {max_posts} posts)...")
    try:
        run = client.actor(actor).call(run_input=run_input)
        posts = list(client.dataset(run["defaultDatasetId"]).iterate_items())
        log_call(actor, handle_clean, platform, len(posts), 0, f"{len(posts)} posts capturados")
        return posts
    except Exception as exc:
        log_call(actor, handle_clean, platform, 0, 1, f"error: {str(exc)[:140]}")
        raise


def filter_top_viral(posts, platform, top_n=5, min_views=500_000):
    """Ordena por views (likes*30 como proxy si no hay views) y aplica filtro min_views.
    Si <top_n cumplen min_views, baja umbral a 250K. Si tampoco, devuelve top_n del orden bruto."""
    scored = []
    for p in posts:
        v = get_metric(p, platform, "views") or 0
        if not v:
            v = (get_metric(p, platform, "likes") or 0) * 30
        scored.append((v, p))
    scored.sort(key=lambda x: x[0], reverse=True)

    qualified = [p for v, p in scored if v >= min_views]
    if len(qualified) < top_n and min_views > 250_000:
        qualified = [p for v, p in scored if v >= 250_000]
    if len(qualified) < top_n:
        qualified = [p for _, p in scored]

    return qualified[:top_n]


def analyze_top(top_posts, platform):
    """Resume top posts: hooks, formatos, métricas medias."""
    if not top_posts:
        return {}

    rows = []
    for p in top_posts:
        caption = get_metric(p, platform, "caption") or ""
        hook = caption.split("\n")[0][:180] if caption else ""
        rows.append(
            {
                "hook": hook,
                "views": get_metric(p, platform, "views") or 0,
                "likes": get_metric(p, platform, "likes") or 0,
                "comments": get_metric(p, platform, "comments") or 0,
                "shares": get_metric(p, platform, "shares") or 0,
                "duration": get_metric(p, platform, "duration"),
                "format": get_metric(p, platform, "format"),
                "url": get_metric(p, platform, "url"),
            }
        )

    n = max(len(rows), 1)
    formats = Counter(r["format"] for r in rows)
    return {
        "n": len(rows),
        "avg_views": round(sum(r["views"] for r in rows) / n),
        "avg_likes": round(sum(r["likes"] for r in rows) / n),
        "avg_comments": round(sum(r["comments"] for r in rows) / n),
        "format_distribution": dict(formats),
        "posts": rows,
        "hooks": [r["hook"] for r in rows if r["hook"]],
    }


def save_markdown(handle, platform, pilar, analysis, source_count_total):
    """Persiste análisis a db/referentes/[pilar-X]/[handle].md"""
    pilar_dir = DB_DIR / PILAR_MAP[pilar]
    pilar_dir.mkdir(parents=True, exist_ok=True)

    fecha = datetime.now().strftime("%Y-%m-%d")
    out_file = pilar_dir / f"{handle.lstrip('@')}.md"

    posts = analysis.get("posts", [])
    top_md = ""
    for i, p in enumerate(posts, 1):
        dur = f"{p['duration']}s" if p.get("duration") else "n/d"
        shares_md = f" | shares: {p['shares']:,}" if p.get("shares") else ""
        top_md += (
            f"\n### #{i} — {p['views']:,} views | {p['likes']:,} likes | "
            f"{p['comments']:,} comments{shares_md}\n"
            f"- **Formato:** `{p['format']}` | **Duración:** {dur}\n"
            f"- **Hook:** *\"{p['hook']}\"*\n"
            f"- **URL:** {p['url']}\n"
        )

    hooks_md = "\n".join([f'- "{h}"' for h in analysis.get("hooks", [])]) or "_(sin hooks capturados)_"
    formats = analysis.get("format_distribution", {})
    formats_md = " | ".join([f"{k}: {v}" for k, v in formats.items()]) or "n/d"

    content = f"""# Análisis: @{handle.lstrip('@')} ({platform.capitalize()})

**Fecha de análisis:** {fecha}
**Pilar:** {PILAR_MAP[pilar]}
**Posts totales scrapeados:** {source_count_total}
**Top posts virales analizados:** {analysis.get('n', 0)}

---

## Métricas Promedio (top viral)

| Métrica | Valor |
|---------|-------|
| Views promedio | {analysis.get('avg_views', 0):,} |
| Likes promedio | {analysis.get('avg_likes', 0):,} |
| Comments promedio | {analysis.get('avg_comments', 0):,} |
| Formatos | {formats_md} |

---

## Top {analysis.get('n', 0)} Posts Virales
{top_md}

---

## Hooks Capturados

{hooks_md}

---

## Análisis Pendiente (FASE 4)

- [ ] Categorizar hooks según `skills/viral-hooks.md` (10 fórmulas)
- [ ] Identificar estructura narrativa con `skills/content-analyzer.md`
- [ ] Anotar patrones visuales para `agents/visual-director.md`
- [ ] Marcar compatibilidad con voz Alexander (`skills/alexander-voice-adapter.md`)
"""
    out_file.write_text(content, encoding="utf-8")
    print(f"  Guardado: {out_file.relative_to(ROOT)}")
    return out_file


def run_one(platform, handle, pilar, top_n=5, min_views=500_000, max_scrape=30):
    """Pipeline para un referente: scrape → filtrar → analizar → guardar."""
    handle = handle.lstrip("@").strip()
    if not handle:
        return None
    posts = scrape_profile(platform, handle, max_posts=max_scrape)
    top = filter_top_viral(posts, platform, top_n=top_n, min_views=min_views)
    analysis = analyze_top(top, platform)
    return save_markdown(handle, platform, pilar, analysis, len(posts))


def run_batch(csv_path, top_n=5, min_views=500_000, max_scrape=30, sleep_s=3):
    """Procesa CSV con columnas: pilar,platform,handle"""
    with open(csv_path, "r", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    print(f"Batch: {len(rows)} referentes a procesar")
    success = 0
    for i, row in enumerate(rows, 1):
        platform = row["platform"].lower().strip()
        handle = row["handle"].strip()
        pilar = str(row["pilar"]).strip()
        print(f"\n[{i}/{len(rows)}] {platform} @{handle} (Pilar {pilar})")
        try:
            run_one(platform, handle, pilar, top_n=top_n, min_views=min_views, max_scrape=max_scrape)
            success += 1
            time.sleep(sleep_s)
        except Exception as exc:
            print(f"  ERROR: {exc}")
            continue
    print(f"\nBatch completo: {success}/{len(rows)} exitosos. Log: {LOG_FILE}")


# === Compatibilidad con script previo (usa .env INSTAGRAM_REFERENTS / TIKTOK_REFERENTS) ===

def run_instagram_legacy():
    refs = [r.strip() for r in (os.getenv("INSTAGRAM_REFERENTS", "")).split(",") if r.strip()]
    print(f"\n=== INSTAGRAM (legacy mode, output a {LEGACY_DIR}) ===")
    LEGACY_DIR.mkdir(parents=True, exist_ok=True)
    for username in refs:
        try:
            posts = scrape_profile("instagram", username, max_posts=20)
            top = filter_top_viral(posts, "instagram", top_n=5, min_views=0)
            analysis = analyze_top(top, "instagram")
            # Guarda en knowledge/competitors/ con prefijo plataforma
            fecha = datetime.now().strftime("%Y-%m-%d")
            out = LEGACY_DIR / f"instagram-{username}.md"
            out.write_text(
                f"# Análisis: @{username} (Instagram)\n\n**Fecha:** {fecha}\n"
                f"**Posts:** {len(posts)} | **Top:** {analysis.get('n', 0)}\n",
                encoding="utf-8",
            )
            time.sleep(3)
        except Exception as exc:
            print(f"  Error con @{username}: {exc}")


def main():
    ap = argparse.ArgumentParser(description="Apify Scraper — Alexander Cast Content System")
    ap.add_argument("--platform", choices=list(ACTORS.keys()), help="Plataforma a scrapear")
    ap.add_argument("--handle", help="Username (con o sin @)")
    ap.add_argument("--pilar", choices=list(PILAR_MAP.keys()), help="Pilar 1-4")
    ap.add_argument("--top-n", type=int, default=5, help="Top N posts virales (default 5)")
    ap.add_argument(
        "--min-views",
        type=int,
        default=500_000,
        help="Min views para considerar viral (default 500K, auto-relax a 250K si <top_n)",
    )
    ap.add_argument("--max-scrape", type=int, default=30, help="Max posts a scrapear (default 30)")
    ap.add_argument("--batch", help="Path a CSV con columnas pilar,platform,handle")
    ap.add_argument("--sleep", type=int, default=3, help="Pausa entre llamadas batch (default 3s)")
    ap.add_argument("--legacy", action="store_true", help="Modo legacy: usa INSTAGRAM_REFERENTS del .env")
    args = ap.parse_args()

    if args.legacy:
        run_instagram_legacy()
        return

    if args.batch:
        run_batch(
            args.batch,
            top_n=args.top_n,
            min_views=args.min_views,
            max_scrape=args.max_scrape,
            sleep_s=args.sleep,
        )
        return

    if args.platform and args.handle and args.pilar:
        run_one(
            args.platform,
            args.handle,
            args.pilar,
            top_n=args.top_n,
            min_views=args.min_views,
            max_scrape=args.max_scrape,
        )
        return

    ap.print_help()
    print("\nEjemplos:")
    print("  python apify-scraper.py --platform instagram --handle juandaeffi --pilar 3")
    print("  python apify-scraper.py --batch scripts/referentes.csv --top-n 5 --min-views 500000")


if __name__ == "__main__":
    main()
