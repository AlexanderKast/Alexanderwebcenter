#!/bin/bash
# Backup del directorio memory/ a GitHub
# Protege el historial de performance y preferencias del sistema
# Requiere: GITHUB_PAT en .env

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env"
MEMORY_DIR="$PROJECT_ROOT/memory"
BACKUP_DIR="$PROJECT_ROOT/outputs/reports"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Cargar .env
if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
fi

echo "💾 Iniciando backup de memoria del sistema..."

# Verificar que existe el directorio memory/
if [ ! -d "$MEMORY_DIR" ]; then
  echo "ℹ️  No existe directorio memory/ — nada que respaldar."
  echo "    El directorio se crea automáticamente cuando el sistema genera análisis."
  exit 0
fi

# Crear directorio de reports si no existe
mkdir -p "$BACKUP_DIR"

# Crear snapshot comprimido del directorio memory/
BACKUP_FILE="$BACKUP_DIR/memory-backup-${TIMESTAMP}.tar.gz"
tar -czf "$BACKUP_FILE" -C "$PROJECT_ROOT" memory/

echo "✅ Backup local creado: $BACKUP_FILE"

# Listar archivos incluidos
echo ""
echo "📁 Archivos en memory/:"
find "$MEMORY_DIR" -type f -name "*.md" -o -name "*.json" | sort | while read file; do
  SIZE=$(wc -c < "$file" 2>/dev/null || echo "?")
  echo "  $(basename $file) (${SIZE} bytes)"
done

# Limpiar backups locales con más de 30 días
echo ""
echo "🧹 Limpiando backups locales de más de 30 días..."
find "$BACKUP_DIR" -name "memory-backup-*.tar.gz" -mtime +30 -delete 2>/dev/null && echo "  Limpieza completada" || echo "  No había archivos antiguos"

# Si hay GitHub PAT, hacer push de memory/ al repo
if [ -n "$GITHUB_PAT" ]; then
  REPO_URL="https://${GITHUB_PAT}@github.com/AlexanderKast/obsidian-brain.git"
  OBSIDIAN_DIR="$HOME/obsidian-brain"

  if [ -d "$OBSIDIAN_DIR/.git" ]; then
    echo ""
    echo "🔄 Sincronizando memory/ con GitHub..."

    VAULT_MEMORY="$OBSIDIAN_DIR/02 - Areas/Alexander Cast Content System/memory"
    mkdir -p "$VAULT_MEMORY"
    cp -r "$MEMORY_DIR/." "$VAULT_MEMORY/"

    cd "$OBSIDIAN_DIR"
    git add "02 - Areas/Alexander Cast Content System/memory/"

    if ! git diff --staged --quiet; then
      git commit -m "Memory backup: $(date '+%Y-%m-%d %H:%M') — Alexander Cast Content System"
      git push origin main
      echo "✅ Memory sincronizada con GitHub"
    else
      echo "ℹ️  Sin cambios en memory/ desde el último backup"
    fi
  else
    echo "ℹ️  Repositorio Obsidian no clonado localmente. Ejecuta obsidian-sync.sh primero."
  fi
else
  echo "ℹ️  GITHUB_PAT no encontrado — backup solo local"
fi

echo ""
echo "✅ Backup completado: $BACKUP_FILE"
