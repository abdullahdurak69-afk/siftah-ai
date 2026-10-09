#!/usr/bin/env bash
# Yeni sürümü yayına alır: kodu çeker, imajları derler, migration'ları çalıştırır, uygulamayı yeniler.
set -euo pipefail
cd "$(dirname "$0")/.."
git pull --ff-only
docker compose -f deploy/docker-compose.yml --env-file .env up -d --build
docker image prune -f
