import type { Metadata } from "next";
import { info } from "@/content/legal-info";
import { platformName } from "@/lib/config";
import { legalUrl } from "@/lib/legal-links";
import { LegalDoc } from "../legal-doc";

export const metadata: Metadata = { title: `Mesafeli satış sözleşmesi · ${platformName}` };

// Ödeme şu an havale/elden alındığı için sözleşme müşteriye ayrıca (e-posta/çıktı) iletilir.
// Online ödeme eklendiğinde (iyzico) bu metin ödeme adımında onaya sunulacak.
export default function DistanceContractPage() {
  return (
    <LegalDoc title="Mesafeli hizmet sözleşmesi">
      <h2>1. Taraflar</h2>
      <p>
        <strong>Hizmet sağlayıcı:</strong> {info("companyName", "Firma unvanı")}, {info("address", "Adres")}, Vergi
        dairesi / no: {info("taxOffice", "Vergi dairesi")} / {info("taxNumber", "VKN")}, MERSİS: {info("mersis", "MERSİS no")},
        E-posta: {info("email", "E-posta")}, Telefon: {info("phone", "Telefon")}.
      </p>
      <p>
        <strong>Alıcı:</strong> Siparişte veya faturada bilgileri yer alan gerçek ya da tüzel kişi.
      </p>

      <h2>2. Konu</h2>
      <p>
        Bu sözleşme, alıcının {platformName} üzerinden satın aldığı yıllık web sitesi hizmetinin (site oluşturma
        paneli, barındırma, alt alan adında yayın, alan adı bağlama, SSL sertifikası, günlük yedekleme ve ziyaret
        istatistiği) sunulmasına ilişkin tarafların hak ve yükümlülüklerini 6502 sayılı Tüketicinin Korunması Hakkında
        Kanun ve Mesafeli Sözleşmeler Yönetmeliği çerçevesinde düzenler.
      </p>

      <h2>3. Hizmet bedeli ve ödeme</h2>
      <p>
        Yıllık hizmet bedeli, vergiler dahil olarak siparişte veya faturada gösterilen tutardır. Ödeme banka havalesi /
        EFT ile ya da hizmet sağlayıcının sunduğu diğer yöntemlerle yapılır. Hizmet süresi ödemenin alındığı tarihten
        (yenilemelerde önceki dönemin bitişinden) itibaren bir yıldır.
      </p>

      <h2>4. İfa</h2>
      <p>
        Hizmet sağlayıcı, ödemenin alınmasından sonra en geç 3 iş günü içinde alıcının panel erişimini açar. Sitenin
        içeriğini hazırlamak ve yayınlamak alıcının (veya ayrıca anlaşılmışsa hizmet sağlayıcının) sorumluluğundadır.
      </p>

      <h2>5. Cayma hakkı</h2>
      <p>
        Alıcı tüketici ise, sözleşmenin kurulmasından itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma
        hakkına sahiptir. Cayma bildirimi {info("email", "E-posta")} adresine yazılı olarak yapılır; bedel 14 gün
        içinde iade edilir. Ancak alıcının onayıyla cayma süresi dolmadan ifasına başlanan hizmetlerde (panel erişiminin
        açılması ve sitenin yayına alınması) Mesafeli Sözleşmeler Yönetmeliği m. 15 uyarınca cayma hakkı
        kullanılamaz. Alıcı tacir ise cayma hakkı yoktur.
      </p>

      <h2>6. Diğer hükümler</h2>
      <p>
        Hizmetin kullanımına ilişkin ayrıntılar <a href={legalUrl("kullanim-kosullari")} className="underline">kullanım
        koşullarında</a>, kişisel verilerin işlenmesi <a href={legalUrl("kvkk")} className="underline">KVKK aydınlatma
        metninde</a> yer alır ve bu sözleşmenin ekidir. Uyuşmazlıklarda Ticaret Bakanlığınca ilan edilen parasal
        sınırlar dahilinde alıcının yerleşim yerindeki tüketici hakem heyetleri, aşan durumlarda tüketici mahkemeleri
        yetkilidir.
      </p>
      <p>Alıcı, sözleşme kurulmadan önce bu ön bilgileri okuduğunu ve elektronik ortamda teyit ettiğini kabul eder.</p>
    </LegalDoc>
  );
}
