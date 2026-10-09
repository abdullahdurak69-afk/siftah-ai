import type { IconKey } from "../icons";

// Meslek ön ayarları. Kurulum sihirbazında seçilir; içerikler örnek metindir, usta kendine göre düzenler.
// Not: Yorum ve puan gibi müşteriye ait bilgiler asla örnek olarak üretilmez.

export type Preset = {
  label: string;
  // Başlıkta kullanılan ana hizmet: "Sancaktepe'de <TV Tamiri ve Uydu Servisi>"
  mainService: string;
  // schema.org LocalBusiness alt tipi
  schemaType: string;
  intro: string;
  whyUs: string[];
  highlights: { deger: string; etiket: string }[];
  services: { ikon: IconKey; baslik: string; aciklama: string }[];
  brands: string[];
  steps: { baslik: string; aciklama: string }[];
  faq: { soru: string; cevap: string }[];
};

const noAuthorizedService =
  "Yetkili servis değiliz; aşağıdaki markalar dahil tüm cihazlara özel servis hizmeti veriyoruz.";

export const presets = {
  "tv-uydu": {
    label: "TV ve Uydu Servisi",
    mainService: "TV Tamiri ve Uydu Servisi",
    schemaType: "ElectronicsStore",
    intro:
      "Televizyonunuz mu bozuldu? Görüntü yok, ekran kırık, ses var görüntü yok? Aynı gün yerinde servis veriyoruz. Onarım öncesi ücretsiz ön bilgi, onarım sonrası işçilik garantisi.",
    whyUs: [
      "Aynı gün yerinde servis",
      "Tüm markalarda LED panel değişimi",
      "Ücretsiz ön fiyat bilgisi",
      "İşçilik garantili onarım",
      "Onayınız olmadan işlem yapılmaz",
    ],
    highlights: [
      { deger: "Aynı Gün", etiket: "Servis imkânı" },
      { deger: "Garantili", etiket: "İşçilik ve parça" },
      { deger: "Yerinde", etiket: "Adresinizde onarım" },
      { deger: "Tüm Markalar", etiket: "Servis veriyoruz" },
    ],
    services: [
      {
        ikon: "tv",
        baslik: "Televizyon Tamiri",
        aciklama:
          "Görüntü gelmiyor, açılmıyor, ses var görüntü yok, ekranda çizgi veya leke… LED, LCD, OLED ve Smart TV'lerde her türlü arızaya çözüm.",
      },
      {
        ikon: "ampul",
        baslik: "LED Panel Değişimi",
        aciklama:
          "Kırık ekran ve arızalı panellerde uygun fiyatlı panel değişimi. Model bilgisini WhatsApp'tan gönderin, ücretsiz fiyat bilgisi verelim.",
      },
      {
        ikon: "kart",
        baslik: "Anakart ve Besleme Tamiri",
        aciklama:
          "Açılmayan veya kendiliğinden kapanan televizyonlarda kart onarımı. Çoğu zaman panel değişiminden çok daha ekonomiktir.",
      },
      {
        ikon: "uydu",
        baslik: "Uydu ve Çanak Anten",
        aciklama: "Uydu kurulumu, çanak montajı, kanal ayarı, frekans güncellemesi ve sinyal sorunlarının çözümü.",
      },
      {
        ikon: "bina",
        baslik: "Merkezi Uydu Sistemi",
        aciklama: "Apartman ve sitelere merkezi uydu sistemi kurulumu, bakımı ve arıza giderme.",
      },
      {
        ikon: "kablo",
        baslik: "Kumanda ve Aksesuar",
        aciklama: "Her marka TV kumandası, HDMI kablo, LNB ve uydu alıcısı.",
      },
    ],
    brands: ["LG", "Samsung", "Sony", "Philips", "Vestel", "Arçelik", "Beko", "Grundig", "Regal", "TCL", "Toshiba", "Panasonic"],
    steps: [
      { baslik: "Arayın veya Yazın", aciklama: "Telefonla arayın ya da WhatsApp'tan marka, model ve arızayı iletin. Ücretsiz ön bilgi verelim." },
      { baslik: "Yerinde Tespit", aciklama: "Adresinize gelip arızayı tespit ederiz. Gerekirse cihazı atölyemize alırız. Onayınız olmadan işlem yapılmaz." },
      { baslik: "Garantili Teslim", aciklama: "Onarımı tamamlar, cihazınızı çalışır halde teslim ederiz. Yapılan işçilik garanti kapsamındadır." },
    ],
    faq: [
      { soru: "TV tamiri ne kadar sürer?", cevap: "Arızaların çoğu aynı gün veya ertesi gün çözülür. Parça gerektiren işlemlerde süre parça teminine göre birkaç gün uzayabilir." },
      { soru: "LED panel değişimi fiyatı ne kadar?", cevap: "Fiyat televizyonun marka, model ve ekran boyutuna göre değişir. Model bilgisini WhatsApp'tan gönderirseniz ücretsiz fiyat bilgisi veririz." },
      { soru: "Evde / yerinde servis var mı?", cevap: "Evet, hizmet bölgelerimizde adresinize gelerek arıza tespiti ve onarım yapıyoruz." },
      { soru: "Hangi marka televizyonları tamir ediyorsunuz?", cevap: "Tüm marka televizyon ve uydu cihazlarına servis veriyoruz." },
      { soru: "Yapılan işleme garanti veriyor musunuz?", cevap: "Evet, yapılan işçilik garanti kapsamındadır. Garanti süresini işlem öncesinde bildiriyoruz." },
    ],
  },
  "su-tesisat": {
    label: "Su Tesisatçısı",
    mainService: "Su Tesisatı ve Su Kaçağı Tespiti",
    schemaType: "Plumber",
    intro:
      "Su kaçağı, patlak boru, tıkanık gider mi? Kırmadan cihazla kaçak tespiti, tesisat tamiri ve tıkanıklık açma hizmetiyle hızlıca yanınızdayız. Keşif öncesi ücretsiz fiyat bilgisi.",
    whyUs: [
      "Acil durumlarda hızlı müdahale",
      "Kırmadan cihazla kaçak tespiti",
      "Ücretsiz keşif ve fiyat bilgisi",
      "İşçilik garantisi",
      "Temiz ve düzenli çalışma",
    ],
    highlights: [
      { deger: "Hızlı", etiket: "Acil müdahale" },
      { deger: "Ücretsiz", etiket: "Keşif" },
      { deger: "Garantili", etiket: "İşçilik" },
      { deger: "Kırmadan", etiket: "Kaçak tespiti" },
    ],
    services: [
      { ikon: "su", baslik: "Su Kaçağı Tespiti", aciklama: "Termal kamera ve akustik cihazlarla duvar ve zemini kırmadan su kaçağının yerini tespit ediyoruz." },
      { ikon: "anahtar", baslik: "Tesisat Tamiri", aciklama: "Patlak boru, sızdıran vana ve rakor, eskiyen tesisat hatlarının onarımı ve yenilenmesi." },
      { ikon: "cekic", baslik: "Tıkanıklık Açma", aciklama: "Lavabo, gider, tuvalet ve mutfak tıkanıklıklarını makineyle, kırmadan açıyoruz." },
      { ikon: "dus", baslik: "Batarya ve Musluk Değişimi", aciklama: "Banyo ve mutfak bataryası, musluk, rezervuar ve sifon değişimi ve montajı." },
      { ikon: "banyo", baslik: "Banyo ve Mutfak Tesisatı", aciklama: "Tadilat sırasında banyo ve mutfak su tesisatının baştan döşenmesi, vitrifiye montajı." },
      { ikon: "termometre", baslik: "Petek Temizliği", aciklama: "Isınmayan peteklerde makineli petek temizliği ve kombi tesisatı kontrolü." },
    ],
    brands: ["VitrA", "Artema", "Eca", "Grohe", "Hansgrohe", "Creavit", "Kale", "Vaillant", "Demirdöküm", "Baymak", "Bosch", "Viessmann"],
    steps: [
      { baslik: "Arayın veya Yazın", aciklama: "Sorunu telefonda anlatın ya da WhatsApp'tan fotoğraf gönderin, size hemen dönelim." },
      { baslik: "Keşif ve Tespit", aciklama: "Adresinize gelip sorunun kaynağını tespit eder, işe başlamadan önce fiyat bilgisi veririz." },
      { baslik: "Onarım ve Teslim", aciklama: "Onayınızla işi yapar, çalışma alanını temiz bırakarak teslim ederiz." },
    ],
    faq: [
      { soru: "Su kaçağını kırmadan bulabilir misiniz?", cevap: "Evet. Termal kamera ve akustik dinleme cihazlarıyla kaçağın yerini kırmadan tespit ediyoruz; sadece gerekli noktada küçük bir açma yapılır." },
      { soru: "Acil durumlarda ne kadar sürede geliyorsunuz?", cevap: "Hizmet bölgelerimizde acil çağrılara mümkün olan en kısa sürede, genellikle aynı gün içinde geliyoruz." },
      { soru: "Keşif ücretli mi?", cevap: "Hizmet bölgelerimizde keşif ve fiyat bilgisi ücretsizdir." },
      { soru: "Tıkanıklık açma nasıl yapılıyor?", cevap: "Tıkanıklığın türüne göre spiral makine veya basınçlı su ile, tesisatı kırmadan açıyoruz." },
      { soru: "Yaptığınız işe garanti veriyor musunuz?", cevap: "Evet, yapılan işçilik garanti kapsamındadır. Garanti süresini işe başlamadan önce bildiriyoruz." },
    ],
  },
  elektrik: {
    label: "Elektrikçi",
    mainService: "Elektrik Arıza ve Tesisat",
    schemaType: "Electrician",
    intro:
      "Sigorta mı atıyor, priz mi çalışmıyor? Elektrik arıza tespiti, tesisat yenileme, aydınlatma ve priz montajında hızlı ve güvenli hizmet veriyoruz.",
    whyUs: [
      "Hızlı arıza tespiti",
      "Güvenli ve standartlara uygun işçilik",
      "Ücretsiz fiyat bilgisi",
      "İşçilik garantisi",
      "Temiz ve düzenli çalışma",
    ],
    highlights: [
      { deger: "Hızlı", etiket: "Arıza tespiti" },
      { deger: "Güvenli", etiket: "Standartlara uygun" },
      { deger: "Garantili", etiket: "İşçilik" },
      { deger: "Yerinde", etiket: "Adresinizde servis" },
    ],
    services: [
      { ikon: "elektrik", baslik: "Elektrik Arıza Tespiti", aciklama: "Sigorta atması, kısa devre, elektrik kesintisi gibi arızaların kaynağını hızlıca bulup gideriyoruz." },
      { ikon: "priz", baslik: "Priz ve Anahtar Montajı", aciklama: "Yeni priz ve anahtar ekleme, eskiyen veya yanmış priz ve anahtarların değişimi." },
      { ikon: "ampul", baslik: "Aydınlatma ve Avize Montajı", aciklama: "Avize, spot, LED şerit ve dış mekan aydınlatmalarının montajı." },
      { ikon: "kalkan", baslik: "Sigorta ve Kaçak Akım Rölesi", aciklama: "Sigorta kutusu yenileme ve can güvenliği için kaçak akım rölesi montajı." },
      { ikon: "kablo", baslik: "Elektrik Tesisatı Yenileme", aciklama: "Eski binalarda tesisatın tamamen veya kısmen yenilenmesi, ek hat çekimi." },
      { ikon: "kamera", baslik: "Diafon ve Kamera", aciklama: "Görüntülü diafon, zil ve güvenlik kamerası kurulumu." },
    ],
    brands: ["Schneider", "Legrand", "Siemens", "ABB", "Viko", "Makel", "Panasonic", "Philips"],
    steps: [
      { baslik: "Arayın veya Yazın", aciklama: "Arızayı telefonda anlatın ya da WhatsApp'tan fotoğraf gönderin." },
      { baslik: "Tespit ve Fiyat", aciklama: "Adresinize gelip arızayı tespit eder, işe başlamadan önce fiyat bilgisi veririz." },
      { baslik: "Güvenli Onarım", aciklama: "Onayınızla işi yapar, çalıştığını sizinle birlikte test ederek teslim ederiz." },
    ],
    faq: [
      { soru: "Sigortam sürekli atıyor, sebebi ne olabilir?", cevap: "Aşırı yük, kısa devre veya nemlenme gibi birçok sebep olabilir. Yerinde ölçümle sebebi tespit edip gideriyoruz." },
      { soru: "Acil elektrik arızalarına geliyor musunuz?", cevap: "Evet, hizmet bölgelerimizde acil arızalara mümkün olan en kısa sürede geliyoruz." },
      { soru: "Fiyat bilgisi alabilir miyim?", cevap: "İşin kapsamını telefonda veya WhatsApp'tan anlatırsanız ön fiyat bilgisi veririz. Kesin fiyatı yerinde tespitten sonra bildiririz." },
      { soru: "Kaçak akım rölesi neden önemli?", cevap: "Kaçak akım rölesi, elektrik çarpması riskinde akımı otomatik keserek can güvenliğini sağlar. Her evde bulunması önerilir." },
      { soru: "Yaptığınız işe garanti veriyor musunuz?", cevap: "Evet, yapılan işçilik garanti kapsamındadır." },
    ],
  },
  mobilya: {
    label: "Mobilya Tamiri",
    mainService: "Mobilya Tamiri ve Koltuk Döşeme",
    schemaType: "HomeAndConstructionBusiness",
    intro:
      "Koltuğunuz mu yıprandı, dolap kapağınız mı düştü? Koltuk döşeme, mobilya tamiri, montaj ve boya-cila işlerinde yerinde ve atölyede hizmet veriyoruz.",
    whyUs: [
      "Yerinde veya atölyede tamir",
      "Geniş kumaş ve malzeme seçeneği",
      "Ücretsiz fiyat bilgisi",
      "İşçilik garantisi",
      "Zamanında teslim",
    ],
    highlights: [
      { deger: "Yerinde", etiket: "Tamir imkânı" },
      { deger: "Ücretsiz", etiket: "Fiyat bilgisi" },
      { deger: "Garantili", etiket: "İşçilik" },
      { deger: "Zamanında", etiket: "Teslim" },
    ],
    services: [
      { ikon: "koltuk", baslik: "Koltuk Döşeme ve Tamiri", aciklama: "Yıpranmış koltuk ve sandalyelerin kumaş değişimi, sünger yenileme ve iskelet tamiri." },
      { ikon: "cekic", baslik: "Mobilya Tamiri", aciklama: "Kırık dolap, masa, yatak başlığı ve sandalyelerin onarımı." },
      { ikon: "matkap", baslik: "Mobilya Montajı", aciklama: "Yeni alınan veya taşınan mobilyaların sökülmesi, kurulumu ve montajı." },
      { ikon: "rulo", baslik: "Boya ve Cila", aciklama: "Ahşap mobilyaların zımpara, boya ve cila ile yenilenmesi." },
      { ikon: "cetvel", baslik: "Mutfak Dolabı Tamiri", aciklama: "Mutfak dolabı kapak, menteşe, ray ve tezgah onarımı." },
      { ikon: "kilit", baslik: "Kapı ve Menteşe Ayarı", aciklama: "Sarkan dolap ve iç kapıların menteşe, kulp ve kilit ayarı." },
    ],
    brands: ["IKEA", "Bellona", "İstikbal", "Doğtaş", "Kelebek", "Mondi", "Çilek", "Enza Home"],
    steps: [
      { baslik: "Fotoğraf Gönderin", aciklama: "Tamir edilecek mobilyanın fotoğrafını WhatsApp'tan gönderin, ön fiyat bilgisi verelim." },
      { baslik: "Yerinde İnceleme", aciklama: "Gerekirse adresinize gelip ölçü alır, kumaş ve malzeme seçeneklerini gösteririz." },
      { baslik: "Tamir ve Teslim", aciklama: "İşi yerinde veya atölyemizde tamamlar, söz verdiğimiz tarihte teslim ederiz." },
    ],
    faq: [
      { soru: "Koltuk döşeme ne kadar sürer?", cevap: "Koltuğun büyüklüğüne ve seçilen kumaşa göre değişmekle birlikte genellikle birkaç gün içinde teslim ediyoruz." },
      { soru: "Tamir için mobilyayı atölyeye mi götürüyorsunuz?", cevap: "Küçük onarımları yerinde yapıyoruz. Döşeme ve boya gibi işler için mobilyayı atölyemize alıp teslim ediyoruz." },
      { soru: "Kumaşı kendim seçebilir miyim?", cevap: "Evet, kumaş kataloğumuzdan seçebilir veya kendi kumaşınızı getirebilirsiniz." },
      { soru: "Fiyat bilgisi nasıl alabilirim?", cevap: "Mobilyanın fotoğrafını WhatsApp'tan gönderirseniz ücretsiz ön fiyat bilgisi veririz." },
      { soru: "Yaptığınız işe garanti veriyor musunuz?", cevap: "Evet, yapılan işçilik garanti kapsamındadır." },
    ],
  },
  klima: {
    label: "Klima Servisi",
    mainService: "Klima Montajı ve Servisi",
    schemaType: "HVACBusiness",
    intro:
      "Klimanız soğutmuyor, su mu akıtıyor? Klima montajı, bakım, gaz dolumu ve arıza onarımında aynı gün yerinde servis veriyoruz.",
    whyUs: [
      "Aynı gün yerinde servis",
      "Tüm marka klimalara bakım ve onarım",
      "Ücretsiz fiyat bilgisi",
      "İşçilik garantisi",
      "Temiz montaj, düzenli çalışma",
    ],
    highlights: [
      { deger: "Aynı Gün", etiket: "Servis imkânı" },
      { deger: "Tüm Markalar", etiket: "Bakım ve onarım" },
      { deger: "Garantili", etiket: "İşçilik" },
      { deger: "Yerinde", etiket: "Adresinizde servis" },
    ],
    services: [
      { ikon: "kar", baslik: "Klima Montajı", aciklama: "Yeni klimalarınızın keşif, montaj ve devreye alma işlemleri." },
      { ikon: "anahtar", baslik: "Klima Arıza ve Tamiri", aciklama: "Soğutmayan, ısıtmayan, su akıtan veya ses yapan klimaların onarımı." },
      { ikon: "parilti", baslik: "Klima Bakımı ve Temizliği", aciklama: "Filtre, iç ve dış ünite temizliği ile verimli ve sağlıklı çalışma." },
      { ikon: "termometre", baslik: "Gaz Dolumu", aciklama: "Gaz kaçağı kontrolü ve klimanıza uygun gazın dolumu." },
      { ikon: "kamyon", baslik: "Söküm ve Taşıma", aciklama: "Taşınma sırasında klimanızın sökülmesi ve yeni adresinize montajı." },
      { ikon: "pervane", baslik: "Salon Tipi ve VRF Klima", aciklama: "İş yerleri için salon tipi ve merkezi klima sistemlerinin bakımı." },
    ],
    brands: ["Daikin", "Mitsubishi Electric", "Toshiba", "LG", "Samsung", "Arçelik", "Vestel", "Baymak", "Bosch", "Gree", "Midea", "Fujitsu"],
    steps: [
      { baslik: "Arayın veya Yazın", aciklama: "Klimanızın marka-modelini ve sorunu iletin, ücretsiz ön bilgi verelim." },
      { baslik: "Yerinde Kontrol", aciklama: "Adresinize gelip sorunu tespit eder, işe başlamadan fiyat bilgisi veririz." },
      { baslik: "Garantili Servis", aciklama: "Onayınızla işlemi yapar, klimanızı test ederek teslim ederiz." },
    ],
    faq: [
      { soru: "Klima bakımı ne sıklıkla yapılmalı?", cevap: "Verimli çalışma ve sağlık için yılda en az bir kez, tercihen yaz sezonu öncesinde bakım yapılmasını öneriyoruz." },
      { soru: "Klimam soğutmuyor, gaz mı bitti?", cevap: "Soğutmama sorunu gaz eksikliğinden olabileceği gibi kirli filtre veya arızalı parçadan da kaynaklanabilir. Yerinde kontrolle sebebini tespit ediyoruz." },
      { soru: "Montaj ne kadar sürer?", cevap: "Standart bir duvar tipi klima montajı genellikle birkaç saat içinde tamamlanır." },
      { soru: "Hangi marka klimalara servis veriyorsunuz?", cevap: "Tüm marka klimalara bakım, onarım ve montaj hizmeti veriyoruz." },
      { soru: "Yaptığınız işe garanti veriyor musunuz?", cevap: "Evet, yapılan işçilik garanti kapsamındadır." },
    ],
  },
  "beyaz-esya": {
    label: "Beyaz Eşya Servisi",
    mainService: "Beyaz Eşya Tamiri",
    schemaType: "HomeAndConstructionBusiness",
    intro:
      "Çamaşır makineniz su mu boşaltmıyor, buzdolabınız soğutmuyor mu? Tüm marka beyaz eşyalarda aynı gün yerinde servis ve garantili onarım hizmeti veriyoruz.",
    whyUs: [
      "Aynı gün yerinde servis",
      "Tüm markalarda tamir",
      "Ücretsiz ön fiyat bilgisi",
      "İşçilik garantili onarım",
      "Onayınız olmadan işlem yapılmaz",
    ],
    highlights: [
      { deger: "Aynı Gün", etiket: "Servis imkânı" },
      { deger: "Garantili", etiket: "İşçilik ve parça" },
      { deger: "Yerinde", etiket: "Adresinizde onarım" },
      { deger: "Tüm Markalar", etiket: "Servis veriyoruz" },
    ],
    services: [
      { ikon: "camasir", baslik: "Çamaşır Makinesi Tamiri", aciklama: "Su almayan, boşaltmayan, sıkmayan veya ses yapan çamaşır makinelerinin onarımı." },
      { ikon: "buzdolabi", baslik: "Buzdolabı Tamiri", aciklama: "Soğutmayan, buzlanan veya sürekli çalışan buzdolaplarının arıza tespiti ve onarımı." },
      { ikon: "su", baslik: "Bulaşık Makinesi Tamiri", aciklama: "Temiz yıkamayan, su kaçıran veya hata veren bulaşık makinelerinin onarımı." },
      { ikon: "alev", baslik: "Fırın ve Ocak Tamiri", aciklama: "Isıtmayan fırın, yanmayan ocak ve ankastre ürünlerin onarımı." },
      { ikon: "pervane", baslik: "Kurutma Makinesi Tamiri", aciklama: "Kurutmayan veya hata veren kurutma makinelerinin onarımı." },
      { ikon: "mikrodalga", baslik: "Ankastre ve Mikrodalga", aciklama: "Ankastre set ve mikrodalga fırınların arıza tespiti, montajı ve onarımı." },
    ],
    brands: ["Arçelik", "Beko", "Bosch", "Siemens", "Vestel", "Profilo", "Samsung", "LG", "Regal", "Altus", "Electrolux", "Indesit"],
    steps: [
      { baslik: "Arayın veya Yazın", aciklama: "Cihazınızın marka-modelini ve arızayı iletin, ücretsiz ön bilgi verelim." },
      { baslik: "Yerinde Tespit", aciklama: "Adresinize gelip arızayı tespit ederiz. Onayınız olmadan işlem yapılmaz." },
      { baslik: "Garantili Onarım", aciklama: "Onarımı tamamlar, cihazınızı çalışır halde teslim ederiz." },
    ],
    faq: [
      { soru: "Aynı gün servis veriyor musunuz?", cevap: "Hizmet bölgelerimizde çoğu arızaya aynı gün yerinde servis veriyoruz." },
      { soru: "Tamir mi yoksa yeni cihaz mı almalıyım?", cevap: "Arızayı tespit ettikten sonra onarım maliyetini açıkça söylüyoruz; onarım mantıklı değilse bunu da belirtiyoruz." },
      { soru: "Parça değişiminde orijinal parça kullanıyor musunuz?", cevap: "Mümkün olan her durumda orijinal veya eşdeğer kalitede parça kullanıyoruz ve bunu önceden bildiriyoruz." },
      { soru: "Hangi markalara servis veriyorsunuz?", cevap: "Tüm marka beyaz eşyalara özel servis hizmeti veriyoruz." },
      { soru: "Yapılan işleme garanti veriyor musunuz?", cevap: "Evet, yapılan işçilik ve değişen parçalar garanti kapsamındadır." },
    ],
  },
} satisfies Record<string, Preset>;

export type PresetKey = keyof typeof presets;

export function getPreset(key: string | null | undefined): Preset | undefined {
  return key && key in presets ? presets[key as PresetKey] : undefined;
}

export { noAuthorizedService };
