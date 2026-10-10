import "server-only";
import QRCode from "qrcode";
import { siteUrl } from "@/lib/config";

// QR menü her zaman sitenin platform adresine gider (firma.platformadi.com/menu). Müşteri sonradan kendi
// domain'ini bağlasa da basılı QR kodlar çalışmaya devam eder: bu adres asıl domain'e yönlendirir.
export function menuUrl(subdomain: string) {
  return `${siteUrl(subdomain)}/menu`;
}

const options = { margin: 1, errorCorrectionLevel: "M" as const, color: { dark: "#000000", light: "#ffffff" } };

export function qrSvg(text: string) {
  return QRCode.toString(text, { ...options, type: "svg" });
}

export function qrPng(text: string, width = 1200) {
  return QRCode.toBuffer(text, { ...options, type: "png", width, margin: 2 });
}
