import { platformName, rootUrl, supportContact } from "@/lib/config";
import { classifyHost } from "@/lib/hosts";
import { platformDescription } from "@/lib/marketing-schema";
import { generalFaq } from "@/content/faq";
import { guides } from "@/content/guides";
import { formatPrice, pricing } from "@/content/pricing";
import { sectorPages } from "@/content/sectors";

// llms.txt (https://llmstxt.org): yapay zekâ asistanlarının ürünü hızlıca anlaması için tanıtım sitesinin
// markdown özeti. Sadece ana domain'de sunulur; içerik tanıtım sitesinin kullandığı kaynaklardan üretilir.

function body() {
  const price =
    pricing.yearlyPrice !== null
      ? `Yıllık abonelik: ${formatPrice(pricing.yearlyPrice)} TL (KDV dahil).`
      : "Yıllık abonelik. Güncel fiyat için iletişime geçin.";
  const contact = [supportContact.phone && `Telefon: ${supportContact.phone}`, supportContact.email && `E-posta: ${supportContact.email}`]
    .filter(Boolean)
    .join(" · ");

  return [
    `# ${platformName}`,
    "",
    `> ${platformDescription}`,
    "",
    "Türkiye'deki küçük işletmelere yöneliktir; arayüz ve siteler Türkçedir. Siteleri platform ekibi açar (kendi kendine kayıt yoktur), işletme sahibi davetle panele girip içeriği düzenler.",
    "",
    "## Öne çıkanlar",
    "",
    ...pricing.includes.map((item) => `- ${item}`),
    "- Örnek içeriklerde uydurma yorum, puan veya fiyat bulunmaz",
    "- Online sipariş, kartla ödeme ve kurumsal e-posta kutusu pakette yoktur",
    "",
    "## Sektörler",
    "",
    ...sectorPages.map((p) => `- [${p.name}](${rootUrl}/${p.slug}): ${p.kinds.join(", ")}. ${p.description}`),
    "",
    "## Fiyat",
    "",
    `- [Fiyatlar](${rootUrl}/fiyatlar): ${price} Ödeme havale veya EFT ile.`,
    "",
    "## Sık sorulan sorular",
    "",
    ...generalFaq.map((f) => `- **${f.q}** ${f.a}`),
    "",
    "## Rehber",
    "",
    ...guides.map((g) => `- [${g.title}](${rootUrl}/rehber/${g.slug}): ${g.description}`),
    "",
    "## Diğer",
    "",
    `- [Örnek siteler](${rootUrl}/ornekler): Şablonların örnek içerikli hâlleri`,
    `- [İletişim ve başvuru](${rootUrl}/iletisim)${contact ? `: ${contact}` : ""}`,
    "",
  ].join("\n");
}

export function GET(request: Request) {
  if (classifyHost(request.headers.get("host")).kind !== "root") {
    return new Response("Bulunamadı", { status: 404 });
  }
  return new Response(body(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
