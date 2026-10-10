import type { IconKey } from "../icons";

// Kuaför / güzellik türü ön ayarları. İçerikler örnek metindir; fiyatlar boş gelir, salon kendi fiyatını girer.

type Service = { ad: string; aciklama?: string; sure?: string };

export type KuaforPreset = {
  label: string;
  icon: IconKey;
  schemaType: string;
  heroTitle: string;
  intro: string;
  categories: { ikon: IconKey; ad: string; hizmetler: Service[] }[];
  appointment: { baslik: string; aciklama: string };
  faq: { soru: string; cevap: string }[];
};

const faq = {
  randevu: {
    soru: "Randevusuz gelebilir miyim?",
    cevap: "Uygunluk durumuna göre randevusuz da hizmet veriyoruz; beklememek için WhatsApp'tan randevu almanızı öneririz.",
  },
  iptal: {
    soru: "Randevumu nasıl değiştirebilirim?",
    cevap: "Randevu saatinden en az birkaç saat önce telefonla veya WhatsApp'tan haber vermeniz yeterli.",
  },
  urun: {
    soru: "Hangi ürünleri kullanıyorsunuz?",
    cevap: "Profesyonel salon ürünleri kullanıyoruz. Hassasiyetiniz varsa işlem öncesi bize söylemeniz yeterli.",
  },
  odeme: { soru: "Kredi kartı geçiyor mu?", cevap: "Nakit, kredi kartı ve temassız ödeme kabul ediyoruz." },
};

