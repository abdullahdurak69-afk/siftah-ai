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
| 5 Admin paneli, abonelik (manuel ödeme, hatırlatma e-postası), davet + roller, istatistik, Sentry, yasal metinler | bitti | faz-5-admin |
| 6 Restoran (+QR menü), kuaför, klinik şablonları; şablon altyapısı genelleştirildi | bitti | faz-6-sablonlar |
| 7 Firma tanıtım sitesi + SEO/GEO (llms.txt dahil) | sıradaki | – |

Dallar zincirleme (her biri bir öncekinin üstünde), main'e henüz birleştirilmedi.

## Kararlar

- Stack: Next.js 16 (cacheComponents + partialPrefetching açık), Drizzle + PostgreSQL, Better Auth, Zod, Tailwind, lucide-react, sharp, tldts.
- Barındırma: kendi VPS'i (Türkiye'de sağlayıcı tercih, KVKK) + Docker Compose + Caddy (on-demand TLS) + Cloudflare DNS (platform domain'i, wildcard sertifika).
- Domain'i müşteri kendisi alır. Yıllık abonelik. Paneli hem müşteri hem süper admin (ajans modeli) kullanır.
- İlk şablon Usta/Teknik servis (referans: sancaktepeuydu.com). 6 meslek ön ayarı. Yorum ve puan asla örnek üretilmez.
- Kayıt kapalı, ücretsiz deneme yok: siteleri süper admin açar, müşteri davetle gelir (5. faz kararı).
- İstatistik Umami değil, kendi çerezsiz sayacımız (`site_stats_daily`); ek servis yok.
- E-posta SMTP (nodemailer) ile, sağlayıcıdan bağımsız. Sentry sadece sunucu tarafı (`@sentry/node`), müşteri
  sitelerine istemci betiği eklenmez.
- Abonelik: bitiş tarihi girilmemiş site süresiz çalışır; bitişten sonra 15 gün tolerans, sonra proxy'de 503.
- Klinik şablonu bilgilendirme odaklı (6. faz kararı): hasta yorumu, önce/sonra, fiyat, Google puanı yok.
- Şablon tasarımlarına referans site verilmedi; sektör karakterleri: restoran Fraunces + krem, kuaför Cormorant +
  kemer, klinik sade sans + turkuaz. Örnek içeriklerde fiyat da üretilmez.
- QR menü platform subdomain'ine gider (domain değişse de basılı kod çalışsın diye).

## Kullanıcıdan beklenenler (açık)

- Platform adı ve ana domain'i (henüz yok; NEXT_PUBLIC_PLATFORM_NAME/ROOT_DOMAIN geçici)
- VPS, platform domain'i, Cloudflare + R2 hesabı (deploy/KURULUM.md 1–3)
- Özel GitHub deposu (kodu sunucuya çekmek için) ve sunucuya SSH anahtar erişimi
- Yıllık fiyat
- Firma bilgileri (`src/content/legal-info.ts`) ve yasal metinlerin avukat kontrolü; askı sonrası veri saklama
  süresi (taslakta 90 gün)
- E-posta sağlayıcısı (Resend önerildi) ve destek iletişim bilgileri (SUPPORT_EMAIL/PHONE)

## Dikkat edilecekler (öğrenilenler)

- **Proxy yeniden yazmaları `request.nextUrl.clone()` ile yapılmalı.** `new URL(path, request.url)` production
  standalone'da hedefi dış adres sanıp 500 veriyor. Dev modunda görünmez.
- **Durum kodları (404/308) proxy'de verilmeli** (`src/lib/host-routing.ts`). Production'da sayfa PPR kabuğuyla
  200 olarak akmaya başlar; sayfadaki `notFound()`/`redirect()` gerçek kod döndürmez. Dev modunda görünmez.
- Production davranışını test etmek için: `npm run build`, `.next/static` ve `public`'i `.next/standalone`'a kopyala,
  `PORT=3100 HOSTNAME=0.0.0.0 node server.js` (env: `.env.local`). Durdurmak için `lsof -ti tcp:3100 | xargs kill`
  (`pkill -f standalone/server.js` süreci yakalamıyor).
- Render sırasında `new Date()`/`Date.now()` kullanma (cacheComponents ve react-hooks/purity lint hata verir);
  `requestNow()` (`src/lib/request-time.ts`, `connection()` + tarih) veya DB tarafında `sql\`now()\`` kullan.
- `src/templates/registry.ts` istemci bileşenlerinden de import edilir: içine tasarım/ön ayar koyma, sadece bölüm
  tanımları. Ön ayarlar ve içerik üretici `catalog.ts`, tasarım `render.tsx` (sunucu).
- Şablon fontları (`src/templates/fonts.ts`) `preload: false`: tüm tasarımlar aynı sayfa modülünden çizildiği için
  aksi halde her site tüm fontları önceden indirir.
- Drizzle `sql` alt sorgularında `${tablo.sütun}` önek olmadan yazılır ve yanlış tabloya bağlanabilir
  ("uuid = text" hatası); alt sorgularda adları elle nitele (`"sites"."id"`).
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
- 6. faz test siteleri: "Lezzet Durağı" (restoran, yayında, `lezzet-duragi.localhost:3000/menu`), "Gül Saç Tasarım"
  (kuaför), "Ataşehir Ağız ve Diş Sağlığı" (klinik); üçü de test-admin tarafından açıldı.
- Test hesapları (rastgele şifre): `test-admin@site-platform.test` (süper admin), `test-editor@site-platform.test`
  (Kaya'da editör), `deneme-usta@site-platform.test` ("Kaya" ve "Yıldız Su Tesisatı" sitelerinin sahibi).
  Şifre gerekirse "Şifremi unuttum" kullan: SMTP yokken bağlantı dev sunucusu günlüğüne yazılır (`preview_logs`).
- `.env.local` içindeki PLATFORM_SERVER_IP yerel DNS testi için geçici olarak sdf.org IP'si.
- Dev sunucusu Claude tarayıcı panelinden: preview "site-platform" (launch.json scratch klasöründeydi; yeni oturumda
  `.claude/launch.json` proje içinde mevcut, adı "panel").
