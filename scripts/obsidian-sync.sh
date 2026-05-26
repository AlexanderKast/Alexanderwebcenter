#!/bin/bash
# Sincroniza el sistema de contenido con Obsidian via GitHub
# Requiere: GITHUB_PAT en .env en la raíz del proyecto

set -e

# Cargar variables de entorno
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: No se encontró .env en $PROJECT_ROOT"
  echo "Crea el archivo con: GITHUB_PAT=tu_token_aqui"
  exit 1
fi

source "$ENV_FILE"

if [ -z "$GITHUB_PAT" ]; then
  echo "ERROR: GITHUB_PAT no está definido en .env"
  exit 1
fi

# Configuración del repositorio Obsidian
REPO_URL="https://${GITHUB_PAT}@github.com/AlexanderKast/obsidian-brain.git"
OBSIDIAN_DIR="$HOME/obsidian-brain"
COMMIT_MSG="${1:-Sync: Alexander Cast Content System - $(date '+%Y-%m-%d %H:%M')}"

echo "🔄 Iniciando sincronización con Obsidian..."

# Si el repo no existe localmente, clonarlo
if [ ! -d "$OBSIDIAN_DIR/.git" ]; then
  echo "📥 Clonando repositorio Obsidian..."
  git clone "$REPO_URL" "$OBSIDIAN_DIR"
  echo "✅ Repositorio clonado en $OBSIDIAN_DIR"
fi

# Copiar archivos del sistema al vault de Obsidian
# Carpeta destino dentro del vault
VAULT_DEST="$OBSIDIAN_DIR/02 - Areas/Alexander Cast Content System"
mkdir -p "$VAULT_DEST"

echo "📋 Copiando archivos del sistema..."

# Copiar carpetas principales (excluyendo outputs y scripts)
for dir in core agents skills knowledge; do
  if [ -d "$PROJECT_ROOT/$dir" ]; then
    cp -r "$PROJECT_ROOT/$dir" "$VAULT_DEST/"
    echo "  ✓ $dir/"
  fi
done

# Copiar archivos raíz relevantes
for file in README.md CLAUDE.md .clinerules; do
  if [ -f "$PROJECT_ROOT/$file" ]; then
    cp "$PROJECT_ROOT/$file" "$VAULT_DEST/"
    echo "  ✓ $file"
  fi
done

# Entrar al repositorio Obsidian y hacer commit
cd "$OBSIDIAN_DIR"

# Pull primero para evitar conflictos
git pull origin main --rebase 2>/dev/null || echo "⚠️  Pull falló — continuando con push de todas formas"

# Agregar cambios
git add "02 - Areas/Alexander Cast Content System/"

# Verificar si hay cambios para commitear
if git diff --staged --quiet; then
  echo "ℹ️  No hay cambios nuevos para sincronizar."
  exit 0
fi

# Commit y push
git commit -m "$COMMIT_MSG"
git push origin main

echo ""
echo "✅ Sincronización completada exitosamente"
echo "   Repositorio: https://github.com/AlexanderKast/obsidian-brain"
echo "   Carpeta en Obsidian: 02 - Areas/Alexander Cast Content System/"
echo "   Commit: $COMMIT_MSG"
