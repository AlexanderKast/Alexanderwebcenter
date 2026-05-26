"""
news-briefing.py — Briefing semanal híbrido para Alexander Cast

Estrategia:
  P1 (Mentalidad+Fe)           → Tavily Search API  (búsqueda rápida, amplia)
  P2 (IA+Estrategia Digital)   → Tavily Search API
  P3 (Live Shopping+Ecommerce) → NewsCatcher Monitor (investigación profunda, nicho)

Corre automáticamente cada domingo via Windows Task Scheduler.
Genera news/latest-brief.md (lo lee Claude Code) y news/YYYY-MM-DD-brief.md.

Uso manual: python scripts/news-briefing.py
"""

import json, os, sys, requests
from datetime import datetime, timezone
from pathlib import Path

# Forzar UTF-8 en consola Windows
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ─── Config ───────────────────────────────────────────────────────────────────
ROOT     = Path(__file__).parent.parent
ENV_PATH = ROOT / ".env"
NEWS_DIR = ROOT / "news"
NEWS_DIR.mkdir(exist_ok=True)

NC_BASE  = "https://catchall.newscatcherapi.com"
TV_BASE  = "https://api.tavily.com"

PILARES = {
    "P1": {
        "nombre": "Mentalidad + Fe",
        "emoji": "🧠",
        "fuente": "tavily",
        "queries": [
            "emprendimiento mentalidad fe negocios LATAM Colombia 2026",
            "resiliencia emprendedores fracaso exito negocios digitales",
        ],
    },
    "P2": {
        "nombre": "IA Aplicada + Estrategia Digital",
        "emoji": "🤖",
        "fuente": "tavily",
        "queries": [
            "inteligencia artificial aplicada negocios herramientas IA 2026",
            "UGC marketing digital contenido creadores LATAM tendencias",
            "automatizacion negocios IA agentes LATAM",
        ],
    },
    "P3": {
        "nombre": "Live Shopping + Ecommerce",
        "emoji": "🛒",
        "fuente": "newscatcher",
        "monitor_env": "NEWSCATCHER_MONITOR_P3",
    },
}

# ─── Helpers ──────────────────────────────────────────────────────────────────

def load_env() -> dict:
    env = {}
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env


# ─── Tavily ───────────────────────────────────────────────────────────────────

def tavily_search(queries: list, api_key: str) -> list:
    """Ejecuta varias queries en Tavily y retorna resultados únicos."""
    seen, results = set(), []
    for query in queries:
        try:
            resp = requests.post(
                f"{TV_BASE}/search",
                json={
                    "api_key": api_key,
                    "query": query,
                    "search_depth": "basic",
                    "max_results": 5,
                    "include_answer": True,
                },
                timeout=20,
            )
            resp.raise_for_status()
            data = resp.json()
            for r in data.get("results", []):
                url = r.get("url", "")
                if url not in seen:
                    seen.add(url)
                    results.append({
                        "title":   r.get("title", "Sin título"),
                        "url":     url,
                        "snippet": r.get("content", "")[:300],
                        "date":    r.get("published_date", "")[:10] if r.get("published_date") else "",
                        "query":   query,
                    })
        except Exception as e:
            print(f"    ✗ Tavily error ({query[:30]}...): {e}")
    return results


def format_tavily_results(results: list) -> list[str]:
    lines = []
    for i, r in enumerate(results[:8], 1):
        date = f" · {r['date']}" if r.get("date") else ""
        lines.append(f"**{i}. {r['title']}**{date}")
        if r.get("snippet"):
            lines.append(f"   {r['snippet'][:200]}...")
        lines.append(f"   🔗 {r['url']}")
        lines.append("")
    return lines


# ─── NewsCatcher ──────────────────────────────────────────────────────────────

