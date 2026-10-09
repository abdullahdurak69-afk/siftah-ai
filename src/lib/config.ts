export const platformName = process.env.NEXT_PUBLIC_PLATFORM_NAME ?? "SitePlatform";

// Ana domain, port dahil: "localhost:3000" veya "platformadi.com"
export const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000").toLowerCase();

export const panelSubdomain = "app";

const protocol = rootDomain.startsWith("localhost") ? "http" : "https";

export const panelUrl = `${protocol}://${panelSubdomain}.${rootDomain}`;

export function siteUrl(subdomain: string) {
  return `${protocol}://${subdomain}.${rootDomain}`;
}

// Müşterilere verilmeyecek subdomain'ler
export const reservedSubdomains = new Set([
  "app",
  "www",
  "admin",
  "api",
  "mail",
  "smtp",
  "ftp",
  "panel",
  "static",
  "cdn",
  "assets",
  "blog",
  "destek",
  "yardim",
  "docs",
  "status",
  "test",
  "dev",
  "staging",
]);

export const sectors = {
  usta: "Usta / Teknik servis",
  restoran: "Restoran / Kafe",
  kuafor: "Kuaför / Güzellik salonu",
  klinik: "Klinik",
} as const;

export type Sector = keyof typeof sectors;
