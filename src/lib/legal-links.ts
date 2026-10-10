import { protocol, rootDomain } from "@/lib/config";

// Yasal metinler ana domain'deki tanıtım sitesinde yayınlanır (src/app/(yasal)/)
export const legalPages = {
  kvkk: "KVKK aydınlatma metni",
  "gizlilik-ve-cerezler": "Gizlilik ve çerez politikası",
  "kullanim-kosullari": "Kullanım koşulları",
  "mesafeli-satis-sozlesmesi": "Mesafeli satış sözleşmesi",
} as const;

export type LegalPage = keyof typeof legalPages;

export function legalUrl(page: LegalPage) {
  return `${protocol}://${rootDomain}/${page}`;
}
