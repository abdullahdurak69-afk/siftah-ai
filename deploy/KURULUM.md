# Sunucu kurulumu

Bu rehber, platformu bir VPS'e ilk kez kurmak için adım adım yapılacakları anlatır.
**Senin yapacakların** 1–3. adımlar; 4. adımdan itibaren sunucuya erişim verirsen kurulumu ben yaparım.

Sunucuda çalışacak yapı:

```
İnternet ──► Caddy (80/443, otomatik SSL)
                 ├── siftahai.com, app.siftahai.com       → standart sertifika (www ve siftahai.com.tr yönlenir)
                 └── müşteri domain'leri                   → ilk ziyarette otomatik sertifika
             ──► Next.js uygulaması (app:3000)
             ──► PostgreSQL (sadece iç ağda)
Gece 03:30  ──► Veritabanı + fotoğraf yedeği → Cloudflare R2
Her sabah   ──► Abonelik hatırlatma e-postaları, istatistik temizliği
Her 10 dk   ──► Bekleyen müşteri domain'lerinin DNS kontrolü
```

---

## 1. Satın alınacaklar

| Ne | Önerilen | Not |
| --- | --- | --- |
| VPS | 2 vCPU, 4 GB RAM, 40 GB+ SSD, **Ubuntu 24.04** | Türkiye'de bir sağlayıcı (KVKK) ya da Hetzner. Yüzlerce site için yeterli. |
| Platform domain'leri | `siftahai.com` (ana), `siftahai.com.tr` (yönlenir) | Alındı. Tanıtım sitesi ve panel (`app.`) burada; müşteri siteleri kendi domain'lerinde yayınlanır. |
| Cloudflare R2 | Ücretsiz katman (10 GB) | Gece yedekleri sunucu dışında dursun diye. |
| E-posta gönderimi | [Resend](https://resend.com) (ücretsiz: günde 100) veya Brevo | Davet, şifre yenileme ve abonelik hatırlatmaları. Platform domain'i sağlayıcıda doğrulanmalı (SPF/DKIM DNS kayıtları). |
| Hata izleme (isteğe bağlı) | [Sentry](https://sentry.io) ücretsiz planı veya kendi sunucunda GlitchTip | Sunucu hatalarını e-postayla bildirir. Kişisel veri gönderilmez. |

## 2. Platform domain'lerinin DNS kayıtları

Domain'leri aldığın firmanın panelinde (veya DNS'i Cloudflare'e taşıdıysan orada, **proxy kapalı / gri bulut**)
şu kayıtları ekle. Wildcard (`*`) kayda ve API token'ına gerek yok: müşteri siteleri platform subdomain'inde
yayınlanmaz.

`siftahai.com`:

| Tür | Ad | Değer |
| --- | --- | --- |
| A | `@` | sunucu IP adresi |
| A | `www` | sunucu IP adresi |
| A | `app` | sunucu IP adresi |
| A | `cname` | sunucu IP adresi |

`siftahai.com.tr` (ana adrese yönlenir):

| Tür | Ad | Değer |
| --- | --- | --- |
| A | `@` | sunucu IP adresi |
| A | `www` | sunucu IP adresi |

> `cname` kaydı, müşterilerin alt alan adlarını (ör. `site.firmam.com`) CNAME ile bağlayabilmesi içindir.

## 3. Sunucuya erişim

Sunucu hazır olunca bana şunları ilet:
- Sunucunun **IP adresi**
- **SSH erişimi:** Sağlayıcının panelinden sunucuya bir SSH anahtarı ekle (şifre değil). Bilgisayarında yoksa
  `ssh-keygen -t ed25519` ile oluşturabilirsin; `~/.ssh/id_ed25519.pub` dosyasının içeriğini panele yapıştır.
- R2 ve SMTP bilgilerini **sohbete yazma**; kurulum sırasında sunucudaki `.env` dosyasına senin girmen için yeri
  hazırlayacağım.

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

Kontrol: `https://app.siftahai.com` açılmalı ve geçerli bir sertifikası olmalı; `https://siftahai.com.tr` ana adrese yönlenmeli.

## 6. Yedekleme ve zamanlanmış görevler

R2 bağlantısı: Cloudflare R2'de bir bucket (ör. `siftah-yedek`, yetki alanı EU) ve sadece o bucket'a
"Object Read & Write" yetkili bir API anahtarı oluştur; bilgileri `.env`'deki `R2_*` satırlarına yaz
(`deploy/r2.sh` okur, `rclone config` gerekmez).

```bash
sudo mkdir -p /var/backups/site-platform && sudo chown ubuntu: /var/backups/site-platform
sudo touch /var/log/site-platform-backup.log && sudo chown ubuntu: /var/log/site-platform-backup.log
deploy/backup.sh   # ilk yedeği elle al, R2'de iki dosya görünmeli

crontab -e
```

```
30 3 * * *   /opt/site-platform/deploy/backup.sh         >> /var/log/site-platform-backup.log 2>&1
0 9 * * *    /opt/site-platform/deploy/cron.sh daily     >> /var/log/site-platform-cron.log 2>&1
*/10 * * * * /opt/site-platform/deploy/cron.sh domains   >> /var/log/site-platform-cron.log 2>&1
```

Sunucunun saat dilimi Türkiye olmalı (`timedatectl set-timezone Europe/Istanbul`); hatırlatmalar sabah 09:00'da gider.

**Yedekten geri dönüşü en az bir kez dene:** `deploy/restore.sh <yedek-zamanı>`

## 7. İzleme

[UptimeRobot](https://uptimerobot.com) (ücretsiz) ile `https://app.siftahai.com/api/health` adresine 5 dakikada bir
istek atan bir izleyici kur. Site çökerse veya veritabanına ulaşılamazsa e-posta/telefon bildirimi gelir.

Hata izleme için `.env` içindeki `SENTRY_DSN`'e Sentry (veya GlitchTip) projesinin DSN adresini yaz ve uygulamayı
yeniden başlat. Sentry'de **Alerts** altında yeni hata için e-posta bildirimini aç.

Gönderilen e-postalar ve hataları panelde **Yönetim → E-postalar** sayfasında görünür.

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
| Sertifika alınamıyor | `... logs caddy --tail 100`. A kayıtları sunucu IP'sini gösteriyor mu? Cloudflare kullanılıyorsa proxy kapalı mı? |
| Müşteri domain'i bağlanmıyor | Panelde "Kontrol et"in verdiği mesaj. Domain'in A kaydı sunucu IP'sini gösteriyor mu? |
| Disk doluyor | `docker system df`, `du -sh /var/backups/site-platform` |
