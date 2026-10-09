#!/usr/bin/env bash
# Bekleyen müşteri domain'lerini kontrol eder.
# Crontab: */10 * * * * /opt/site-platform/deploy/cron-domains.sh >> /var/log/site-platform-domains.log 2>&1
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose -f deploy/docker-compose.yml --env-file .env exec -T app node -e '
fetch("http://localhost:3000/api/cron/domains", { headers: { authorization: "Bearer " + process.env.CRON_SECRET } })
  .then((r) => r.text()).then((t) => console.log(new Date().toISOString(), t))
  .catch((e) => { console.error(e); process.exit(1); })'
