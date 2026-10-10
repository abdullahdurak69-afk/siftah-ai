// Tanıtım sitesinin genel sık sorulan soruları (/sss, ana sayfa, schema.org FAQPage ve llms.txt).
// Cevaplar ürünün gerçekte yaptığıyla birebir uyumlu olmalı; abartılı vaat (sıralama garantisi vb.) yazılmaz.

export type Faq = { q: string; a: string };

export const generalFaq: Faq[] = [
  {
    q: "Siftah AI nedir?",
    a: "Usta, restoran, kuaför ve klinik gibi küçük işletmeler için hazır web sitesi hizmetidir. Sektörünüze göre tasarlanmış site, örnek içeriklerle dolu gelir; siz sadece kendi bilgilerinizi ve fotoğraflarınızı eklersiniz. Site kendi domain'inizde (ör. firmaniz.com) yayınlanır.",
  },
  {
    q: "Web sitesinden anlamıyorum, kendim yapabilir miyim?",
    a: "Teknik bilgi gerekmez. Siteyi biz açarız, size bir davet bağlantısı gelir. Panelde metinleri ve fotoğrafları bir form doldurur gibi değiştirirsiniz; \"Önizle\" ile kontrol edip \"Yayınla\"ya basarsınız. İsterseniz içerikleri sizin yerinize biz de girebiliriz.",
  },
  {
    q: "Domain'imi bağlayabilir miyim?",
    a: "Evet. Siteler sadece işletmenin kendi domain'inde yayınlanır. Domain'iniz varsa onu bağlarız. Yoksa sizin adınıza, firma bilgilerinizle alırız; domain hukuken sizin olur. Mevcut e-posta adreslerinize dokunulmaz.",
  },
  {
    q: "Kaç günde yayına girer?",
    a: "Bilgileriniz ve fotoğraflarınız hazırsa site aynı gün hazırlanır. Domain kaydı ve DNS ayarlarının internete yayılması birkaç saat ile bir gün arasında sürebilir.",
  },
  {
    q: "Siteniz Google'da çıkar mı?",
    a: "Siteler Google'ın okuyabileceği şekilde hazırlanır: hızlı açılır, mobil uyumludur, işletme bilgileri (adres, telefon, çalışma saatleri) arama motorlarının anladığı yapıda (schema.org) eklenir ve site haritası otomatik oluşur. Hiçbir firma Google'da belirli bir sırayı garanti edemez; yeni bir sitenin aramalarda yer edinmesi genellikle birkaç ay sürer. Google İşletme Profili açmanız bu süreci hızlandırır.",
  },
  {
    q: "ChatGPT gibi yapay zekâ asistanları sitemi bulabilir mi?",
    a: "Siteniz ChatGPT, Perplexity, Gemini ve Claude gibi asistanların botlarına açıktır ve içerik sunucuda hazır HTML olarak üretilir; yani bu botlar sitenizi okuyabilir. Asistanların bir işletmeyi önermesi ayrıca işletmenin internetteki genel görünürlüğüne (Google İşletme Profili, yorumlar, başka sitelerde anılma) bağlıdır.",
  },
  {
    q: "Ücret nasıl ödeniyor?",
    a: "Abonelik yıllıktır, ödeme havale veya EFT ile yapılır. Yenileme zamanı yaklaşınca 30, 7 ve 1 gün önce e-postayla hatırlatma gönderilir.",
  },
  {
    q: "Aboneliği yenilemezsem ne olur?",
    a: "Bitiş tarihinden sonra 15 gün boyunca siteniz yayında kalır. Bu süre sonunda da yenilenmezse site geçici olarak ziyaretçilere kapanır; içerikleriniz silinmez, ödeme yapıldığında site hemen yeniden açılır.",
  },
  {
    q: "Sitede yorum veya Google puanı gösterebilir miyim?",
    a: "Gerçek Google puanınızı ve yorum sayınızı ekleyebilirsiniz. Örnek içeriklerde hiçbir zaman uydurma yorum veya puan bulunmaz. Klinik sitelerinde sağlık reklamı kuralları gereği hasta yorumu ve puan bölümü yoktur.",
  },
  {
    q: "Siteyi bırakırsam domain'im ne olur?",
    a: "Domain sizin adınıza kayıtlı olduğu için sizde kalır. Başka bir firmaya geçmek isterseniz transfer kodunu veririz.",
  },
];
