# Sunucu kurulumu

Bu rehber, platformu bir VPS'e ilk kez kurmak için adım adım yapılacakları anlatır.
**Senin yapacakların** 1–3. adımlar; 4. adımdan itibaren sunucuya erişim verirsen kurulumu ben yaparım.

Sunucuda çalışacak yapı:

```
İnternet ──► Caddy (80/443, otomatik SSL)
                 ├── platformadi.com, *.platformadi.com  → wildcard sertifika (Cloudflare DNS)
                 └── müşteri domain'leri                  → ilk ziyarette otomatik sertifika
             ──► Next.js uygulaması (app:3000)
             ──► PostgreSQL (sadece iç ağda)
Gece 03:30  ──► Veritabanı + fotoğraf yedeği → Cloudflare R2
Her 10 dk   ──► Bekleyen müşteri domain'lerinin DNS kontrolü
```

---

## 1. Satın alınacaklar

| Ne | Önerilen | Not |
| --- | --- | --- |
| VPS | 2 vCPU, 4 GB RAM, 40 GB+ SSD, **Ubuntu 24.04** | Türkiye'de bir sağlayıcı (KVKK) ya da Hetzner. Yüzlerce site için yeterli. |
| Platform domain'i | Ör. `platformadi.com` | Müşteri siteleri `firma.platformadi.com` olarak açılır. |
| Cloudflare hesabı | Ücretsiz plan | Sadece platform domain'inin DNS'i için. Müşteri domain'leri Cloudflare'e taşınmaz. |
| Cloudflare R2 | Ücretsiz katman (10 GB) | Gece yedekleri sunucu dışında dursun diye. |

## 2. Platform domain'ini Cloudflare'e bağla

1. Cloudflare'de **Add a site** ile `platformadi.com`'u ekle, ücretsiz planı seç.
2. Cloudflare'in verdiği iki nameserver adresini domain'i aldığın firmanın panelinde domain'in nameserver ayarına yaz.
3. Cloudflare **DNS** sayfasında şu kayıtları ekle. Hepsinde **Proxy kapalı olmalı (gri bulut, "DNS only")**:

| Tür | Ad | Değer |
| --- | --- | --- |
| A | `@` | sunucu IP adresi |
| A | `*` | sunucu IP adresi |
| A | `cname` | sunucu IP adresi |

> `*` kaydı `app.` (panel) ve bütün müşteri subdomain'lerini sunucuya yönlendirir.
> `cname` kaydı, müşterilerin alt alan adlarını (ör. `site.firmam.com`) CNAME ile bağlayabilmesi içindir.

4. **My Profile → API Tokens → Create Token → "Edit zone DNS"** şablonu. Zone olarak sadece `platformadi.com`'u seç. Oluşan token'ı sakla (Caddy wildcard sertifikayı bununla alacak).

## 3. Sunucuya erişim

Sunucu hazır olunca bana şunları ilet:
- Sunucunun **IP adresi**
- **SSH erişimi:** Sağlayıcının panelinden sunucuya bir SSH anahtarı ekle (şifre değil). Bilgisayarında yoksa
  `ssh-keygen -t ed25519` ile oluşturabilirsin; `~/.ssh/id_ed25519.pub` dosyasının içeriğini panele yapıştır.
- Cloudflare API token'ını ve R2 bilgilerini **sohbete yazma**; kurulum sırasında sunucudaki `.env` dosyasına
  senin girmen için yeri hazırlayacağım.

---

## 4. Sunucunun hazırlanması (ilk kurulum)

```bash
# Güncellemeler ve otomatik güvenlik yamaları
apt update && apt upgrade -y
apt install -y unattended-upgrades ufw git rclone
dpkg-reconfigure -f noninteractive unattended-upgrades

# Güvenlik duvarı: sadece SSH, HTTP, HTTPS
ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 443/udp
ufw --force enable

# SSH'a şifreyle girişi kapat (sadece anahtar)
sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config && systemctl reload ssh

# Docker
curl -fsSL https://get.docker.com | sh
```

## 5. Uygulamanın kurulması

```bash
git clone <repo-adresi> /opt/site-platform
cd /opt/site-platform
cp deploy/env.example .env
nano .env        # tüm değerleri doldur (gizli değerler için: openssl rand -hex 24)

docker compose -f deploy/docker-compose.yml --env-file .env up -d --build

# İlk süper admin hesabı (.env içindeki SEED_ADMIN_* ile)
docker compose -f deploy/docker-compose.yml --env-file .env run --rm migrate npm run db:seed
```

Kontrol: `https://app.platformadi.com` açılmalı ve geçerli bir sertifikası olmalı.

## 6. Yedekleme ve zamanlanmış görevler

```bash
# R2 bağlantısı (Cloudflare R2 → Manage API Tokens ile alınan bilgilerle)
rclone config   # adı "yedek" olan, türü "s3", sağlayıcısı "Cloudflare" bir uzak depo oluştur

crontab -e
```

```
30 3 * * *  /opt/site-platform/deploy/backup.sh       >> /var/log/site-platform-backup.log 2>&1
*/10 * * * * /opt/site-platform/deploy/cron-domains.sh >> /var/log/site-platform-domains.log 2>&1
```

**Yedekten geri dönüşü en az bir kez dene:** `deploy/restore.sh <yedek-zamanı>`

## 7. İzleme

[UptimeRobot](https://uptimerobot.com) (ücretsiz) ile `https://app.platformadi.com/api/health` adresine 5 dakikada bir
istek atan bir izleyici kur. Site çökerse veya veritabanına ulaşılamazsa e-posta/telefon bildirimi gelir.

## Güncelleme

```bash
/opt/site-platform/deploy/update.sh
```

Kodu çeker, imajları yeniden derler, veritabanı şemasını günceller ve uygulamayı yeniden başlatır.

---

## Sorun giderme

| Belirti | Kontrol |
| --- | --- |
| Site açılmıyor | `docker compose -f deploy/docker-compose.yml ps` ve `... logs app --tail 100` |
| Sertifika alınamıyor | `... logs caddy --tail 100`. Cloudflare kayıtlarında proxy kapalı mı? Token doğru mu? |
| Müşteri domain'i bağlanmıyor | Panelde "Kontrol et"in verdiği mesaj. Domain'in A kaydı sunucu IP'sini gösteriyor mu? |
| Disk doluyor | `docker system df`, `du -sh /var/backups/site-platform` |
