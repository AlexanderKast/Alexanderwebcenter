"""
generate-placeholders.py — Genera archivos de perfil vacíos para los referentes
del CSV que aún no tienen .md en db/referentes/.

Uso:
  python scripts/generate-placeholders.py

Behavior:
- Lee scripts/referentes.csv (columnas: pilar, platform, handle, nombre, plataforma_principal_followers).
- Para cada fila, genera db/referentes/[pilar]/[handle].md SOLO si NO existe.
- No sobreescribe archivos con data Apify ya capturada.
- Schema esperado por el scraper Apify, listo para enriquecer con `--batch`.
"""

import csv
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "scripts" / "referentes.csv"
DB_DIR = ROOT / "db" / "referentes"

PILAR_MAP = {
    "1": "pilar-1-mentalidad-fe",
    "2": "pilar-2-ia-aplicada",
    "3": "pilar-3-live-shopping",
    "4": "pilar-4-contenido",
}

PLATFORM_LABEL = {
    "instagram": "Instagram",
    "tiktok": "TikTok",
    "youtube": "YouTube",
    "linkedin": "LinkedIn",
    "twitter": "X/Twitter",
    "x": "X/Twitter",
}


def gen_placeholder(pilar: str, platform: str, handle: str, nombre: str, followers_label: str) -> str:
    fecha = datetime.now().strftime("%Y-%m-%d")
    plat = PLATFORM_LABEL.get(platform.lower(), platform.capitalize())
    handle_clean = handle.lstrip("@").strip()

    return f"""# Análisis: @{handle_clean} ({plat})

**Fecha de creación:** {fecha} (placeholder — pendiente data Apify)
**Pilar:** {PILAR_MAP[pilar]}
**Nombre:** {nombre}
**Followers (plataforma principal):** {followers_label}
**Plataforma principal scrapeable:** {platform}

---

## Estado

🟡 **Placeholder** — este archivo se completará automáticamente al ejecutar:

```
python scripts/apify-scraper.py --platform {platform} --handle {handle_clean} --pilar {pilar} --top-n 5 --min-views 500000
```

O batch completo:

```
python scripts/apify-scraper.py --batch scripts/referentes.csv --top-n 5 --min-views 500000
```

---

## Métricas Promedio (top viral)

| Métrica | Valor |
|---------|-------|
| Views promedio | _(pendiente)_ |
| Likes promedio | _(pendiente)_ |
| Comments promedio | _(pendiente)_ |
| Formatos | _(pendiente)_ |

---

## Top 5 Posts Virales

_(pendiente captura Apify)_

---

## Hooks Capturados

_(pendiente)_

---

## Análisis Pendiente (FASE 4)

- [ ] Ejecutar scraping Apify para llenar este perfil
- [ ] Categorizar hooks según `skills/viral-hooks.md` (10 fórmulas)
- [ ] Identificar estructura narrativa con `skills/content-analyzer.md`
- [ ] Anotar patrones visuales para `agents/visual-director.md`
- [ ] Marcar compatibilidad con voz Alexander (`skills/alexander-voice-adapter.md`)
"""


def main():
    if not CSV_PATH.exists():
        print(f"ERROR: no encontré {CSV_PATH}")
        return

    with open(CSV_PATH, "r", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    print(f"CSV: {len(rows)} referentes\n")

    created = 0
    skipped = 0
    for row in rows:
        pilar = str(row["pilar"]).strip()
        platform = row["platform"].lower().strip()
        handle = row["handle"].strip()
        nombre = row.get("nombre", "").strip() or handle
        followers = row.get("plataforma_principal_followers", "").strip() or "no verificado"

        if pilar not in PILAR_MAP:
            print(f"  SKIP — pilar inválido: {pilar} (handle: {handle})")
            continue

        pilar_dir = DB_DIR / PILAR_MAP[pilar]
        pilar_dir.mkdir(parents=True, exist_ok=True)
        out_file = pilar_dir / f"{handle.lstrip('@')}.md"

        if out_file.exists():
            print(f"  SKIP existing — {out_file.relative_to(ROOT)}")
            skipped += 1
            continue

        content = gen_placeholder(pilar, platform, handle, nombre, followers)
        out_file.write_text(content, encoding="utf-8")
        print(f"  CREATED — {out_file.relative_to(ROOT)}")
        created += 1

    print(f"\nResumen: {created} creados, {skipped} ya existentes (no sobreescritos)")
    print(f"Total referentes en DB: {created + skipped}/{len(rows)}")


if __name__ == "__main__":
    main()
