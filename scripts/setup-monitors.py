"""
setup-monitors.py
Crea el monitor semanal de NewsCatcher para P3 (Live Shopping).
P1 y P2 usan Tavily Search API directamente (sin monitor).

El plan CatchAll permite 1 monitor activo. Este script configura únicamente P3,
que es el pilar más de nicho y el que más se beneficia de investigación profunda.

Ejecutar UNA SOLA VEZ. El ID queda guardado en .env.
Uso: python scripts/setup-monitors.py
"""

import os, sys, time, json, requests
from pathlib import Path

# ─── Config ───────────────────────────────────────────────────────────────────
BASE_URL = "https://catchall.newscatcherapi.com"
ENV_PATH = Path(__file__).parent.parent / ".env"

def get_api_key():
    for line in ENV_PATH.read_text().splitlines():
        if line.startswith("NEWSCATCHER_API_KEY="):
            return line.split("=", 1)[1].strip()
    raise ValueError("NEWSCATCHER_API_KEY no encontrada en .env")

HEADERS = lambda key: {"X-API-Key": key, "Content-Type": "application/json"}

P3_QUERY = (
    "live shopping live commerce TikTok Shop ecommerce LATAM Colombia "
    "ventas en vivo falsos lives creadores marcas tendencias"
)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def submit_job(query: str, api_key: str) -> str:
    resp = requests.post(
        f"{BASE_URL}/catchAll/submit",
        headers=HEADERS(api_key),
        json={"query": query, "limit": 10},
    )
    resp.raise_for_status()
    return resp.json()["job_id"]


def poll_until_done(job_id: str, api_key: str, timeout: int = 1200) -> bool:
    print(f"   Esperando que el job {job_id[:8]}... esté listo ", end="", flush=True)
    start = time.time()
    while time.time() - start < timeout:
        resp = requests.get(
            f"{BASE_URL}/catchAll/status/{job_id}",
            headers=HEADERS(api_key),
        )
        status = resp.json().get("status", "")
        if status in ("enriched", "completed", "done"):
            print(" ✓")
            return True
        print(".", end="", flush=True)
        time.sleep(30)
    print(" TIMEOUT")
    return False


def create_monitor(job_id: str, api_key: str) -> str | None:
    resp = requests.post(
        f"{BASE_URL}/catchAll/monitors/create",
        headers=HEADERS(api_key),
        json={"reference_job_id": job_id, "schedule": "0 9 * * 0"},
    )
    data = resp.json()
    return data.get("monitor_id")


def update_env(key: str, value: str):
    content = ENV_PATH.read_text()
    lines = content.splitlines()
    updated = [f"{key}={value}" if line.startswith(f"{key}=") else line for line in lines]
    ENV_PATH.write_text("\n".join(updated))


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    api_key = get_api_key()
    print("🔑 API key cargada\n")
    print("━━━ P3: Live Shopping + Ecommerce ━━━")
    print("   Nota: P1 y P2 usan Tavily (plan CatchAll = 1 monitor activo)\n")

    # 1. Enviar job
    print("   Enviando job base...")
    try:
        job_id = submit_job(P3_QUERY, api_key)
        print(f"   Job ID: {job_id}")
    except requests.HTTPError as e:
        print(f"   ✗ Error: {e.response.text}")
        sys.exit(1)

    # 2. Esperar que esté listo
    if not poll_until_done(job_id, api_key):
        print("   ✗ Job no terminó a tiempo")
        sys.exit(1)

    # 3. Crear monitor
    monitor_id = create_monitor(job_id, api_key)
    if not monitor_id:
        print("   ✗ No se pudo crear el monitor")
        sys.exit(1)

    print(f"   ✓ Monitor creado: {monitor_id}")

    # 4. Guardar en .env y monitors.json
    update_env("NEWSCATCHER_MONITOR_P3", monitor_id)
    summary_path = Path(__file__).parent.parent / "news" / "monitors.json"
    summary_path.write_text(json.dumps({"P3": monitor_id}, indent=2, ensure_ascii=False))

    print(f"\n✅ Listo. Monitor P3 guardado:")
    print(f"   .env  → NEWSCATCHER_MONITOR_P3={monitor_id}")
    print(f"   news/monitors.json")


if __name__ == "__main__":
    main()
