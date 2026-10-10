import type { Sector } from "@/lib/config";
import type { Faq } from "./faq";

// Tanıtım sitesindeki sektör sayfaları (/usta-web-sitesi, /restoran-web-sitesi...). Her sayfa bir aramayı hedefler
// ("restoran web sitesi yaptırma" gibi). İçerik şablonların gerçekte sunduğu bölümlerle uyumlu tutulmalı.

export type SectorPage = {
  sector: Sector;
  slug: string;
  // Menüde ve kartlarda kısa ad
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  // Bu şablondaki türler (kurulumda seçilir, örnek içerik buna göre gelir)
  kinds: string[];
  // Sitede hazır gelen bölümler
  features: { title: string; text: string }[];
  faq: Faq[];
  // Bilgilendirme notu (klinik: sağlık reklamı kuralları)
  notice?: string;
};

export const sectorPages: SectorPage[] = [
  {
    sector: "usta",
    slug: "usta-web-sitesi",
    name: "Usta ve teknik servis",
    title: "Usta ve Teknik Servis Web Sitesi: Tesisatçı, Elektrikçi, Klima Servisi",
    description:
      "Tesisatçı, elektrikçi, klima ve beyaz eşya servisi, TV-uydu ve mobilya tamiri için hazır web sitesi. Arama ve WhatsApp butonu, hizmet bölgeleri, Google'a uygun yapı.",
    h1: "Ustalar ve teknik servisler için hazır web sitesi",
    intro:
      "Müşteriniz arızayı yaşadığı an telefonundan arar: \"Kadıköy tesisatçı\", \"acil elektrikçi\". Siteniz hangi hizmetleri verdiğinizi, hangi semtlere gittiğinizi gösterir ve tek dokunuşla sizi aratır.",
    kinds: ["Su tesisatçısı", "Elektrikçi", "Klima servisi", "Beyaz eşya servisi", "TV ve uydu servisi", "Mobilya tamiri"],
    features: [
      { title: "Tek dokunuşla arama ve WhatsApp", text: "Telefonda ekranın altında sabit duran butonlarla müşteri sizi hemen arar veya yazar." },
      { title: "Hizmet bölgeleri", text: "Gittiğiniz ilçe ve mahalleler listelenir; \"semt + meslek\" aramalarında işinize yarar." },
      { title: "Hizmetler ve markalar", text: "Mesleğinize göre hazır gelen hizmet listesi ve servis verdiğiniz markalar." },
      { title: "Yaptığınız işler", text: "İş öncesi ve sonrası fotoğraflarınızla güven verin." },
      { title: "Nasıl çalışıyoruz", text: "Arıza tespitinden teslimata adım adım süreç; müşterinin aklındaki soruları baştan cevaplar." },
      { title: "Gerçek Google puanınız", text: "Google'daki puanınızı ve yorum sayınızı ekleyebilirsiniz. Uydurma yorum asla eklenmez." },
    ],
    faq: [
      {
        q: "Yetkili servis değilim, bu sitede sorun olur mu?",
        a: "Sorun olmaz. Markalar bölümünde hazır gelen \"Yetkili servis değiliz, bu markalar dahil tüm cihazlara özel servis veriyoruz\" açıklaması müşteriyi doğru bilgilendirir. Yetkili servisseniz bu cümleyi değiştirebilirsiniz.",
      },
      {
        q: "Birden fazla ilçeye hizmet veriyorum, hepsini yazabilir miyim?",
        a: "Evet. Hizmet bölgeleri bölümüne istediğiniz kadar ilçe ve mahalle ekleyebilirsiniz.",
      },
    ],
  },
  {
    sector: "restoran",
    slug: "restoran-web-sitesi",
    name: "Restoran ve kafe",
    title: "Restoran ve Kafe Web Sitesi, QR Menü Dahil",
    description:
      "Restoran, kafe, pastane, kebapçı ve pizzacılar için hazır web sitesi ve QR menü. Menünüz Google'ın okuyabildiği metin olarak yayınlanır, masa kartları yazdırılır.",
    h1: "Restoran ve kafeler için hazır web sitesi ve QR menü",
    intro:
      "Misafiriniz sizi bulmadan önce menünüze ve fotoğraflarınıza bakar. Siteniz menünüzü, adresinizi ve çalışma saatlerinizi gösterir; masadaki QR kod aynı menüyü telefonda açar.",
    kinds: ["Restoran / lokanta", "Kafe", "Pastane / fırın", "Kebap / ocakbaşı", "Pizza / burger"],
    features: [
      { title: "QR menü ve masa kartları", text: "Panelden QR kodu indirin veya A4'e dört masa kartı yazdırın. Menüyü güncelleyince kodu yeniden basmanız gerekmez." },
      { title: "Menü metin olarak yayında", text: "Menünüz PDF veya fotoğraf değil, Google'ın ve yapay zekâ asistanlarının okuyabildiği metin olarak yayınlanır." },
      { title: "Rezervasyon butonu", text: "Misafir butona basınca WhatsApp'tan hazır mesajla size yazar." },
      { title: "Galeri", text: "Mekânınızın ve yemeklerinizin fotoğrafları." },
      { title: "Çalışma saatleri ve harita", text: "Adresiniz, yol tarifi ve açık olduğunuz saatler tek bakışta." },
      { title: "Fiyatlar sizde", text: "Ürün fiyatlarını isterseniz yazarsınız; örnek içerikte fiyat uydurulmaz." },
    ],
    faq: [
      {
        q: "Menüyü değiştirince QR kodu yeniden bastırmam gerekir mi?",
        a: "Hayır. QR kod sitenizin menü sayfasına gider; menüde yaptığınız değişiklik \"Yayınla\"ya bastığınız an QR menüye de yansır. Sadece domain'inizi değiştirirseniz kodu yeniden basmanız gerekir.",
      },
      {
        q: "Paket servis siparişi alınabiliyor mu?",
        a: "Sitede online sipariş ve ödeme yoktur. Misafirleriniz arama veya WhatsApp butonuyla size doğrudan ulaşır.",
      },
    ],
  },
  {
    sector: "kuafor",
    slug: "kuafor-web-sitesi",
    name: "Kuaför ve güzellik salonu",
    title: "Kuaför ve Güzellik Salonu Web Sitesi: Berber, Tırnak Stüdyosu",
    description:
      "Kadın kuaförü, berber, güzellik salonu ve tırnak stüdyoları için hazır web sitesi. Hizmetler ve fiyatlar, ekip, galeri ve WhatsApp'tan randevu.",
    h1: "Kuaförler ve güzellik salonları için hazır web sitesi",
    intro:
      "Yeni müşteri önce işinizi görmek ister. Siteniz hizmetlerinizi, ekibinizi ve çalışmalarınızı gösterir; randevu butonu müşteriyi WhatsApp'tan size yazdırır.",
    kinds: ["Kadın kuaförü", "Erkek kuaförü / berber", "Güzellik salonu", "Tırnak stüdyosu"],
    features: [
      { title: "Hizmetler ve fiyatlar", text: "Gruplara ayrılmış hizmet listesi; fiyat ve süreyi isterseniz yazarsınız." },
      { title: "WhatsApp'tan randevu", text: "Müşteri butona basınca hazır mesajla size yazar; ek uygulama gerekmez." },
      { title: "Ekibimiz", text: "Ustalarınızı ve uzmanlık alanlarını tanıtın." },
      { title: "Önce / sonra ve galeri", text: "Çalışmalarınızın fotoğrafları en iyi reklamınızdır." },
      { title: "Gerçek Google puanınız", text: "Google'daki puanınızı ve yorum sayınızı ekleyebilirsiniz. Uydurma yorum asla eklenmez." },
      { title: "Çalışma saatleri ve harita", text: "Salonunuzun adresi ve açık olduğunuz saatler." },
    ],
    faq: [
      {
        q: "Online randevu sistemi var mı?",
        a: "Randevular WhatsApp üzerinden alınır: müşteri butona basınca hazır bir mesajla size yazar. Ayrı bir randevu uygulamasına ihtiyaç olmaz.",
      },
      {
        q: "Fiyatlarımı yazmak zorunda mıyım?",
        a: "Hayır. Hizmetlerin fiyat ve süre alanları isteğe bağlıdır.",
      },
    ],
  },
  {
    sector: "klinik",
    slug: "klinik-web-sitesi",
    name: "Klinik",
    title: "Klinik Web Sitesi: Diş Kliniği, Veteriner, Fizyoterapi, Diyetisyen",
    description:
      "Diş kliniği, veteriner, fizik tedavi, diyetisyen ve psikolojik danışmanlık için sağlık reklamı kurallarına uygun, bilgilendirici hazır web sitesi.",
    h1: "Klinikler için bilgilendirici, kurallara uygun web sitesi",
    intro:
      "Hastalarınız kliniğinizi, uzmanlarınızı ve verdiğiniz hizmetleri tanımak ister. Siteniz bu bilgileri sade ve güven veren bir dille sunar; randevu butonu hastayı size yönlendirir.",
    kinds: ["Diş kliniği", "Veteriner kliniği", "Fizik tedavi / fizyoterapi", "Diyetisyen", "Psikolojik danışmanlık"],
    features: [
      { title: "Tedavi ve hizmetler", text: "Bilgilendirici örnek metinlerle gelen hizmet listesi." },
      { title: "Hekimler ve uzmanlar", text: "Uzmanlarınızın unvanları ve uzmanlık alanları." },
      { title: "Kliniğimiz", text: "Kliniğinizin fotoğrafları ve olanakları." },
      { title: "Randevu butonu", text: "Hasta butona basınca sizi arar veya WhatsApp'tan yazar." },
      { title: "Sık sorulan sorular", text: "Hastaların en çok sorduğu sorulara hazır, bilgilendirici cevaplar." },
      { title: "Sağlık reklamı kurallarına uygun", text: "Hasta yorumu, önce/sonra, fiyat ve puan bölümleri bilerek yoktur." },
    ],
    notice:
      "Sağlık hizmetlerinin tanıtımı ilgili mevzuatla sınırlıdır. Klinik şablonu bu yüzden bilgilendirme odaklıdır: hasta yorumu, önce/sonra fotoğrafı, fiyat ve Google puanı içermez. Metinlerinizi bilgilendirici tutmanız ve bağlı olduğunuz meslek odasının kurallarına uymanız sizin sorumluluğunuzdadır.",
    faq: [
      {
        q: "Neden hasta yorumu ekleyemiyorum?",
        a: "Sağlık hizmetlerinde hasta yorumu ve önce/sonra paylaşımı reklam kurallarına takılabilir. Şablon sizi riske atmamak için bu bölümleri içermez.",
      },
      {
        q: "Veteriner kliniğim için de uygun mu?",
        a: "Evet. Kurulumda veteriner kliniği seçildiğinde hizmetler ve sık sorulan sorular buna göre gelir.",
      },
    ],
  },
];

export function getSectorPage(sector: Sector) {
  return sectorPages.find((p) => p.sector === sector)!;
}
