import { Cormorant_Garamond, Fraunces } from "next/font/google";

// Şablonların başlık yazı tipleri. preload kapalı: tüm şablonlar aynı sayfa modülünden çizildiği için
// açık olsaydı her site, kullanmadığı fontları da önceden indirirdi.
export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});
