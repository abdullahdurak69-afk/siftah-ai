# backup.sh ve restore.sh tarafından içe alınır (source). Yedek deposunun (Cloudflare R2) bilgilerini .env'den
# okuyup rclone'a ortam değişkeni olarak verir; sunucuda ayrıca `rclone config` gerekmez.
#   R2_ENDPOINT=https://<hesap-id>.eu.r2.cloudflarestorage.com   (R2 → bucket → Settings → S3 API)
#   R2_ACCESS_KEY_ID=...  R2_SECRET_ACCESS_KEY=...                (R2 → Manage API tokens)
#   R2_BUCKET=siftah-yedek
# R2_* boşsa `rclone config` ile kurulmuş "yedek" uzak deposu kullanılır (BACKUP_REMOTE ile değiştirilebilir).

env_value() {
  { grep -E "^$1=" .env || true; } | tail -1 | cut -d= -f2- | sed -E 's/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/'
}

if [ -n "$(env_value R2_BUCKET)" ]; then
  export RCLONE_CONFIG_R2_TYPE=s3
  export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
  RCLONE_CONFIG_R2_ENDPOINT="$(env_value R2_ENDPOINT)"
  RCLONE_CONFIG_R2_ACCESS_KEY_ID="$(env_value R2_ACCESS_KEY_ID)"
  RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$(env_value R2_SECRET_ACCESS_KEY)"
  export RCLONE_CONFIG_R2_ENDPOINT RCLONE_CONFIG_R2_ACCESS_KEY_ID RCLONE_CONFIG_R2_SECRET_ACCESS_KEY
  # Sadece tek bir bucket'a yetkili anahtar bucket oluşturamaz/listeleyemez; rclone denemesin
  export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true
  for key in R2_ENDPOINT R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY; do
    [ -n "$(env_value $key)" ] || { echo "HATA: .env içinde $key boş" >&2; exit 1; }
  done
  REMOTE="r2:$(env_value R2_BUCKET)"
else
  REMOTE="${BACKUP_REMOTE:-yedek:site-platform-yedek}"   # rclone config'deki uzak depo adı
fi
