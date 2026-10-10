import type { IconKey } from "../icons";

// Restoran türü ön ayarları. İçerikler örnek metindir, işletme kendine göre düzenler.
// Fiyat, yorum ve puan asla örnek olarak üretilmez: menü fiyatsız gelir, işletme kendi fiyatlarını girer.

type MenuItem = { ad: string; aciklama: string; etiketler?: string[] };

export type RestoranPreset = {
  label: string;
  icon: IconKey;
  // schema.org türü ve mutfak
  schemaType: string;
  cuisine: string;
  heroTitle: string;
  intro: string;
  aboutTitle: string;
  about: string;
  features: { ikon: IconKey; baslik: string; aciklama: string }[];
  categories: { ikon: IconKey; ad: string; aciklama?: string; urunler: MenuItem[] }[];
  reservation: { baslik: string; aciklama: string };
  faq: { soru: string; cevap: string }[];
};

const commonFaq = {
  paket: {
    soru: "Paket servisiniz var mı?",
    cevap: "Evet. Telefonla veya WhatsApp'tan sipariş verebilirsiniz; online sipariş platformlarında da bulunuyoruz.",
  },
  rezervasyon: {
    soru: "Rezervasyon gerekli mi?",
    cevap: "Hafta içi genellikle gerekmez. Hafta sonları ve kalabalık gruplar için WhatsApp'tan rezervasyon yapmanızı öneririz.",
  },
  odeme: { soru: "Kredi kartı geçiyor mu?", cevap: "Nakit, kredi kartı ve temassız ödeme kabul ediyoruz." },
};

