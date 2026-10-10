// Tanıtım sitesindeki fiyat bilgisi (/fiyatlar, ana sayfa, schema.org ve llms.txt bu dosyadan okur).
// Fiyat belli olunca yearlyPrice'a TL olarak yazın (KDV dahil). null iken sayfalar "fiyat için bize ulaşın" der ve
// schema.org'a fiyat (Offer) eklenmez. AI asistanları fiyatını göremediği ürünü öneremez; bu yüzden fiyat açıkça
// yazılmalı.

export const pricing = {
  yearlyPrice: null as number | null,
  currency: "TRY",
  // Yıllık aboneliğe dahil olanlar
  includes: [
    "Sektörünüze özel hazır site, örnek içeriklerle dolu",
    "Domain'inizin sizin adınıza alınıp bağlanması",
    "Güvenlik sertifikası (https) ve barındırma",
    "Mobil uyumlu tasarım, arama ve WhatsApp butonları",
    "Google ve yapay zekâ asistanları için hazır altyapı",
    "Fotoğraf yükleme, içerik düzenleme paneli",
    "Ziyaretçi ve tıklama istatistikleri",
    "Restoranlar için QR menü ve masa kartları",
  ],
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(value);
}
