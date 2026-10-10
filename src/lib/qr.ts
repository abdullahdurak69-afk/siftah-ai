import "server-only";
import QRCode from "qrcode";
// QR menü sitenin kendi domain'indeki menü sayfasına gider (firmam.com/menu). Domain bağlanmadan QR üretilmez;
// domain değişirse kodun yeniden basılması gerekir.
export function menuUrl(siteBaseUrl: string) {
  return `${siteBaseUrl}/menu`;
}

const options = { margin: 1, errorCorrectionLevel: "M" as const, color: { dark: "#000000", light: "#ffffff" } };

export function qrSvg(text: string) {
  return QRCode.toString(text, { ...options, type: "svg" });
}

export function qrPng(text: string, width = 1200) {
  return QRCode.toBuffer(text, { ...options, type: "png", width, margin: 2 });
}
