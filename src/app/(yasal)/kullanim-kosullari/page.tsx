import type { Metadata } from "next";
import { info, legalInfo } from "@/content/legal-info";
import { platformName } from "@/lib/config";
import { graceDays } from "@/lib/subscription";
import { LegalDoc } from "../legal-doc";

export const metadata: Metadata = { title: `Kullanım koşulları · ${platformName}` };

export default function TermsPage() {
  const company = info("companyName", "Firma unvanı");
  return (
    <LegalDoc title="Kullanım koşulları">
      <p>
        Bu koşullar, {company} (&quot;{platformName}&quot;) tarafından sunulan web sitesi hizmetinin kullanımına
        ilişkindir. Panele giriş yaparak bu koşulları kabul etmiş olursunuz.
      </p>

      <h2>1. Hizmet</h2>
      <p>
        {platformName}, işletmelere hazır şablonlar üzerinden web sitesi oluşturma, yayınlama ve barındırma hizmeti
        sunar. Siteler platformun alt alan adında yayınlanır; müşteri isterse kendi aldığı alan adını (domain) bağlayabilir.
        Alan adı müşteriye aittir ve platform tarafından satılmaz.
      </p>

      <h2>2. Hesap</h2>
      <p>
        Hesaplar davetle açılır. Hesap bilgilerinizin ve şifrenizin gizliliğinden siz sorumlusunuz. Site sahibi,
        sitesine eklediği editörlerin işlemlerinden de sorumludur.
      </p>

      <h2>3. İçerik</h2>
      <p>
        Sitenize eklediğiniz metin, fotoğraf, logo, müşteri yorumu ve diğer içeriklerin doğruluğundan ve bunları
        kullanma hakkına sahip olduğunuzdan siz sorumlusunuz. Hukuka aykırı, yanıltıcı, başkasının fikri haklarını
        ihlal eden içerikler yayınlanamaz; bu durumda içerik kaldırılabilir veya site askıya alınabilir. Sitenizde
        ziyaretçilerden kişisel veri topluyorsanız (ör. iletişim bilgisi) bu veriler için veri sorumlusu sizsiniz.
      </p>

      <h2>4. Abonelik ve ödeme</h2>
      <ul>
        <li>Hizmet yıllık abonelikle sunulur; bedel ve ödeme yöntemi ayrıca bildirilir veya sözleşmede belirtilir.</li>
        <li>Abonelik bitiş tarihinden 30, 7 ve 1 gün önce e-posta ile hatırlatma gönderilir.</li>
        <li>Bitiş tarihinden sonra {graceDays} gün boyunca site yayında kalır. Bu süre içinde yenilenmezse site geçici olarak ziyaretçilere kapatılır; içerikler silinmez.</li>
        <li>Askıya alınan site, ödeme yapıldığında hemen yeniden açılır. Askıya alınmasından itibaren {legalInfo.retentionAfterSuspensionDays} gün içinde yenilenmeyen sitelerin içerikleri ve fotoğrafları silinebilir.</li>
      </ul>

      <h2>5. Hizmetin sürekliliği</h2>
      <p>
        Sitelerin kesintisiz çalışması için makul özen gösterilir, veriler her gün yedeklenir. Bakım, güncelleme veya
        elde olmayan nedenlerle (altyapı sağlayıcısı arızaları, siber saldırılar vb.) yaşanabilecek kısa süreli
        kesintilerden doğan dolaylı zararlardan {platformName} sorumlu tutulamaz. Sorumluluk her durumda ilgili yıl için
        ödenen abonelik bedeliyle sınırlıdır.
      </p>

      <h2>6. Değişiklikler ve fesih</h2>
      <p>
        Bu koşullar güncellenebilir; önemli değişiklikler e-posta ile bildirilir. Müşteri aboneliğini dönem sonunda
        yenilemeyerek sona erdirebilir. Koşulların ağır ihlali halinde hizmet bildirimle sona erdirilebilir.
      </p>

      <h2>7. Uyuşmazlıklar</h2>
      <p>
        Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. Tüketici sıfatına sahip müşteriler için tüketici hakem
        heyetleri ve tüketici mahkemelerinin yetkisi saklıdır.
      </p>

      <h2>İletişim</h2>
      <p>
        {company} · {info("address", "Adres")} · {info("email", "E-posta")} · {info("phone", "Telefon")}
      </p>
    </LegalDoc>
  );
}
