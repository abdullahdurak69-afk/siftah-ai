# SitePlatform

Küçük işletmeler için çok kiracılı (multi-tenant) web sitesi platformu. Tek Next.js uygulaması, gelen domain'e göre doğru bölümü gösterir:

| Adres (yerelde) | Bölüm | Kod |
| --- | --- | --- |
| `localhost:3000` | Firma tanıtım sitesi | `src/app/page.tsx` |
| `app.localhost:3000` | CMS paneli | `src/app/panel/` |
| `<subdomain>.localhost:3000` | Müşteri sitesi | `src/app/site/[subdomain]/` |

Yönlendirme `src/proxy.ts` içinde yapılır. Platform adı ve ana domain `.env.local` içindeki `NEXT_PUBLIC_PLATFORM_NAME` ve `NEXT_PUBLIC_ROOT_DOMAIN` değerlerinden okunur.

## Taslak ve yayın

- Panelde yapılan her değişiklik taslaktır (`site_sections`). Ziyaretçi sadece yayındaki sürümü görür.
- "Yayınla" taslağın anlık görüntüsünü `site_versions` tablosuna yazar ve sitenin önbelleğini yeniler. Son 10 sürüm saklanır.
- "Geri al" taslağı yayındaki sürüme döndürür.
- Önizleme: panelde `/siteler/<id>/onizleme`, müşteriye giriş gerektirmeyen 7 günlük link `<subdomain>/onizleme/<token>`.
- Hiç yayınlanmamış siteler dışarıdan 404 döner; `robots.txt` ve `sitemap.xml` sadece yayındaki sitelerde açılır.

## Fotoğraflar

- `POST /api/media` ile yüklenir; `sharp` ile döndürülür (EXIF), 1600px ve 640px WebP'ye çevrilir.
- Geliştirmede `.media/` klasörüne yazılır ve `/media/...` adresinden sunulur (`src/lib/storage.ts`).
  Canlıda Cloudflare R2 / S3'e geçmek için sadece bu dosya değişir.
- Kaydederken içerikteki her fotoğraf veritabanından doğrulanır; başka siteye ait fotoğraflar atılır.

## Domain'ler

- Müşteri panelde domain'ini ekler (`/siteler/<id>/domain`), DNS talimatlarını görür ve "Kontrol et" ile doğrular.
  Bekleyen domain'ler sunucuda 10 dakikada bir kontrol edilir (`/api/cron/domains`).
- Host çözümleme `src/proxy.ts` + `src/lib/host-routing.ts` içinde, sayfa çizilmeden önce yapılır; böylece
  bulunamayan siteler gerçek 404, `www` ve subdomain'den asıl domain'e geçişler gerçek 308 döner.
- SSL: Caddy, müşteri domain'lerine sertifikayı ilk ziyarette alır; önce `/api/tls-izin` ucuna sorar.

## Şablonlar

Dört sektör şablonu hazır: Usta / Teknik servis, Restoran / Kafe, Kuaför / Güzellik, Klinik.

| Dosya | Görevi |
| --- | --- |
| `src/templates/<sektör>/sections.ts` | Bölüm ve alan tanımları (panel formu + Zod doğrulama bunlardan üretilir) |
| `src/templates/<sektör>/presets.ts` | Türler (ör. kafe, berber, diş kliniği) ve örnek içerikler |
| `src/templates/<sektör>/defaults.ts` | Kurulum sihirbazından ilk içeriği üretir |
| `src/templates/<sektör>/site.tsx`, `seo.ts` | Tasarım, sayfa başlığı ve schema.org verisi |
| `src/templates/registry.ts` / `catalog.ts` / `render.tsx` | Bölümler (istemci de kullanır) / kurulum kataloğu / çizici tablosu |
| `src/templates/shared/blocks.tsx` | Ortak bloklar: SSS, galeri, yorumlar, iletişim + harita, mobil butonlar |

Yeni sektör eklemek: bu beş dosyayı yazıp `registry.ts`, `catalog.ts` ve `render.tsx`'e bir satır eklemek.

- Örnek içeriklerde fiyat, yorum ve puan asla üretilmez.
- Restoranlarda `/menu` sayfası (QR menü) vardır; panelde **QR menü** ekranından QR kod indirilir ve masa kartı
  yazdırılır. QR, platform adresine gider (`firma.platformadi.com/menu`); müşteri domain bağlasa da çalışır.
- Klinik şablonu sağlık reklamı kuralları gereği hasta yorumu, önce/sonra, fiyat ve Google puanı içermez.

