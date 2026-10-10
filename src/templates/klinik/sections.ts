import type { SectionDef } from "../engine/types";
import { faqFields } from "../kuafor/sections";
import { hoursField } from "../restoran/sections";

// Klinik şablonu (diş, veteriner, fizyoterapi, diyetisyen, psikolog). Bilgilendirme odaklıdır:
// sağlık hizmetlerinde reklam kuralları nedeniyle hasta yorumu, önce/sonra fotoğrafı, fiyat ve
// Google puanı bölümleri bilerek yoktur.

export const healthAdNotice =
  "Sağlık hizmetlerinde reklam kuralları gereği hasta yorumu, önce/sonra fotoğrafı, fiyat, indirim ve \"en iyi\", \"garantili\" gibi iddialar eklemeyin.";

export const klinikSections: SectionDef[] = [
  {
    key: "isletme",
    title: "Klinik bilgileri",
    description: "Telefon, adres ve çalışma saatleri. Randevu butonları bu numaraları kullanır.",
    kind: "settings",
    optional: false,
    fields: {
      logo: { type: "image", label: "Logo", aspect: "logo", hint: "İsteğe bağlı. Yoksa klinik adı yazı olarak gösterilir." },
      cep: { type: "phone", label: "Randevu telefonu", placeholder: "0532 123 45 67", required: true },
      whatsapp: { type: "phone", label: "WhatsApp numarası", placeholder: "0532 123 45 67", hint: "Boş bırakılırsa randevu telefonu kullanılır." },
      sabit: { type: "phone", label: "Sabit telefon", placeholder: "0216 123 45 67" },
      adres: { type: "textarea", label: "Açık adres", required: true, max: 300 },
      ilce: { type: "text", label: "İlçe", placeholder: "Ataşehir", required: true, max: 40 },
      il: { type: "text", label: "İl", placeholder: "İstanbul", required: true, max: 40 },
      saatler: hoursField,
      acilNotu: { type: "text", label: "Acil durum notu", placeholder: "Acil durumlarda 7/24 arayabilirsiniz.", max: 120, hint: "Doluysa sitenin üstünde ince bir şeritte gösterilir." },
      haritaLinki: { type: "url", label: "Google Haritalar linki" },
      instagram: { type: "url", label: "Instagram adresi", placeholder: "https://instagram.com/..." },
    },
  },
  {
    key: "hero",
    title: "Giriş (en üst bölüm)",
    description: `Ziyaretçinin ilk gördüğü alan. ${healthAdNotice}`,
    kind: "block",
    optional: false,
    fields: {
      ustBaslik: { type: "text", label: "Üst satır", placeholder: "Ataşehir · Diş Kliniği", max: 60 },
      baslik: { type: "text", label: "Başlık", required: true, max: 80 },
      aciklama: { type: "textarea", label: "Kısa tanıtım", required: true, max: 400 },
      gorsel: { type: "image", label: "Fotoğraf", aspect: "wide", hint: "Kliniğinizin bekleme salonu veya tedavi odası. Hasta fotoğrafı kullanmayın." },
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
      metin: { type: "textarea", label: "Metin", required: true, max: 1500 },
      gorsel: { type: "image", label: "Fotoğraf", aspect: "square" },
    },
  },
  {
    key: "hizmetler",
    title: "Tedavi ve hizmetler",
    description: `Uyguladığınız tedaviler ve kısa, bilgilendirici açıklamaları. ${healthAdNotice}`,
    kind: "block",
    optional: false,
    navLabel: "Hizmetler",
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Bölüm açıklaması", max: 300 },
      liste: {
        type: "list",
        label: "Hizmetler",
        itemLabel: "Hizmet",
        max: 16,
        summaryField: "baslik",
        fields: {
          ikon: { type: "icon", label: "İkon", set: "klinik" },
          baslik: { type: "text", label: "Hizmet adı", required: true, max: 60 },
          aciklama: { type: "textarea", label: "Açıklama", required: true, max: 400 },
        },
      },
    },
  },
  {
    key: "hekimler",
    title: "Hekimlerimiz / Uzmanlarımız",
    description: "Ekibinizdeki hekim ve uzmanlar; unvan ve uzmanlık alanlarıyla.",
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
        max: 16,
        summaryField: "ad",
        fields: {
          unvan: { type: "text", label: "Unvan", placeholder: "Uzm. Dt.", max: 30 },
          ad: { type: "text", label: "Ad soyad", required: true, max: 60 },
          uzmanlik: { type: "text", label: "Uzmanlık alanı", placeholder: "Ortodonti", max: 80 },
          fotograf: { type: "image", label: "Fotoğraf", aspect: "square" },
          ozgecmis: { type: "textarea", label: "Eğitim ve deneyim", max: 600 },
        },
      },
    },
  },
  {
    key: "galeri",
    title: "Kliniğimiz",
    description: "Kliniğinizin ortamından fotoğraflar. Hasta fotoğrafı ve tedavi öncesi/sonrası görseller paylaşmayın.",
    kind: "block",
    optional: true,
    navLabel: "Kliniğimiz",
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Bölüm açıklaması", max: 300 },
      fotograflar: { type: "images", label: "Fotoğraflar", max: 16 },
    },
  },
  {
    key: "randevu",
    title: "Randevu",
    description: "Randevu çağrısı: telefon ve WhatsApp butonları.",
    kind: "block",
    optional: true,
    fields: {
      baslik: { type: "text", label: "Başlık", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Açıklama", max: 300 },
    },
  },
  { key: "sss", title: "Sık sorulan sorular", kind: "block", optional: true, navLabel: "S.S.S.", fields: faqFields },
  {
    key: "iletisim",
    title: "İletişim",
    description: "Adres, telefon, saatler ve harita Klinik bilgilerinden gelir.",
    kind: "block",
    optional: false,
    navLabel: "İletişim",
    fields: {
      baslik: { type: "text", label: "Bölüm başlığı", required: true, max: 60 },
      aciklama: { type: "textarea", label: "Bölüm açıklaması", max: 300 },
    },
  },
];
