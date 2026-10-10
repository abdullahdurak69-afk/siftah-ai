import type { Fields } from "../engine/fields";
import type { SectionDef } from "../engine/types";

// Restoran / Kafe şablonu. Sıra, sitedeki varsayılan sıradır.

export const hoursField: Fields[string] = {
  type: "list",
  label: "Çalışma saatleri",
  itemLabel: "Satır",
  max: 7,
  summaryField: "gun",
  fields: {
    gun: { type: "text", label: "Gün(ler)", placeholder: "Pazartesi – Cuma", required: true, max: 40 },
    saat: { type: "text", label: "Saat", placeholder: "09:00 – 23:00 veya Kapalı", required: true, max: 40 },
  },
};

export const restoranSections: SectionDef[] = [
  {
    key: "isletme",
    title: "İşletme bilgileri",
    description: "Telefon, adres, çalışma saatleri ve online sipariş linkleri. Sitenin birçok yerinde kullanılır.",
    kind: "settings",
    optional: false,
    fields: {
      logo: { type: "image", label: "Logo", aspect: "logo", hint: "İsteğe bağlı. Yoksa işletme adı yazı olarak gösterilir." },
      cep: { type: "phone", label: "Telefon", placeholder: "0532 123 45 67", required: true, hint: "Sitedeki Ara butonları bu numarayı arar." },
      whatsapp: { type: "phone", label: "WhatsApp numarası", placeholder: "0532 123 45 67", hint: "Rezervasyon mesajları buraya gelir. Boş bırakılırsa telefon kullanılır." },
      sabit: { type: "phone", label: "Sabit telefon", placeholder: "0216 123 45 67" },
      adres: { type: "textarea", label: "Açık adres", required: true, max: 300 },
      ilce: { type: "text", label: "İlçe", placeholder: "Kadıköy", required: true, max: 40 },
      il: { type: "text", label: "İl", placeholder: "İstanbul", required: true, max: 40 },
      saatler: hoursField,
      haritaLinki: { type: "url", label: "Google Haritalar linki" },
      instagram: { type: "url", label: "Instagram adresi", placeholder: "https://instagram.com/..." },
      yemeksepeti: { type: "url", label: "Yemeksepeti linki", hint: "Doluysa sitede \"Online sipariş\" butonu çıkar." },
      getir: { type: "url", label: "Getir Yemek linki" },
      trendyol: { type: "url", label: "Trendyol Yemek linki" },
      googlePuan: { type: "number", label: "Google puanı", placeholder: "4,7", min: 1, max: 5, step: 0.1, hint: "Boş bırakılırsa puan rozeti gösterilmez." },
      yorumSayisi: { type: "number", label: "Google yorum sayısı", placeholder: "120", min: 0, max: 100000, step: 1 },
    },
  },
  {
    key: "hero",
    title: "Giriş (en üst bölüm)",
    description: "Ziyaretçinin ilk gördüğü alan. Geniş, iştah açıcı bir fotoğraf en iyi sonucu verir.",
    kind: "block",
    optional: false,
    fields: {
      ustBaslik: { type: "text", label: "Üst satır", placeholder: "Kadıköy · 1998'den beri", max: 60 },
      baslik: { type: "text", label: "Başlık", placeholder: "Ev yemeğinin en güzel hali", required: true, max: 80 },
      aciklama: { type: "textarea", label: "Kısa tanıtım", required: true, max: 400 },
      gorsel: { type: "image", label: "Arka plan fotoğrafı", aspect: "wide", hint: "Yemekleriniz veya salonunuzun geniş bir fotoğrafı." },
    },
  },
  {
    key: "ozellikler",
    title: "Öne çıkanlar",
    description: "Paket servis, otopark, bahçe gibi kısa bilgiler.",
    kind: "block",
    optional: true,
    fields: {
      liste: {
        type: "list",
        label: "Özellikler",
        itemLabel: "Özellik",
        max: 4,
        summaryField: "baslik",
        fields: {
          ikon: { type: "icon", label: "İkon", set: "restoran" },
          baslik: { type: "text", label: "Başlık", placeholder: "Paket servis", required: true, max: 30 },
          aciklama: { type: "text", label: "Açıklama", placeholder: "3 km'ye kadar ücretsiz", max: 80 },
        },
      },
    },
  },
  {
    key: "hakkimizda",
    title: "Hakkımızda",
    kind: "block",
    optional: true,
    navLabel: "Hakkımızda",
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      metin: { type: "textarea", label: "Hikâyeniz", required: true, max: 1500 },
      gorsel: { type: "image", label: "Fotoğraf", aspect: "square", hint: "Mutfağınız, ekibiniz veya salonunuz." },
    },
  },
  {
    key: "menu",
    title: "Menü",
    description: "Kategoriler ve ürünler. Aynı menü QR menü sayfasında da gösterilir.",
    kind: "block",
    optional: false,
    navLabel: "Menü",
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Bölüm açıklaması", max: 300 },
      fiyatlariGoster: { type: "boolean", label: "Fiyatları sitede göster", hint: "Kapalıysa sadece ürün adları ve açıklamaları görünür." },
      not: { type: "text", label: "Menü altı notu", placeholder: "Fiyatlarımıza KDV dahildir.", max: 200 },
      kategoriler: {
        type: "list",
        label: "Kategoriler",
        itemLabel: "Kategori",
        max: 20,
        summaryField: "ad",
        fields: {
          ad: { type: "text", label: "Kategori adı", placeholder: "Ana Yemekler", required: true, max: 40 },
          aciklama: { type: "text", label: "Kategori açıklaması", max: 160 },
          urunler: {
            type: "list",
            label: "Ürünler",
            itemLabel: "Ürün",
            max: 60,
            summaryField: "ad",
            fields: {
              ad: { type: "text", label: "Ürün adı", required: true, max: 60 },
              aciklama: { type: "textarea", label: "Açıklama / içindekiler", max: 300 },
              fiyat: { type: "number", label: "Fiyat (₺)", placeholder: "185", min: 0, max: 100000, step: 0.5 },
              fotograf: { type: "image", label: "Fotoğraf", aspect: "square" },
              etiketler: { type: "tags", label: "Etiketler", placeholder: "Vejetaryen", max: 4, hint: "Ör. Vejetaryen, Acılı, Glutensiz, Şefin önerisi" },
            },
          },
        },
      },
    },
  },
  {
    key: "galeri",
    title: "Galeri",
    description: "Yemekleriniz, salonunuz ve bahçeniz.",
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
    key: "rezervasyon",
    title: "Rezervasyon",
    description: "Rezervasyon çağrısı. Ziyaretçi butona basınca WhatsApp'tan hazır mesajla size yazar.",
    kind: "block",
    optional: true,
    fields: {
      baslik: { type: "text", label: "Başlık", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Açıklama", max: 300 },
    },
  },
  {
    key: "yorumlar",
    title: "Misafir yorumları",
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
          ad: { type: "text", label: "Misafir adı", placeholder: "Ayşe K.", required: true, max: 40 },
          yorum: { type: "textarea", label: "Yorum", required: true, max: 500 },
          puan: { type: "number", label: "Puan (1–5)", min: 1, max: 5, step: 1 },
        },
      },
      tumYorumlarLinki: { type: "url", label: "Tüm yorumlar linki", hint: "Google yorumlarınızın adresi." },
    },
  },
  {
    key: "sss",
    title: "Sık sorulan sorular",
    kind: "block",
    optional: true,
    navLabel: "S.S.S.",
    fields: {
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
    },
  },
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
