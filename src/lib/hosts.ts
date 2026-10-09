import { panelSubdomain, rootDomain } from "@/lib/config";

export type HostKind = { kind: "root" } | { kind: "panel" } | { kind: "site"; subdomain: string } | { kind: "custom"; host: string };

// Gelen host'un platformun hangi bölümüne ait olduğunu söyler (proxy ve metin dosyaları ortak kullanır)
export function classifyHost(rawHost: string | null): HostKind {
  const host = (rawHost ?? "").toLowerCase();
  if (host === rootDomain || host === `www.${rootDomain}`) return { kind: "root" };
  if (host === `${panelSubdomain}.${rootDomain}`) return { kind: "panel" };
  if (host.endsWith(`.${rootDomain}`)) return { kind: "site", subdomain: host.slice(0, -(rootDomain.length + 1)) };
  // Custom domain'ler portsuz eşlenir (geliştirmede "firmam.test:3000" gibi gelebilir)
  return { kind: "custom", host: host.split(":")[0] };
}
