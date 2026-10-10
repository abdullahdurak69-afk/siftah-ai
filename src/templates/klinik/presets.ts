import type { IconKey } from "../icons";

// Klinik türü ön ayarları. Metinler bilinçli olarak bilgilendirici ve iddiasız yazılmıştır:
// "en iyi", "garantili", "ağrısız", "kesin sonuç" gibi ifadeler, fiyat ve kampanya kullanılmaz.

export type KlinikPreset = {
  label: string;
  icon: IconKey;
  schemaType: string;
  heroTitle: string;
  intro: string;
  aboutTitle: string;
  about: string;
  services: { ikon: IconKey; baslik: string; aciklama: string }[];
  appointment: { baslik: string; aciklama: string };
  faq: { soru: string; cevap: string }[];
};

const randevuFaq = {
  soru: "Randevuyu nasıl alabilirim?",
  cevap: "Telefonla arayarak veya WhatsApp'tan yazarak randevu alabilirsiniz. Size uygun gün ve saati birlikte belirleriz.",
};

export const klinikPresets = {
  dis: {
    label: "Diş Kliniği",
    icon: "gulumseme",
    schemaType: "Dentist",
    heroTitle: "Ağız ve diş sağlığınız için yanınızdayız",
    intro:
      "Muayeneden tedavi planlamasına kadar her aşamada sizi bilgilendiriyor, tedavi seçeneklerini birlikte değerlendiriyoruz.",
    aboutTitle: "Kliniğimiz",
    about:
      "Kliniğimizde koruyucu diş hekimliğinden protetik tedavilere kadar ağız ve diş sağlığı hizmetleri sunulmaktadır. Sterilizasyon ve hijyen kurallarına özen gösteriyor, her hastamız için tedavi sürecini önceden ayrıntılı olarak paylaşıyoruz.",
    services: [
      { ikon: "steteskop", baslik: "Muayene ve Tanı", aciklama: "Ağız içi muayene ve gerekli durumlarda radyografik inceleme ile tedavi ihtiyacının belirlenmesi." },
      { ikon: "gulumseme", baslik: "Diş Taşı Temizliği", aciklama: "Diş taşı ve plakların temizlenmesi, diş eti sağlığının korunmasına yönelik bilgilendirme." },
      { ikon: "kalkan", baslik: "Dolgu Tedavisi", aciklama: "Çürük dokunun temizlenip dişin uygun dolgu malzemesiyle onarılması." },
      { ikon: "aktivite", baslik: "Kanal Tedavisi", aciklama: "Diş sinirinde iltihap veya hasar olduğunda dişin korunmasına yönelik tedavi." },
      { ikon: "onay", baslik: "Protez ve Kaplama", aciklama: "Eksik veya hasarlı dişler için sabit ve hareketli protez seçenekleri." },
      { ikon: "bebek", baslik: "Çocuk Diş Hekimliği", aciklama: "Çocuklarda süt ve daimi dişlerin takibi, koruyucu uygulamalar." },
    ],
    appointment: {
      baslik: "Muayene için randevu alın",
      aciklama: "Şikâyetinizi kısaca yazın, size uygun bir muayene saati planlayalım.",
    },
    faq: [
      randevuFaq,
      { soru: "İlk muayenede neler yapılır?", cevap: "Ağız içi muayene yapılır, gerekirse röntgen istenir ve tedavi seçenekleri size açıklanır." },
      { soru: "Ne sıklıkla kontrole gelmeliyim?", cevap: "Genel öneri yılda en az bir kez kontrol ve temizliktir; hekiminiz ağız sağlığınıza göre farklı bir aralık önerebilir." },
      { soru: "Anlaşmalı olduğunuz kurumlar var mı?", cevap: "Anlaşmalı kurum bilgisi için lütfen bizi arayın." },
    ],
  },
  veteriner: {
    label: "Veteriner Kliniği",
    icon: "pati",
    schemaType: "VeterinaryCare",
    heroTitle: "Dostlarınızın sağlığı için",
    intro:
      "Kedi ve köpeklerin muayene, aşı, kontrol ve tedavi ihtiyaçları için kliniğimizde hizmet veriyoruz.",
    aboutTitle: "Kliniğimiz",
    about:
      "Evcil dostlarınızın sağlıklı ve uzun bir yaşam sürmesi için koruyucu hekimliğe önem veriyoruz. Her muayenede sizi bilgilendiriyor, aşı ve kontrol takvimini birlikte planlıyoruz.",
    services: [
      { ikon: "steteskop", baslik: "Genel Muayene", aciklama: "Fiziksel muayene ve gerekli durumlarda laboratuvar tetkikleri." },
      { ikon: "enjektor", baslik: "Aşılama", aciklama: "Yaşa ve ihtiyaca göre aşı takvimi ve hatırlatma." },
      { ikon: "kalkan", baslik: "İç ve Dış Parazit", aciklama: "Düzenli parazit uygulamaları ve koruyucu öneriler." },
      { ikon: "mikroskop", baslik: "Laboratuvar", aciklama: "Kan tahlili ve temel laboratuvar incelemeleri." },
      { ikon: "aktivite", baslik: "Cerrahi Uygulamalar", aciklama: "Kısırlaştırma ve genel cerrahi operasyonlar." },
      { ikon: "kopek", baslik: "Mikroçip", aciklama: "Mikroçip uygulaması ve kayıt işlemleri." },
    ],
    appointment: {
      baslik: "Randevu alın",
      aciklama: "Dostunuzun türünü, yaşını ve şikâyetini yazın; size uygun bir saat ayarlayalım.",
    },
    faq: [
      randevuFaq,
      { soru: "Yavru kedi/köpeğimin ilk aşısı ne zaman yapılmalı?", cevap: "Aşı takvimi hayvanın yaşına ve sağlık durumuna göre belirlenir; ilk muayenede size özel bir plan hazırlanır." },
      { soru: "Acil durumlarda ne yapmalıyım?", cevap: "Acil durumlarda önce telefonla bize ulaşın; çalışma saatleri dışındaki durumlar için size yönlendirme yapılır." },
    ],
  },
  fizyoterapi: {
    label: "Fizik Tedavi / Fizyoterapi",
    icon: "aktivite",
    schemaType: "Physiotherapy",
    heroTitle: "Hareketinizi yeniden kazanmanız için",
    intro:
      "Değerlendirme sonrası size özel hazırlanan egzersiz ve tedavi programlarıyla, günlük yaşamınıza dönüş sürecinizde yanınızdayız.",
    aboutTitle: "Hakkımızda",
    about:
      "Her danışanımız için ayrıntılı bir değerlendirme yapıyor, ihtiyacına göre bireysel bir program hazırlıyoruz. Tedavi süreci boyunca ilerlemeyi birlikte takip ediyoruz.",
    services: [
      { ikon: "steteskop", baslik: "Değerlendirme", aciklama: "Hareket açıklığı, kas kuvveti ve postür değerlendirmesi." },
      { ikon: "kemik", baslik: "Ortopedik Rehabilitasyon", aciklama: "Ameliyat sonrası ve kas-iskelet sistemi sorunlarında rehabilitasyon." },
      { ikon: "dambil", baslik: "Egzersiz Programları", aciklama: "Kişiye özel, evde de uygulanabilen egzersiz planları." },
      { ikon: "el", baslik: "Manuel Terapi", aciklama: "Eklem ve yumuşak dokuya yönelik manuel tedavi teknikleri." },
      { ikon: "beyin", baslik: "Nörolojik Rehabilitasyon", aciklama: "Nörolojik rahatsızlıklarda hareket ve denge çalışmaları." },
      { ikon: "aktivite", baslik: "Sporcu Sağlığı", aciklama: "Spor yaralanmaları sonrası rehabilitasyon ve sakatlıktan korunma." },
    ],
    appointment: {
      baslik: "Değerlendirme randevusu alın",
      aciklama: "Şikâyetinizi ve varsa doktor raporunuzu iletin, size uygun bir değerlendirme saati planlayalım.",
    },
    faq: [
      randevuFaq,
      { soru: "Doktor raporu gerekli mi?", cevap: "Bazı durumlarda hekim yönlendirmesi gerekir. Durumunuzu bize iletin, sizi bilgilendirelim." },
      { soru: "Seanslar ne kadar sürer?", cevap: "Seans süresi ve sayısı değerlendirme sonrasında ihtiyacınıza göre belirlenir." },
    ],
  },
  diyetisyen: {
    label: "Diyetisyen",
    icon: "elma",
    schemaType: "MedicalBusiness",
    heroTitle: "Sağlıklı beslenme, sürdürülebilir alışkanlıklar",
    intro:
      "Yaşam tarzınıza ve sağlık durumunuza uygun beslenme planlarıyla, sağlıklı alışkanlıklar edinmeniz için size eşlik ediyoruz.",
    aboutTitle: "Hakkımızda",
    about:
      "Beslenme programlarını kişinin sağlık durumu, alışkanlıkları ve günlük temposuna göre hazırlıyoruz. Düzenli görüşmelerle süreci birlikte takip ediyoruz.",
    services: [
      { ikon: "elma", baslik: "Kişisel Beslenme Programı", aciklama: "Vücut analizi ve beslenme alışkanlıklarınıza göre hazırlanan program." },
      { ikon: "nabiz", baslik: "Hastalıklarda Beslenme", aciklama: "Diyabet, kalp-damar ve sindirim sorunlarında beslenme danışmanlığı." },
      { ikon: "bebek", baslik: "Gebelik ve Emzirme", aciklama: "Gebelik ve emzirme dönemine uygun beslenme önerileri." },
      { ikon: "dambil", baslik: "Sporcu Beslenmesi", aciklama: "Antrenman programına uygun beslenme planlaması." },
      { ikon: "wifi", baslik: "Online Danışmanlık", aciklama: "Görüntülü görüşme ile uzaktan takip." },
    ],
    appointment: {
      baslik: "İlk görüşme için randevu alın",
      aciklama: "Yüz yüze veya online görüşme tercihlerinizi yazın, size uygun bir saat planlayalım.",
    },
    faq: [
      randevuFaq,
      { soru: "Online görüşme yapıyor musunuz?", cevap: "Evet, görüntülü görüşme ile online danışmanlık hizmeti veriyoruz." },
      { soru: "Görüşmeler hangi sıklıkta yapılır?", cevap: "Takip sıklığı hedefinize ve programınıza göre birlikte belirlenir." },
    ],
  },
  psikolog: {
    label: "Psikolojik Danışmanlık",
    icon: "beyin",
    schemaType: "MedicalBusiness",
    heroTitle: "Kendinize ayırdığınız güvenli bir alan",
    intro:
      "Bireysel, çift ve aile görüşmeleriyle, yaşadığınız zorlukları gizlilik içinde konuşabileceğiniz bir ortam sunuyoruz.",
    aboutTitle: "Hakkımızda",
    about:
      "Görüşmelerimizde gizlilik ve etik ilkeler esastır. Her danışanımızın ihtiyacını dinleyerek görüşme sürecini birlikte planlıyoruz.",
    services: [
      { ikon: "beyin", baslik: "Bireysel Görüşme", aciklama: "Yetişkinler için birebir psikolojik danışmanlık görüşmeleri." },
      { ikon: "ev", baslik: "Çift ve Aile Görüşmesi", aciklama: "İlişki ve aile içi iletişime yönelik görüşmeler." },
      { ikon: "bebek", baslik: "Çocuk ve Ergen", aciklama: "Çocuk ve ergenlere yönelik görüşmeler ve aile bilgilendirmesi." },
      { ikon: "wifi", baslik: "Online Görüşme", aciklama: "Görüntülü görüşme ile uzaktan danışmanlık." },
    ],
    appointment: {
      baslik: "Ön görüşme için bize ulaşın",
      aciklama: "Telefonla veya WhatsApp'tan yazın; size uygun bir görüşme zamanı planlayalım.",
    },
    faq: [
      randevuFaq,
      { soru: "Görüşmeler gizli mi?", cevap: "Evet. Görüşmelerde paylaşılan bilgiler etik ilkeler ve yasal düzenlemeler çerçevesinde gizli tutulur." },
      { soru: "Bir görüşme ne kadar sürer?", cevap: "Görüşmeler genellikle 45–50 dakika sürer." },
    ],
  },
} satisfies Record<string, KlinikPreset>;

export type KlinikPresetKey = keyof typeof klinikPresets;

export function getKlinikPreset(key: string | null): KlinikPreset | null {
  return key && key in klinikPresets ? klinikPresets[key as KlinikPresetKey] : null;
}