export const kuaforPresets = {
  kadin: {
    label: "Kadın Kuaförü",
    icon: "makas",
    schemaType: "HairSalon",
    heroTitle: "Saçınıza hak ettiği özeni gösterin",
    intro:
      "Kesimden renklendirmeye, bakımdan gelin saçına kadar tüm saç hizmetleri. Saç tipinize ve tarzınıza uygun öneriler için sizi salonumuza bekliyoruz.",
    categories: [
      {
        ikon: "makas",
        ad: "Kesim ve Şekillendirme",
        hizmetler: [
          { ad: "Saç Kesimi", aciklama: "Yıkama ve fön dahil", sure: "45 dk" },
          { ad: "Fön", sure: "30 dk" },
          { ad: "Dalgalı / Maşa", sure: "45 dk" },
          { ad: "Topuz", sure: "60 dk" },
        ],
      },
      {
        ikon: "palet",
        ad: "Renklendirme",
        hizmetler: [
          { ad: "Dip Boya", sure: "90 dk" },
          { ad: "Tüm Boya", sure: "120 dk" },
          { ad: "Balyaj", aciklama: "Saç uzunluğuna göre", sure: "180 dk" },
          { ad: "Ombre", sure: "180 dk" },
        ],
      },
      {
        ikon: "su",
        ad: "Bakım",
        hizmetler: [
          { ad: "Keratin Bakım", sure: "120 dk" },
          { ad: "Botoks Bakım", sure: "90 dk" },
          { ad: "Nem Bakımı", sure: "30 dk" },
        ],
      },
      {
        ikon: "tac",
        ad: "Gelin ve Özel Gün",
        hizmetler: [
          { ad: "Gelin Saçı", aciklama: "Prova dahil" },
          { ad: "Nişan / Söz Saçı" },
          { ad: "Makyaj" },
        ],
      },
    ],
    appointment: {
      baslik: "Randevunuzu şimdi alın",
      aciklama: "İstediğiniz hizmeti ve size uygun günü yazın, en kısa sürede dönüş yapalım.",
    },
    faq: [
      faq.randevu,
      { soru: "Balyaj ne kadar sürer?", cevap: "Saç uzunluğuna ve yoğunluğuna göre genellikle 3–4 saat sürer. Size en uygun tekniği ön görüşmede belirliyoruz." },
      { soru: "Gelin saçı için prova yapıyor musunuz?", cevap: "Evet, düğünden önce bir prova randevusu ayarlıyoruz." },
      faq.urun,
      faq.odeme,
    ],
  },
  berber: {
    label: "Erkek Kuaförü / Berber",
    icon: "makas",
    schemaType: "HairSalon",
    heroTitle: "Klasik ustalık, modern kesim",
    intro:
      "Saç ve sakal kesiminde usta ellere emanetsiniz. Sıcak havlu, ustura tıraşı ve bakım hizmetleriyle kendinizi yenilenmiş hissedin.",
    categories: [
      {
        ikon: "makas",
        ad: "Saç",
        hizmetler: [
          { ad: "Saç Kesimi", sure: "30 dk" },
          { ad: "Saç Yıkama ve Şekillendirme", sure: "15 dk" },
          { ad: "Çocuk Saç Kesimi", sure: "20 dk" },
        ],
      },
      {
        ikon: "firca",
        ad: "Sakal ve Tıraş",
        hizmetler: [
          { ad: "Sakal Kesimi ve Şekillendirme", sure: "20 dk" },
          { ad: "Ustura Tıraşı", aciklama: "Sıcak havlu ile", sure: "30 dk" },
          { ad: "Saç + Sakal", sure: "45 dk" },
        ],
      },
      {
        ikon: "parilti",
        ad: "Bakım",
        hizmetler: [
          { ad: "Cilt Bakımı", sure: "30 dk" },
          { ad: "Siyah Maske", sure: "15 dk" },
          { ad: "Kaş Alımı", sure: "10 dk" },
          { ad: "Saç Boyası", sure: "45 dk" },
        ],
      },
      {
        ikon: "tac",
        ad: "Damat Paketi",
        hizmetler: [{ ad: "Damat Tıraşı", aciklama: "Saç, sakal, cilt bakımı ve fön" }],
      },
    ],
    appointment: {
      baslik: "Sıra beklemeyin",
      aciklama: "WhatsApp'tan saat ayırtın, geldiğinizde koltuğunuz hazır olsun.",
    },
    faq: [
      faq.randevu,
      { soru: "Çocuk saç kesimi yapıyor musunuz?", cevap: "Evet, her yaştan çocuğa saç kesimi yapıyoruz." },
      { soru: "Damat paketinde neler var?", cevap: "Saç ve sakal kesimi, ustura tıraşı, cilt bakımı ve fön. Ayrıntılar için bize yazın." },
      faq.odeme,
    ],
  },
  guzellik: {
    label: "Güzellik Salonu",
    icon: "parilti",
    schemaType: "BeautySalon",
    heroTitle: "Kendinize ayırdığınız zaman",
    intro:
      "Cilt bakımı, ağda, kaş ve kirpik uygulamaları ile manikür ve pedikür. Hijyenik ortamda, uzman ekibimizle kendinizi şımartın.",
    categories: [
      {
        ikon: "parilti",
        ad: "Cilt Bakımı",
        hizmetler: [
          { ad: "Klasik Cilt Bakımı", sure: "60 dk" },
          { ad: "Hydrafacial", sure: "60 dk" },
          { ad: "Leke Bakımı", sure: "45 dk" },
        ],
      },
      {
        ikon: "goz",
        ad: "Kaş ve Kirpik",
        hizmetler: [
          { ad: "Kaş Tasarımı", sure: "20 dk" },
          { ad: "Kirpik Lifting", sure: "60 dk" },
          { ad: "İpek Kirpik", sure: "90 dk" },
        ],
      },
      {
        ikon: "yaprak",
        ad: "Ağda",
        hizmetler: [
          { ad: "Tüm Bacak", sure: "40 dk" },
          { ad: "Koltuk Altı", sure: "10 dk" },
          { ad: "Yüz", sure: "15 dk" },
        ],
      },
      {
        ikon: "el",
        ad: "El ve Ayak",
        hizmetler: [
          { ad: "Manikür", sure: "40 dk" },
          { ad: "Pedikür", sure: "50 dk" },
          { ad: "Kalıcı Oje", sure: "45 dk" },
        ],
      },
    ],
    appointment: {
      baslik: "Randevu alın",
      aciklama: "İstediğiniz uygulamayı ve size uygun günü yazın, uygun saatleri hemen iletelim.",
    },
    faq: [
      faq.randevu,
      { soru: "İlk kez cilt bakımı yaptıracağım, nasıl bir yol izlenir?", cevap: "Önce cilt tipinizi değerlendiriyor, size uygun bakımı birlikte seçiyoruz." },
      { soru: "Kullandığınız malzemeler tek kullanımlık mı?", cevap: "Uygun olan tüm malzemeler tek kullanımlıktır; diğerleri her müşteriden sonra sterilize edilir." },
      faq.odeme,
    ],
  },
  tirnak: {
    label: "Tırnak Stüdyosu",
    icon: "el",
    schemaType: "NailSalon",
    heroTitle: "Tırnaklarınız için özenli dokunuşlar",
    intro:
      "Kalıcı oje, protez tırnak, nail art ve el-ayak bakımı. Steril ortamda, size özel tasarımlarla.",
    categories: [
      {
        ikon: "el",
        ad: "Manikür ve Pedikür",
        hizmetler: [
          { ad: "Manikür", sure: "40 dk" },
          { ad: "Pedikür", sure: "50 dk" },
          { ad: "Islak Pedikür", sure: "60 dk" },
        ],
      },
      {
        ikon: "palet",
        ad: "Kalıcı Oje",
        hizmetler: [
          { ad: "El Kalıcı Oje", sure: "45 dk" },
          { ad: "Ayak Kalıcı Oje", sure: "45 dk" },
          { ad: "Kalıcı Oje Çıkarma", sure: "15 dk" },
        ],
      },
      {
        ikon: "mucevher",
        ad: "Protez Tırnak",
        hizmetler: [
          { ad: "Jel Tırnak", sure: "90 dk" },
          { ad: "Protez Tırnak Bakımı (Dolgu)", sure: "75 dk" },
        ],
      },
      {
        ikon: "cicek",
        ad: "Nail Art",
        hizmetler: [{ ad: "Tasarım", aciklama: "Tırnak başına veya tüm tırnaklar" }, { ad: "French", sure: "15 dk" }],
      },
    ],
    appointment: {
      baslik: "Randevu alın",
      aciklama: "Beğendiğiniz tasarımın fotoğrafını WhatsApp'tan gönderin, süre ve uygun saatleri birlikte planlayalım.",
    },
    faq: [
      faq.randevu,
      { soru: "Kalıcı oje ne kadar dayanır?", cevap: "Tırnak yapınıza ve günlük kullanıma göre genellikle 2–3 hafta dayanır." },
      { soru: "Malzemeleriniz steril mi?", cevap: "Metal aletlerimiz her müşteriden sonra sterilize edilir, törpü gibi malzemeler tek kullanımlıktır." },
      faq.odeme,
    ],
  },
} satisfies Record<string, KuaforPreset>;

export type KuaforPresetKey = keyof typeof kuaforPresets;

export function getKuaforPreset(key: string | null): KuaforPreset | null {
  return key && key in kuaforPresets ? kuaforPresets[key as KuaforPresetKey] : null;
}