def nc_monitor_pull(monitor_id: str, api_key: str) -> list:
    try:
        resp = requests.get(
            f"{NC_BASE}/catchAll/monitors/pull/{monitor_id}",
            headers={"X-API-Key": api_key},
            params={"limit": 15},
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("all_records", []) or data.get("results", []) or []
    except Exception as e:
        print(f"    ✗ NewsCatcher error: {e}")
        return []


def format_nc_record(record: dict, idx: int) -> list[str]:
    title      = record.get("record_title", "Sin título")
    enrichment = record.get("enrichment", {})
    citations  = record.get("citations", [])

    lines = [f"**{idx}. {title}**"]

    # Campos de enrichment más relevantes para contenido
    priority_keys = ["country", "platform", "market_region", "live_shopping_trend",
                     "growth_metrics", "ecommerce_category", "key_brands_or_sellers",
                     "event_date", "regulatory_or_policy_notes"]
    for key in priority_keys:
        val = enrichment.get(key)
        if val and isinstance(val, str) and val.strip() not in ("null", "None", ""):
            label = key.replace("_", " ").capitalize()
            lines.append(f"   - {label}: {val[:200]}")

    if citations:
        src  = citations[0]
        url  = src.get("link", "")
        date = (src.get("published_date", "") or "")[:10]
        if url:
            lines.append(f"   🔗 {url[:100]} {date}")
    lines.append("")
    return lines


# ─── Build brief ──────────────────────────────────────────────────────────────

def build_brief(env: dict) -> str:
    tv_key = env.get("TAVILY_API_KEY", "")
    nc_key = env.get("NEWSCATCHER_API_KEY", "")
    today  = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    week   = datetime.now(timezone.utc).strftime("Semana %W · %Y")

    out = [
        f"# Briefing Semanal — Alexander Cast",
        f"**Generado:** {today} | {week}",
        f"**Fuentes:** Tavily (P1, P2) + NewsCatcher Monitor (P3)",
        "",
        "> Usa este briefing para hooks de noticias reales, validar tendencias",
        "> y encontrar ángulos de contenido que nadie en tu nicho está cubriendo.",
        "",
        "---",
        "",
    ]

    for pid, cfg in PILARES.items():
        out += [
            f"## {cfg['emoji']} {pid} — {cfg['nombre']}",
            "",
        ]

        if cfg["fuente"] == "tavily":
            print(f"  {pid}: buscando con Tavily...")
            if not tv_key:
                out += ["_TAVILY_API_KEY no configurada en .env_", "", "---", ""]
                continue
            results = tavily_search(cfg["queries"], tv_key)
            if results:
                out += [f"**{len(results)} artículos relevantes:**", ""]
                out += format_tavily_results(results)
            else:
                out += ["_Sin resultados esta semana._", ""]

        else:  # newscatcher
            monitor_id = env.get(cfg["monitor_env"], "").strip()
            print(f"  {pid}: jalando NewsCatcher monitor {monitor_id[:8]}...")
            if not monitor_id or not nc_key:
                out += ["_Monitor no configurado. Verifica .env_", "", "---", ""]
                continue
            records = nc_monitor_pull(monitor_id, nc_key)
            if records:
                out += [f"**{len(records)} eventos encontrados (análisis profundo):**", ""]
                for i, rec in enumerate(records[:10], 1):
                    out += format_nc_record(rec, i)
            else:
                out += ["_Sin eventos nuevos esta semana._", ""]

        out += ["---", ""]

    out += [
        "## 💡 Cómo aplicar este briefing al contenido",
        "",
        "| Técnica | Cómo usarla |",
        "|---|---|",
        "| **Hook de noticia** | Cita el dato o evento real en los primeros 3 segundos |",
        "| **Contrarian** | Encuentra algo en las noticias con lo que puedas disentir |",
        "| **Tendencia emergente** | ¿Qué está pasando que nadie en LATAM está cubriendo? |",
        "| **Validación** | Antes de grabar, confirma que el tema está vigente aquí |",
        "| **Dato de autoridad** | Usa las métricas reales de los artículos en tu guión |",
        "",
        "_Próximo briefing: próximo domingo a las 9am automáticamente_",
    ]

    return "\n".join(out)


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("🗞️  Generando briefing semanal...\n")
    env   = load_env()
    brief = build_brief(env)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    (NEWS_DIR / f"{today}-brief.md").write_text(brief, encoding="utf-8")
    (NEWS_DIR / "latest-brief.md").write_text(brief, encoding="utf-8")

    print(f"\n✅ Listo:")
    print(f"   news/{today}-brief.md")
    print(f"   news/latest-brief.md  ← Claude Code lee este")


if __name__ == "__main__":
    main()
