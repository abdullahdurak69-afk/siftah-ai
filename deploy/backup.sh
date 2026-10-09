#!/usr/bin/env bash
# Gece yedeği: veritabanı + yüklenen fotoğraflar -> sunucu dışı depo (rclone ile Cloudflare R2 / Backblaze).
# Crontab: 30 3 * * * /opt/site-platform/deploy/backup.sh >> /var/log/site-platform-backup.log 2>&1
set -euo pipefail

cd "$(dirname "$0")/.."
COMPOSE="docker compose -f deploy/docker-compose.yml --env-file .env"
REMOTE="${BACKUP_REMOTE:-yedek:site-platform-yedek}"   # rclone config'deki uzak depo adı
STAMP="$(date +%Y-%m-%d_%H%M)"
DIR="/var/backups/site-platform"
KEEP_DAYS=30

mkdir -p "$DIR"

echo "[$STAMP] Veritabanı yedekleniyor"
$COMPOSE exec -T db pg_dump -U site_platform -d site_platform --format=custom > "$DIR/db_$STAMP.dump"

echo "[$STAMP] Fotoğraflar yedekleniyor"
$COMPOSE exec -T app tar -C /app/.media -czf - . > "$DIR/media_$STAMP.tar.gz"

echo "[$STAMP] Sunucu dışına kopyalanıyor ($REMOTE)"
rclone copy "$DIR" "$REMOTE" --include "*_$STAMP.*"

# Yerelde ve uzakta eski yedekleri temizle
find "$DIR" -type f -mtime +"$KEEP_DAYS" -delete
rclone delete "$REMOTE" --min-age "${KEEP_DAYS}d"

echo "[$STAMP] Tamam"
