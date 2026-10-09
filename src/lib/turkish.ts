const vowels = "aıoueiöü";
const backVowels = "aıou";
const hardConsonants = "fstkçşhp";

// Bulunma eki: Sancaktepe'de, Üsküdar'da, Beşiktaş'ta, Esenyurt'ta
export function locative(word: string) {
  const lower = word.trim().toLocaleLowerCase("tr");
  const lastVowel = [...lower].reverse().find((ch) => vowels.includes(ch)) ?? "e";
  const lastChar = lower.at(-1) ?? "";
  const consonant = hardConsonants.includes(lastChar) ? "t" : "d";
  const vowel = backVowels.includes(lastVowel) ? "a" : "e";
  return `${word.trim()}'${consonant}${vowel}`;
}

// 0532 123 45 67 -> tel:+905321234567
export function telHref(phone: string) {
  return `tel:+${internationalDigits(phone)}`;
}

// 0532 123 45 67 -> https://wa.me/905321234567
export function whatsappHref(phone: string, text?: string) {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${internationalDigits(phone)}${query}`;
}

function internationalDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `9${digits}`;
  return `90${digits}`;
}
