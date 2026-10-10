import type { Fields } from "../engine/fields";
import type { SectionDef } from "../engine/types";
import { hoursField } from "../restoran/sections";

// Kuaför / Güzellik salonu şablonu. Sıra, sitedeki varsayılan sıradır.

const faqFields: Fields = {
  baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
  aciklama: { type: "textarea", label: "Bölüm açıklaması", max: 300 },
  sorular: {
    type: "list",
    label: "Sorular",
    itemLabel: "Soru",
    max: 15,
    summaryField: "soru",
    fields: {
      soru: { type: "text", label: "Soru", required: true, max: 140 },
      cevap: { type: "textarea", label: "Cevap", required: true, max: 800 },
    },
  },
};

export const kuaforSections: SectionDef[] = [
  {
    key: "isletme",
    title: "İşletme bilgileri",
    description: "Telefon, adres ve çalışma saatleri. Randevu butonları WhatsApp numarasına mesaj açar.",
    kind: "settings",
    optional: false,
    fields: {
      logo: { type: "image", label: "Logo", aspect: "logo", hint: "İsteğe bağlı. Yoksa salon adı yazı olarak gösterilir." },
      cep: { type: "phone", label: "Telefon", placeholder: "0532 123 45 67", required: true },
      whatsapp: { type: "phone", label: "WhatsApp numarası", placeholder: "0532 123 45 67", hint: "Randevu mesajları buraya gelir. Boş bırakılırsa telefon kullanılır." },
      sabit: { type: "phone", label: "Sabit telefon", placeholder: "0216 123 45 67" },
      adres: { type: "textarea", label: "Açık adres", required: true, max: 300 },
      ilce: { type: "text", label: "İlçe", placeholder: "Nişantaşı", required: true, max: 40 },
      il: { type: "text", label: "İl", placeholder: "İstanbul", required: true, max: 40 },
      saatler: hoursField,
      haritaLinki: { type: "url", label: "Google Haritalar linki" },
      instagram: { type: "url", label: "Instagram adresi", placeholder: "https://instagram.com/...", hint: "Kuaförler için en önemli vitrin; sitede belirgin gösterilir." },
      googlePuan: { type: "number", label: "Google puanı", placeholder: "4,9", min: 1, max: 5, step: 0.1, hint: "Boş bırakılırsa puan rozeti gösterilmez." },
      yorumSayisi: { type: "number", label: "Google yorum sayısı", placeholder: "85", min: 0, max: 100000, step: 1 },
    },
  },
  {
    key: "hero",
    title: "Giriş (en üst bölüm)",
    description: "Ziyaretçinin ilk gördüğü alan. Salonunuzdan veya çalışmalarınızdan dikey bir fotoğraf çok iyi durur.",
    kind: "block",
    optional: false,
    fields: {
      ustBaslik: { type: "text", label: "Üst satır", placeholder: "Nişantaşı · Kuaför", max: 60 },
      baslik: { type: "text", label: "Başlık", placeholder: "Saçınıza hak ettiği özeni gösterin", required: true, max: 80 },
      aciklama: { type: "textarea", label: "Kısa tanıtım", required: true, max: 400 },
      gorsel: { type: "image", label: "Fotoğraf", aspect: "square", hint: "İsteğe bağlı. Dikey veya kare bir fotoğraf." },
    },
  },
  {
    key: "hizmetler",
    title: "Hizmetler ve fiyatlar",
    description: "Kategorilere ayrılmış hizmet listesi. Fiyat ve süre isteğe bağlıdır.",
    kind: "block",
    optional: false,
    navLabel: "Hizmetler",
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Bölüm açıklaması", max: 300 },
      fiyatlariGoster: { type: "boolean", label: "Fiyatları sitede göster", hint: "Kapalıysa sadece hizmet adları ve süreleri görünür." },
      not: { type: "text", label: "Liste altı notu", placeholder: "Fiyatlar saç uzunluğuna göre değişebilir.", max: 200 },
      kategoriler: {
        type: "list",
        label: "Kategoriler",
        itemLabel: "Kategori",
        max: 12,
        summaryField: "ad",
        fields: {
          ikon: { type: "icon", label: "İkon", set: "kuafor" },
          ad: { type: "text", label: "Kategori adı", placeholder: "Saç Kesimi", required: true, max: 40 },
          hizmetler: {
            type: "list",
            label: "Hizmetler",
            itemLabel: "Hizmet",
            max: 30,
            summaryField: "ad",
            fields: {
              ad: { type: "text", label: "Hizmet adı", required: true, max: 60 },
              aciklama: { type: "text", label: "Kısa açıklama", max: 160 },
              sure: { type: "text", label: "Süre", placeholder: "45 dk", max: 20 },
              fiyat: { type: "number", label: "Fiyat (₺)", min: 0, max: 100000, step: 1 },
              fiyatNotu: { type: "text", label: "Fiyat notu", placeholder: "başlayan fiyatlarla", max: 30, hint: "Fiyatın yanında küçük yazıyla görünür." },
            },
          },
        },
      },
    },
  },
  {
    key: "ekip",
    title: "Ekibimiz",
    kind: "block",
    optional: true,
    navLabel: "Ekibimiz",
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Bölüm açıklaması", max: 300 },
      kisiler: {
        type: "list",
        label: "Kişiler",
        itemLabel: "Kişi",
        max: 12,
        summaryField: "ad",
        fields: {
          ad: { type: "text", label: "Ad soyad", required: true, max: 50 },
          unvan: { type: "text", label: "Unvan", placeholder: "Renk uzmanı", max: 50 },
          fotograf: { type: "image", label: "Fotoğraf", aspect: "square" },
          uzmanliklar: { type: "tags", label: "Uzmanlıklar", placeholder: "Balyaj", max: 5 },
        },
      },
    },
  },
  {
    key: "oncesonra",
    title: "Önce / sonra",
    description: "Çalışmalarınızın önce ve sonra fotoğrafları. Müşterinizin izniyle paylaşın.",
    kind: "block",
    optional: true,
    navLabel: "Çalışmalarımız",
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Bölüm açıklaması", max: 300 },
      ciftler: {
        type: "list",
        label: "Çalışmalar",
        itemLabel: "Çalışma",
        max: 12,
        summaryField: "aciklama",
        fields: {
          once: { type: "image", label: "Önce", aspect: "square" },
          sonra: { type: "image", label: "Sonra", aspect: "square" },
          aciklama: { type: "text", label: "Açıklama", placeholder: "Balyaj + bakım", max: 80 },
        },
      },
    },
  },
  {
    key: "galeri",
    title: "Galeri",
    description: "Salonunuz ve çalışmalarınız.",
    kind: "block",
    optional: true,
    navLabel: "Galeri",
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Bölüm açıklaması", max: 300 },
      fotograflar: { type: "images", label: "Fotoğraflar", max: 24 },
    },
  },
  {
    key: "randevu",
    title: "Randevu",
    description: "Randevu çağrısı. Ziyaretçi butona basınca WhatsApp'tan hazır mesajla size yazar.",
    kind: "block",
    optional: true,
    fields: {
      baslik: { type: "text", label: "Başlık", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Açıklama", max: 300 },
    },
  },
  {
    key: "yorumlar",
    title: "Müşteri yorumları",
    description: "Google'daki gerçek yorumlarınızdan seçtiklerinizi ekleyin.",
    kind: "block",
    optional: true,
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      yorumlar: {
        type: "list",
        label: "Yorumlar",
        itemLabel: "Yorum",
        max: 9,
        summaryField: "ad",
        fields: {
          ad: { type: "text", label: "Müşteri adı", placeholder: "Ayşe K.", required: true, max: 40 },
          yorum: { type: "textarea", label: "Yorum", required: true, max: 500 },
          puan: { type: "number", label: "Puan (1–5)", min: 1, max: 5, step: 1 },
        },
      },
      tumYorumlarLinki: { type: "url", label: "Tüm yorumlar linki", hint: "Google yorumlarınızın adresi." },
    },
  },
  { key: "sss", title: "Sık sorulan sorular", kind: "block", optional: true, navLabel: "S.S.S.", fields: faqFields },
  {
    key: "iletisim",
    title: "İletişim",
    description: "Adres, telefon, saatler ve harita İşletme bilgilerinden gelir.",
    kind: "block",
    optional: false,
    navLabel: "İletişim",
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Bölüm açıklaması", max: 300 },
    },
  },
];

export { faqFields };
