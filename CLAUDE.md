@AGENTS.md

# Proje: Küçük işletme site platformu (çalışma adı SitePlatform)

Kullanıcıyla Türkçe konuş. Kod yorumları ve arayüz metinleri Türkçe. Büyük adımlardan önce kullanıcıyla tartış;
"yap" demeden faz başlatma. Her fazın sonunda commit at (kullanıcı onayladı), faz başına ayrı dal.

- Proje planı (canlı doküman): https://claude.ai/code/artifact/760f987b-cebc-4381-82e2-c0c80249e5ef
- Mimari, komutlar, yayın modeli: README.md · Sunucu kurulumu: deploy/KURULUM.md

## Durum (2026-10-10)

| Faz | Durum | Dal |
| --- | --- | --- |
| 1 Çekirdek (auth, roller, subdomain yönlendirme) | bitti | faz-1-cekirdek |
| 2 Şablon motoru + Usta/Teknik servis şablonu, kurulum sihirbazı | bitti | faz-2-sablon |
| 3 Fotoğraf yükleme, önizleme, yayınla/geri al, robots/sitemap | bitti | faz-3-medya-yayin |
| 4 Custom domain + sunucu kurulum paketi (deploy/) | bitti, sunucuda test edilmedi | faz-4-domain |
| 5 Admin paneli + abonelik (manuel ödeme, bitiş tarihi, hatırlatma e-postası, Umami istatistik, yedekleme, Sentry/uptime, yasal metinler, 14 gün deneme?) | sıradaki | – |
| 6 Restoran (+QR menü), kuaför, klinik şablonları | – | – |
| 7 Firma tanıtım sitesi + SEO/GEO (llms.txt dahil) | – | – |

Dallar zincirleme (her biri bir öncekinin üstünde), main'e henüz birleştirilmedi.

## Kararlar

- Stack: Next.js 16 (cacheComponents + partialPrefetching açık), Drizzle + PostgreSQL, Better Auth, Zod, Tailwind, lucide-react, sharp, tldts.
- Barındırma: kendi VPS'i (Türkiye'de sağlayıcı tercih, KVKK) + Docker Compose + Caddy (on-demand TLS) + Cloudflare DNS (platform domain'i, wildcard sertifika).
- Domain'i müşteri kendisi alır. Yıllık abonelik. Paneli hem müşteri hem süper admin (ajans modeli) kullanır.
- İlk şablon Usta/Teknik servis (referans: sancaktepeuydu.com). 6 meslek ön ayarı. Yorum ve puan asla örnek üretilmez.

## Kullanıcıdan beklenenler (açık)

- Platform adı ve ana domain'i (henüz yok; NEXT_PUBLIC_PLATFORM_NAME/ROOT_DOMAIN geçici)
- VPS, platform domain'i, Cloudflare + R2 hesabı (deploy/KURULUM.md 1–3)
- Özel GitHub deposu (kodu sunucuya çekmek için) ve sunucuya SSH anahtar erişimi
- Yıllık fiyat

## Dikkat edilecekler (öğrenilenler)

- **Proxy yeniden yazmaları `request.nextUrl.clone()` ile yapılmalı.** `new URL(path, request.url)` production
  standalone'da hedefi dış adres sanıp 500 veriyor. Dev modunda görünmez.
- **Durum kodları (404/308) proxy'de verilmeli** (`src/lib/host-routing.ts`). Production'da sayfa PPR kabuğuyla
  200 olarak akmaya başlar; sayfadaki `notFound()`/`redirect()` gerçek kod döndürmez. Dev modunda görünmez.
- Production davranışını test etmek için: `npm run build`, `.next/static` ve `public`'i `.next/standalone`'a kopyala,
  `PORT=3100 HOSTNAME=0.0.0.0 node server.js` (env: `.env.local`). Durdurmak için `lsof -ti tcp:3100 | xargs kill`
  (`pkill -f standalone/server.js` süreci yakalamıyor).
- Render sırasında `new Date()` kullanma (cacheComponents hata verir); DB tarafında `sql\`now()\`` kullan.
- Server action içinde `redirect()` host bazlı proxy yeniden yazmasından geçmez; yönlendirmeyi istemcide yap.
- `revalidateTag(tag, "max")` iki argüman ister; server action'da anında yenileme için `updateTag`.
- `server-only` import eden modülleri tsx ile çalıştırmak için: `npx tsx --conditions=react-server <dosya>`.
- Route grubu taşıma gibi yapısal değişikliklerden sonra dev sunucusu eski modülü tutabilir: yeniden başlat.
- Şifre/secret değerlerini okumak otomatik mod tarafından engelleniyor; test hesaplarını tarayıcıda rastgele
  şifreyle oluştur (`crypto.randomUUID()`).

## Yerel ortam

- PostgreSQL 17 (Homebrew, `brew services`), veritabanı `site_platform`. psql: `/opt/homebrew/opt/postgresql@17/bin`.
- Panel: http://app.localhost:3000 · Test sitesi: http://kaya.localhost:3000 (yayında, renkli test görselleri)
- Süper admin: `admin@site-platform.test`, şifre `.env.local` → SEED_ADMIN_PASSWORD (kullanıcı henüz denemedi).
- Tarayıcı oturumu `deneme-usta@site-platform.test` (rastgele şifre); "Kaya" ve "Yıldız Su Tesisatı" sitelerinin sahibi.
- `.env.local` içindeki PLATFORM_SERVER_IP yerel DNS testi için geçici olarak sdf.org IP'si.
- Dev sunucusu Claude tarayıcı panelinden: preview "site-platform" (launch.json scratch klasöründeydi; yeni oturumda
  `.claude/launch.json` proje içinde mevcut, adı "panel").
