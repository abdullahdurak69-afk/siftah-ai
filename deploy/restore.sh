#!/usr/bin/env bash
# Yedekten geri yükleme. Kullanım: deploy/restore.sh 2026-10-09_0330
# DİKKAT: Mevcut veritabanı ve fotoğraflar yedektekiyle değiştirilir.
set -euo pipefail

STAMP="${1:?Yedek zamanını verin, ör. 2026-10-09_0330}"
cd "$(dirname "$0")/.."
COMPOSE="docker compose -f deploy/docker-compose.yml --env-file .env"
. deploy/r2.sh   # REMOTE: yedek deposu (R2)
DIR="/var/backups/site-platform"

mkdir -p "$DIR"
[ -f "$DIR/db_$STAMP.dump" ] || rclone copy "$REMOTE" "$DIR" --include "*_$STAMP.*"

read -r -p "Veritabanı ve fotoğraflar $STAMP yedeğiyle değiştirilecek. Devam? (evet/hayır) " answer
[ "$answer" = "evet" ] || exit 1

$COMPOSE exec -T db pg_restore -U site_platform -d site_platform --clean --if-exists < "$DIR/db_$STAMP.dump"
$COMPOSE exec -T app sh -c 'rm -rf /app/.media/* && tar -C /app/.media -xzf -' < "$DIR/media_$STAMP.tar.gz"
$COMPOSE restart app
echo "Geri yükleme tamam."
