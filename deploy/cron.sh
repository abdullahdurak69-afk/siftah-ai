#!/usr/bin/env bash
# Zamanlanmış görevleri uygulamanın /api/cron/<görev> ucuna istek atarak çalıştırır.
#   cron.sh domains   bekleyen müşteri domain'lerini kontrol eder (10 dakikada bir)
#   cron.sh daily     abonelik hatırlatmaları + istatistik temizliği (her sabah)
# Crontab örnekleri deploy/KURULUM.md içinde.
set -euo pipefail
TASK="${1:?Kullanım: cron.sh <domains|daily>}"
cd "$(dirname "$0")/.."
docker compose -f deploy/docker-compose.yml --env-file .env exec -T -e TASK="$TASK" app node -e '
fetch("http://localhost:3000/api/cron/" + process.env.TASK, { headers: { authorization: "Bearer " + process.env.CRON_SECRET } })
  .then(async (r) => { const t = await r.text(); console.log(new Date().toISOString(), process.env.TASK, r.status, t); if (!r.ok) process.exit(1); })
  .catch((e) => { console.error(e); process.exit(1); })'
