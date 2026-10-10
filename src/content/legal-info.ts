// Yasal metinlerde (src/app/(yasal)/) kullanılan firma bilgileri. Şirket kurulunca doldurun;
// boş alanlar metinde [köşeli parantez] içinde yer tutucu olarak görünür.
// Metinler taslaktır: yayına almadan önce bir avukata kontrol ettirin.

export const legalInfo = {
  companyName: "", // Ticaret unvanı veya şahıs şirketinde ad soyad
  address: "",
  taxOffice: "", // Vergi dairesi
  taxNumber: "", // VKN / TCKN
  mersis: "",
  email: "",
  phone: "",
  kep: "", // KEP adresi (varsa)
  // Barındırma (sunucu) sağlayıcısı ve yeri; KVKK aktarım bölümünde geçer
  hostingProvider: "",
  // Abonelik bitip site askıya alındıktan sonra verilerin saklanma süresi
  retentionAfterSuspensionDays: 90,
  updatedAt: "2026-10-10",
};

export function info(key: Exclude<keyof typeof legalInfo, "retentionAfterSuspensionDays">, placeholder: string) {
  return legalInfo[key] || `[${placeholder}]`;
}
