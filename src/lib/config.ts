export const platformName = process.env.NEXT_PUBLIC_PLATFORM_NAME ?? "SitePlatform";

// Ana domain, port dahil: "localhost:3000" veya "platformadi.com"
export const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000").toLowerCase();

export const panelSubdomain = "app";

export const protocol = rootDomain.startsWith("localhost") ? "http" : "https";

// Ana domain, port olmadan: "localhost" veya "platformadi.com"
export const rootHostname = rootDomain.split(":")[0];

// Müşteri domain'lerinin yönlendirileceği sunucu. A kaydı bu IP'ye, alt alan adları CNAME ile cname.<ana-domain>'e.
export const serverIpv4 = process.env.PLATFORM_SERVER_IP ?? "";
export const cnameTarget = `cname.${rootHostname}`;

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

// Müşterinin abonelik yenileme ve destek için ulaşacağı iletişim bilgileri (panelde ve e-postalarda gösterilir)
export const supportContact = {
  email: process.env.SUPPORT_EMAIL ?? "",
  phone: process.env.SUPPORT_PHONE ?? "",
};
