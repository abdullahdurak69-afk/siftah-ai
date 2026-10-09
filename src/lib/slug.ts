const turkishMap: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  i̇: "i",
  ö: "o",
  ş: "s",
  ü: "u",
};

// "Kaya Elektronik & Uydu" -> "kaya-elektronik-uydu"
export function toSubdomain(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]|i̇/g, (ch) => turkishMap[ch] ?? ch)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32)
    .replace(/-+$/g, "");
}

export const subdomainPattern = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;