export const restoranPresets = {
  lokanta: {
    label: "Restoran / Lokanta",
    icon: "tencere",
    schemaType: "Restaurant",
    cuisine: "Türk mutfağı",
    heroTitle: "Her gün taze, ev yapımı lezzetler",
    intro:
      "Sabah erkenden hazırlanan sulu yemekler, ızgaralar ve tatlılar. Öğle arasında hızlı bir tabldot ya da akşam ailecek keyifli bir yemek için sizi bekliyoruz.",
    aboutTitle: "Hikâyemiz",
    about:
      "Mutfağımızda annelerimizden öğrendiğimiz tarifleri, mevsimin taze ürünleriyle her gün yeniden pişiriyoruz. Hazır sos ve donuk ürün kullanmıyor, yemeklerimizi gün içinde tüketiyoruz. Amacımız, kendi evinizde yer gibi doyduğunuz bir sofra.",
    features: [
      { ikon: "tencere", baslik: "Günlük pişer", aciklama: "Yemekler her sabah taze hazırlanır" },
      { ikon: "kamyon", baslik: "Paket servis", aciklama: "Telefon ve WhatsApp'tan sipariş" },
      { ikon: "takvim", baslik: "Rezervasyon", aciklama: "Grup ve özel günler için" },
      { ikon: "araba", baslik: "Otopark", aciklama: "Yakınında park imkânı" },
    ],
    categories: [
      {
        ikon: "corba",
        ad: "Çorbalar",
        urunler: [
          { ad: "Mercimek Çorbası", aciklama: "Limon ve kıtır ekmekle", etiketler: ["Vejetaryen"] },
          { ad: "Ezogelin Çorbası", aciklama: "Bulgur, kırmızı mercimek, nane", etiketler: ["Vejetaryen"] },
          { ad: "Tavuk Suyu Çorba", aciklama: "Şehriyeli, ev usulü" },
        ],
      },
      {
        ikon: "tencere",
        ad: "Ana Yemekler",
        aciklama: "Günün yemekleri değişebilir, lütfen sorunuz.",
        urunler: [
          { ad: "Etli Kuru Fasulye", aciklama: "Pilav ve turşu ile" },
          { ad: "Orman Kebabı", aciklama: "Kuşbaşı et, bezelye, havuç, patates" },
          { ad: "Karnıyarık", aciklama: "Kıymalı patlıcan, közlenmiş biber" },
          { ad: "Tavuk Sote", aciklama: "Biber, domates, mantar" },
        ],
      },
      {
        ikon: "alev",
        ad: "Izgaralar",
        urunler: [
          { ad: "Köfte", aciklama: "Közlenmiş biber, domates, piyaz ile" },
          { ad: "Tavuk Şiş", aciklama: "Marine edilmiş but, pilav ile" },
          { ad: "Kuzu Pirzola", aciklama: "4 adet, közlenmiş sebze ile", etiketler: ["Şefin önerisi"] },
        ],
      },
      {
        ikon: "salata",
        ad: "Zeytinyağlılar ve Salatalar",
        urunler: [
          { ad: "Zeytinyağlı Taze Fasulye", aciklama: "Soğuk servis", etiketler: ["Vegan"] },
          { ad: "Çoban Salata", aciklama: "Domates, salatalık, biber, soğan", etiketler: ["Vegan"] },
          { ad: "Mevsim Salata", aciklama: "Yeşillikler, nar ekşisi sos", etiketler: ["Vegan"] },
        ],
      },
      {
        ikon: "pasta",
        ad: "Tatlılar",
        urunler: [
          { ad: "Sütlaç", aciklama: "Fırında, tarçınlı", etiketler: ["Vejetaryen"] },
          { ad: "Kabak Tatlısı", aciklama: "Tahin ve cevizle (mevsiminde)" },
          { ad: "İrmik Helvası", aciklama: "Dondurmalı servis edilebilir" },
        ],
      },
      {
        ikon: "kahve",
        ad: "İçecekler",
        urunler: [
          { ad: "Ayran", aciklama: "" },
          { ad: "Şalgam", aciklama: "Acılı veya acısız" },
          { ad: "Çay", aciklama: "" },
          { ad: "Türk Kahvesi", aciklama: "" },
        ],
      },
    ],
    reservation: {
      baslik: "Masanızı ayırtalım",
      aciklama: "Doğum günü, iş yemeği veya kalabalık aile sofraları için önceden haber verin, yerinizi hazırlayalım.",
    },
    faq: [
      commonFaq.rezervasyon,
      commonFaq.paket,
      { soru: "Günün menüsünü nereden öğrenebilirim?", cevap: "Günün yemeklerini her sabah WhatsApp'tan sorabilir veya bizi arayabilirsiniz." },
      commonFaq.odeme,
    ],
  },
  kafe: {
    label: "Kafe",
    icon: "kahve",
    schemaType: "CafeOrCoffeeShop",
    cuisine: "Kahve ve kahvaltı",
    heroTitle: "Güne güzel bir kahveyle başlayın",
    intro:
      "Özenle demlenmiş kahveler, ev yapımı kekler ve serpme kahvaltı. Çalışmak, arkadaşlarla buluşmak ya da sadece biraz dinlenmek için sıcak bir köşe.",
    aboutTitle: "Biz kimiz?",
    about:
      "Küçük bir kahve tutkusuyla başladık. Çekirdeklerimizi taze kavrulmuş olarak alıyor, keklerimizi ve kurabiyelerimizi her gün kendi mutfağımızda pişiriyoruz. Mahallenin buluşma noktası olmaktan mutluluk duyuyoruz.",
    features: [
      { ikon: "kahve", baslik: "Taze kavrum", aciklama: "Özenle seçilmiş çekirdekler" },
      { ikon: "pasta", baslik: "Ev yapımı", aciklama: "Kekler her gün taze" },
      { ikon: "wifi", baslik: "Ücretsiz Wi-Fi", aciklama: "Çalışmak için ideal" },
      { ikon: "yaprak", baslik: "Bitkisel süt", aciklama: "Yulaf ve badem sütü seçeneği" },
    ],
    categories: [
      {
        ikon: "kahve",
        ad: "Sıcak Kahveler",
        urunler: [
          { ad: "Espresso", aciklama: "Tek veya duble shot" },
          { ad: "Americano", aciklama: "" },
          { ad: "Latte", aciklama: "İsteğe göre bitkisel sütle" },
          { ad: "Cappuccino", aciklama: "" },
          { ad: "Türk Kahvesi", aciklama: "Lokum ile" },
        ],
      },
      {
        ikon: "icecek",
        ad: "Soğuk İçecekler",
        urunler: [
          { ad: "Iced Latte", aciklama: "" },
          { ad: "Cold Brew", aciklama: "18 saat soğuk demleme" },
          { ad: "Ev Yapımı Limonata", aciklama: "Taze nane ile", etiketler: ["Vegan"] },
        ],
      },
      {
        ikon: "kruvasan",
        ad: "Kahvaltı",
        aciklama: "Hafta sonu 09:00 – 14:00 arası",
        urunler: [
          { ad: "Serpme Kahvaltı (2 kişilik)", aciklama: "Peynir çeşitleri, zeytin, reçeller, yumurta, sınırsız çay" },
          { ad: "Menemen", aciklama: "Köy biberi ve domatesle", etiketler: ["Vejetaryen"] },
          { ad: "Avokadolu Tost", aciklama: "Ekşi maya ekmek, poşe yumurta" },
        ],
      },
      {
        ikon: "sandvic",
        ad: "Sandviç ve Tostlar",
        urunler: [
          { ad: "Kaşarlı Tost", aciklama: "", etiketler: ["Vejetaryen"] },
          { ad: "Tavuklu Sandviç", aciklama: "Ciabatta, pesto, roka" },
          { ad: "Hellim Sandviç", aciklama: "Domates, roka, zeytin ezmesi", etiketler: ["Vejetaryen"] },
        ],
      },
      {
        ikon: "pasta",
        ad: "Tatlılar",
        urunler: [
          { ad: "San Sebastian Cheesecake", aciklama: "", etiketler: ["Şefin önerisi"] },
          { ad: "Havuçlu Tarçınlı Kek", aciklama: "" },
          { ad: "Brownie", aciklama: "Dondurma ile" },
        ],
      },
    ],
    reservation: {
      baslik: "Grup ve etkinlikleriniz için",
      aciklama: "Doğum günü, toplantı veya küçük bir kutlama mı planlıyorsunuz? Bize yazın, sizin için yer ayıralım.",
    },
    faq: [
      { soru: "Çalışmak için uygun mu?", cevap: "Evet, ücretsiz Wi-Fi ve priz erişimi olan masalarımız var." },
      { soru: "Bitkisel süt seçeneğiniz var mı?", cevap: "Yulaf ve badem sütü seçeneklerimiz bulunuyor." },
      { soru: "Evcil hayvan kabul ediyor musunuz?", cevap: "Bahçe bölümümüzde evcil dostlarınızla oturabilirsiniz." },
      commonFaq.odeme,
    ],
  },
  pastane: {
    label: "Pastane / Fırın",
    icon: "pasta",
    schemaType: "Bakery",
    cuisine: "Pastane ve fırın ürünleri",
    heroTitle: "Her sabah fırından taze",
    intro:
      "Taze ekmekler, poğaçalar, pastalar ve kurabiyeler. Özel günleriniz için siparişe özel pasta hazırlıyoruz.",
    aboutTitle: "Fırınımız",
    about:
      "Ekmeklerimizi uzun mayalanma ile, katkı maddesi kullanmadan pişiriyoruz. Pastalarımızda tereyağı ve gerçek krema kullanıyor, siparişleri dilediğiniz tasarımla hazırlıyoruz.",
    features: [
      { ikon: "alev", baslik: "Taze fırın", aciklama: "Gün boyu sıcak ürün" },
      { ikon: "pasta", baslik: "Özel pasta", aciklama: "Doğum günü, nişan, düğün" },
      { ikon: "kamyon", baslik: "Teslimat", aciklama: "Pasta siparişlerinde adrese teslim" },
      { ikon: "kahve", baslik: "Kahve köşesi", aciklama: "Taze ürünün yanında sıcak içecek" },
    ],
    categories: [
      {
        ikon: "kruvasan",
        ad: "Ekmek ve Poğaça",
        urunler: [
          { ad: "Ekşi Mayalı Köy Ekmeği", aciklama: "", etiketler: ["Vegan"] },
          { ad: "Peynirli Poğaça", aciklama: "", etiketler: ["Vejetaryen"] },
          { ad: "Zeytinli Açma", aciklama: "", etiketler: ["Vejetaryen"] },
          { ad: "Simit", aciklama: "" },
        ],
      },
      {
        ikon: "pasta",
        ad: "Yaş Pastalar",
        aciklama: "Dilim veya bütün olarak; özel tasarımlar için en az 2 gün önceden sipariş verin.",
        urunler: [
          { ad: "Çikolatalı Pasta", aciklama: "Bitter çikolata, frambuaz" },
          { ad: "Frambuazlı Pasta", aciklama: "Taze meyve, hafif krema" },
          { ad: "Profiterol", aciklama: "" },
        ],
      },
      {
        ikon: "dondurma",
        ad: "Kurabiye ve Kuru Pasta",
        urunler: [
          { ad: "Tereyağlı Kurabiye", aciklama: "Kilo ile" },
          { ad: "Acıbadem Kurabiyesi", aciklama: "", etiketler: ["Glutensiz"] },
          { ad: "Tuzlu Kurabiye", aciklama: "" },
        ],
      },
      {
        ikon: "kahve",
        ad: "İçecekler",
        urunler: [
          { ad: "Çay", aciklama: "" },
          { ad: "Filtre Kahve", aciklama: "" },
          { ad: "Sıcak Çikolata", aciklama: "" },
        ],
      },
    ],
    reservation: {
      baslik: "Özel gün pastası siparişi",
      aciklama: "İstediğiniz tasarımın fotoğrafını ve kişi sayısını WhatsApp'tan gönderin, fiyat ve teslim tarihini hemen bildirelim.",
    },
    faq: [
      { soru: "Pasta siparişini ne kadar önce vermeliyim?", cevap: "Standart pastalar için 1 gün, özel tasarımlar için en az 2–3 gün önceden sipariş vermenizi öneririz." },
      { soru: "Adrese teslimat yapıyor musunuz?", cevap: "Pasta siparişlerinde belirli bölgelere teslimat yapıyoruz; ayrıntı için bize yazın." },
      { soru: "Glutensiz ürününüz var mı?", cevap: "Bazı kurabiyelerimiz glutensizdir; günlük durum için lütfen sorun." },
      commonFaq.odeme,
    ],
  },
  kebap: {
    label: "Kebap / Ocakbaşı",
    icon: "alev",
    schemaType: "Restaurant",
    cuisine: "Kebap ve ızgara",
    heroTitle: "Közün başında, ustasının elinden",
    intro:
      "Odun ateşinde pişen kebaplar, el yapımı lahmacun ve pide, mevsim mezeleri. Ocakbaşında oturup ustamızı izleyerek yemeğinizin tadını çıkarın.",
    aboutTitle: "Ocağımız",
    about:
      "Etlerimizi her gün güvendiğimiz kasaplardan alıyor, kıymamızı zırhla kendimiz çekiyoruz. Kebaplarımız meşe kömüründe, lahmacun ve pidelerimiz taş fırında pişer.",
    features: [
      { ikon: "alev", baslik: "Meşe kömürü", aciklama: "Ocakbaşı lezzeti" },
      { ikon: "sef", baslik: "Usta elinden", aciklama: "Günlük zırh kıyması" },
      { ikon: "kamyon", baslik: "Paket servis", aciklama: "Sıcak teslim" },
      { ikon: "takvim", baslik: "Rezervasyon", aciklama: "Kalabalık sofralar için" },
    ],
    categories: [
      {
        ikon: "salata",
        ad: "Mezeler",
        urunler: [
          { ad: "Acılı Ezme", aciklama: "", etiketler: ["Vegan", "Acılı"] },
          { ad: "Haydari", aciklama: "", etiketler: ["Vejetaryen"] },
          { ad: "Közlenmiş Patlıcan Salatası", aciklama: "", etiketler: ["Vegan"] },
        ],
      },
      {
        ikon: "alev",
        ad: "Kebaplar",
        urunler: [
          { ad: "Adana Kebap", aciklama: "Zırh kıyması, közlenmiş biber ve domates", etiketler: ["Acılı"] },
          { ad: "Urfa Kebap", aciklama: "" },
          { ad: "Beyti", aciklama: "Lavaşa sarılı, yoğurt ve tereyağlı sos" },
          { ad: "Kuzu Şiş", aciklama: "" },
          { ad: "Tavuk Kanat", aciklama: "" },
        ],
      },
      {
        ikon: "pizza",
        ad: "Lahmacun ve Pide",
        urunler: [
          { ad: "Lahmacun", aciklama: "Taş fırında" },
          { ad: "Kıymalı Pide", aciklama: "" },
          { ad: "Kaşarlı Pide", aciklama: "", etiketler: ["Vejetaryen"] },
        ],
      },
      {
        ikon: "pasta",
        ad: "Tatlılar",
        urunler: [
          { ad: "Künefe", aciklama: "Antep fıstıklı" },
          { ad: "Katmer", aciklama: "Kaymak ve fıstıkla" },
        ],
      },
      {
        ikon: "icecek",
        ad: "İçecekler",
        urunler: [
          { ad: "Ayran", aciklama: "Yayık ayranı" },
          { ad: "Şalgam", aciklama: "Acılı veya acısız" },
          { ad: "Meşrubatlar", aciklama: "" },
        ],
      },
    ],
    reservation: {
      baslik: "Ocakbaşında yerinizi ayırtın",
      aciklama: "Hafta sonları ocakbaşı masalarımız erken doluyor. Kişi sayısını ve saati yazın, yerinizi hazırlayalım.",
    },
    faq: [commonFaq.rezervasyon, commonFaq.paket, commonFaq.odeme],
  },
  pizza: {
    label: "Pizza / Burger",
    icon: "pizza",
    schemaType: "FastFoodRestaurant",
    cuisine: "Pizza ve burger",
    heroTitle: "İnce hamur, bol malzeme",
    intro:
      "Taş fırında pişen pizzalar, her gün taze çekilen etten burgerler ve çıtır patatesler. Gel-al, paket servis veya restoranımızda.",
    aboutTitle: "Biz kimiz?",
    about:
      "Hamurumuzu 48 saat dinlendiriyor, soslarımızı kendi mutfağımızda hazırlıyoruz. Burger köftelerimiz her gün taze çekilen dana etinden.",
    features: [
      { ikon: "pizza", baslik: "Taş fırın", aciklama: "48 saat dinlenmiş hamur" },
      { ikon: "kamyon", baslik: "Hızlı teslimat", aciklama: "Sıcak ve zamanında" },
      { ikon: "yaprak", baslik: "Vejetaryen", aciklama: "Etsiz seçenekler" },
      { ikon: "saat", baslik: "Geç saate kadar", aciklama: "Gece siparişleri" },
    ],
    categories: [
      {
        ikon: "pizza",
        ad: "Pizzalar",
        urunler: [
          { ad: "Margherita", aciklama: "Domates sos, mozzarella, fesleğen", etiketler: ["Vejetaryen"] },
          { ad: "Karışık", aciklama: "Sucuk, salam, mantar, biber, zeytin" },
          { ad: "Dört Peynirli", aciklama: "", etiketler: ["Vejetaryen"] },
          { ad: "Acılı Sucuklu", aciklama: "", etiketler: ["Acılı"] },
        ],
      },
      {
        ikon: "sandvic",
        ad: "Burgerler",
        aciklama: "Tüm burgerler patates kızartması ile servis edilir.",
        urunler: [
          { ad: "Klasik Burger", aciklama: "150 g dana köfte, cheddar, turşu, özel sos" },
          { ad: "Mantarlı Burger", aciklama: "Sote mantar, İsviçre peyniri" },
          { ad: "Tavuk Burger", aciklama: "Çıtır tavuk, coleslaw" },
          { ad: "Vejetaryen Burger", aciklama: "Nohut köfte, avokado", etiketler: ["Vejetaryen"] },
        ],
      },
      {
        ikon: "salata",
        ad: "Yan Ürünler",
        urunler: [
          { ad: "Patates Kızartması", aciklama: "", etiketler: ["Vegan"] },
          { ad: "Soğan Halkası", aciklama: "" },
          { ad: "Sezar Salata", aciklama: "" },
        ],
      },
      {
        ikon: "icecek",
        ad: "İçecekler",
        urunler: [
          { ad: "Meşrubatlar", aciklama: "" },
          { ad: "Ayran", aciklama: "" },
          { ad: "Ev Yapımı Limonata", aciklama: "" },
        ],
      },
    ],
    reservation: {
      baslik: "Toplu sipariş ve doğum günleri",
      aciklama: "Ofis, okul veya doğum günü için toplu sipariş mi vereceksiniz? Bize yazın, size özel teklif hazırlayalım.",
    },
    faq: [
      commonFaq.paket,
      { soru: "Teslimat süreniz ne kadar?", cevap: "Yoğunluğa göre genellikle 30–45 dakika içinde teslim ediyoruz." },
      { soru: "Vejetaryen seçeneğiniz var mı?", cevap: "Menümüzde vejetaryen pizza ve burger seçeneklerimiz var; etiketlerden görebilirsiniz." },
      commonFaq.odeme,
    ],
  },
} satisfies Record<string, RestoranPreset>;

export type RestoranPresetKey = keyof typeof restoranPresets;

export function getRestoranPreset(key: string | null): RestoranPreset | null {
  return key && key in restoranPresets ? restoranPresets[key as RestoranPresetKey] : null;
}