## Hesaplar ve roller

- Kayıt kapalıdır. Siteleri süper admin açar, müşteriyi sitenin **Kullanıcılar** sayfasından davet eder.
  Davet edilen kişiye şifresini belirleyeceği 7 günlük bir bağlantı gider (`src/lib/invites.ts`).
- Roller: **süper admin** (her şey + `/admin`), **site sahibi** (içerik, domain, kullanıcılar, abonelik bilgisi),
  **editör** (sadece içerik ve fotoğraflar). Kontroller `src/lib/dal.ts` içinde.
- Şifre yenileme: giriş sayfasında "Şifremi unuttum"; bağlantı `/sifre-belirle` sayfasını açar.

## Abonelik

- Ödemeler panelde **Yönetim → site → Ödeme kaydet** ile elle girilir; bitiş tarihi uzatılır (`payments` tablosu).
- Durum bitiş tarihinden hesaplanır (`src/lib/subscription.ts`): bitişe 30 gün kala "yenileme yaklaşıyor",
  bitişten sonra 15 gün tolerans, sonra askı. Askıdaki site proxy'de 503 ile "geçici olarak yayında değil" döner,
  veri silinmez. Bitiş tarihi girilmemiş siteler süre sınırı olmadan çalışır.
- Günlük cron (`/api/cron/daily`) bitişe 30, 7, 1 gün kala, süre dolunca ve askıda site sahibine e-posta gönderir,
  süper admine günlük özet yollar. Aynı hatırlatma iki kez gitmez (`subscription_reminders`).

## E-posta

`SMTP_URL` ile herhangi bir SMTP sağlayıcısı (Resend, Brevo, Yandex) kullanılır (`src/lib/email.ts`). Tanımlı değilse
e-postalar gönderilmez, içeriği sunucu konsoluna yazılır. Her e-posta `email_log` tablosuna kaydedilir ve
**Yönetim → E-postalar** sayfasında görünür.

## Ziyaretçi istatistiği

Yayındaki müşteri sitelerine küçük bir betik eklenir (`src/templates/stats-beacon.tsx`); sayfa açılışı ile telefon ve
WhatsApp tıklamalarını `/api/t` ucuna bildirir. Çerez kullanılmaz, IP saklanmaz: günlük tekil ziyaretçi, günlük
değişen tuzla hash'lenerek sayılır ve hash'ler ertesi gün silinir. Toplamlar `site_stats_daily` tablosunda,
panelde sitenin genel bakış sayfasında görünür.

## Yasal metinler

Ana domain'de `/kvkk`, `/gizlilik-ve-cerezler`, `/kullanim-kosullari`, `/mesafeli-satis-sozlesmesi`
(`src/app/(yasal)/`). Firma bilgileri `src/content/legal-info.ts` içinde doldurulur. Metinler taslaktır, yayından
önce avukata kontrol ettirilmelidir.

## Hata izleme

`SENTRY_DSN` tanımlıysa sunucu hataları Sentry'ye (veya GlitchTip'e) gider (`src/instrumentation.ts`).
Çerez, IP ve istek başlıkları gönderilmez.

## Sunucu

Kurulum adımları: [deploy/KURULUM.md](deploy/KURULUM.md) (Docker Compose + Caddy + PostgreSQL, gece yedeği).

## Teknoloji

- Next.js 16 (App Router, Cache Components), Tailwind CSS
- PostgreSQL + Drizzle ORM (`src/db/schema.ts`)
- Better Auth, e-posta + şifre (`src/lib/auth.ts`), kullanıcılar kendi tablolarımızda
- Zod ile form doğrulama

## Kurulum

```bash
brew install postgresql@17 && brew services start postgresql@17
/opt/homebrew/opt/postgresql@17/bin/createdb site_platform
cp .env.example .env.local   # değerleri doldurun
npm install
npm run db:migrate
npm run db:seed              # .env.local'daki SEED_ADMIN_* ile süper admin oluşturur
npm run dev
```

Panel: http://app.localhost:3000

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run typecheck` / `npm run lint` | Tip ve kod kontrolü |
| `npm run db:generate` | Şema değişikliğinden migration üretir |
| `npm run db:migrate` | Migration'ları uygular |
| `npm run db:studio` | Veritabanını tarayıcıda gösterir |
| `npm run db:seed` | Süper admin hesabını oluşturur |

Yerelde günlük görevleri elle çalıştırmak için: `curl -H "Authorization: Bearer $CRON_SECRET" http://app.localhost:3000/api/cron/daily`
