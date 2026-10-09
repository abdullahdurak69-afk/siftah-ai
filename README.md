# SitePlatform

Küçük işletmeler için çok kiracılı (multi-tenant) web sitesi platformu. Tek Next.js uygulaması, gelen domain'e göre doğru bölümü gösterir:

| Adres (yerelde) | Bölüm | Kod |
| --- | --- | --- |
| `localhost:3000` | Firma tanıtım sitesi | `src/app/page.tsx` |
| `app.localhost:3000` | CMS paneli | `src/app/panel/` |
| `<subdomain>.localhost:3000` | Müşteri sitesi | `src/app/site/[subdomain]/` |

Yönlendirme `src/proxy.ts` içinde yapılır. Platform adı ve ana domain `.env.local` içindeki `NEXT_PUBLIC_PLATFORM_NAME` ve `NEXT_PUBLIC_ROOT_DOMAIN` değerlerinden okunur.

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
