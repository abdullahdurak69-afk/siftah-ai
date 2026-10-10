import type { Metadata } from "next";
import { info, legalInfo } from "@/content/legal-info";
import { legalUrl } from "@/lib/legal-links";
import { panelUrl, platformName } from "@/lib/config";
import { LegalDoc } from "../legal-doc";

export const metadata: Metadata = { title: `KVKK aydınlatma metni · ${platformName}` };

export default function KvkkPage() {
  const company = info("companyName", "Firma unvanı");
  return (
    <LegalDoc title="Kişisel verilerin korunması aydınlatma metni">
      <p>
        Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) 10. maddesi uyarınca, {platformName}{" "}
        hizmetini kullanan müşterilerimizi, panel kullanıcılarını ve bizimle iletişime geçen kişileri bilgilendirmek
        amacıyla hazırlanmıştır.
      </p>

      <h2>Veri sorumlusu</h2>
      <p>
        {company}, {info("address", "Adres")}. E-posta: {info("email", "E-posta")}
        {legalInfo.kep && `, KEP: ${legalInfo.kep}`}.
      </p>

      <h2>İşlenen kişisel veriler</h2>
      <ul>
        <li><strong>Kimlik ve iletişim:</strong> ad soyad, e-posta adresi, telefon numarası, fatura bilgileri.</li>
        <li><strong>Müşteri işlem:</strong> abonelik dönemleri, ödeme kayıtları (tutar ve tarih; kart bilgisi tutulmaz), destek yazışmaları.</li>
        <li><strong>İşlem güvenliği:</strong> panel oturum kayıtları, IP adresi, tarayıcı bilgisi, şifrenin geri döndürülemez özeti (şifrenin kendisi saklanmaz).</li>
        <li><strong>Site içeriği:</strong> panelde web sitenize eklediğiniz metin ve fotoğraflar. Bu içerikte üçüncü kişilere ait kişisel veri yer alıyorsa, o veriler için veri sorumlusu sitenin sahibi olan müşterimizdir; biz yalnızca barındırma hizmeti veririz.</li>
      </ul>

      <h2>İşleme amaçları ve hukuki sebepler</h2>
      <ul>
        <li>Web sitesi hizmetinin sunulması, hesabın açılması ve yönetilmesi: sözleşmenin kurulması ve ifası (KVKK m. 5/2-c).</li>
        <li>Abonelik takibi, faturalama, yenileme hatırlatmaları: sözleşmenin ifası ve hukuki yükümlülük (m. 5/2-c, 5/2-ç).</li>
        <li>Hesap ve sistem güvenliği, hataların tespiti, kötüye kullanımın önlenmesi: meşru menfaat (m. 5/2-f).</li>
        <li>Yasal saklama yükümlülükleri ve resmi makam talepleri: hukuki yükümlülük (m. 5/2-ç).</li>
      </ul>

      <h2>Toplama yöntemi</h2>
      <p>
        Veriler, panel üzerinden doldurduğunuz formlar, e-posta ve telefon görüşmeleri ile hizmet kullanımı sırasında
        otomatik olarak (oturum ve güvenlik kayıtları) elektronik ortamda toplanır.
      </p>

      <h2>Aktarım</h2>
      <p>
        Kişisel verileriniz yalnızca hizmetin sunulması için gerekli olduğu ölçüde şu taraflara aktarılır: sunucu ve
        barındırma hizmeti sağlayıcısı ({info("hostingProvider", "Barındırma sağlayıcısı ve konumu")}), e-posta
        gönderim hizmeti sağlayıcısı, yedekleme depolama sağlayıcısı, muhasebe ve hukuk danışmanlarımız ile kanunen
        yetkili kamu kurumları. Yurt dışında bulunan bir hizmet sağlayıcısına aktarım gerekirse KVKK 9. maddesindeki
        şartlara (standart sözleşme ve Kurul&apos;a bildirim dahil) uyulur.
      </p>

      <h2>Müşteri sitelerinin ziyaretçileri</h2>
      <p>
        Platformda yayınlanan müşteri sitelerinde çerez kullanılmaz. Ziyaret ve tıklama sayıları, IP adresi
        saklanmadan, günlük değişen bir anahtarla anonimleştirilerek sayılır; ayrıntılar{" "}
        <a href={legalUrl("gizlilik-ve-cerezler")} className="underline">gizlilik ve çerez politikasında</a>.
      </p>

      <h2>Saklama süresi</h2>
      <p>
        Hesap ve site verileri abonelik süresince saklanır. Abonelik sona erip site askıya alındıktan sonra, yeniden
        açılabilmesi için belirli bir süre daha tutulur ve ardından silinir (süre{" "}
        <a href={legalUrl("kullanim-kosullari")} className="underline">kullanım koşullarında</a>). Fatura ve ödeme
        kayıtları vergi mevzuatının öngördüğü süre boyunca saklanır.
      </p>

      <h2>Haklarınız</h2>
      <p>KVKK 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, şartları oluştuğunda silinmesini veya yok edilmesini ve bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme, otomatik sistemlerle analiz sonucu aleyhinize bir sonuca itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız halinde giderilmesini talep etme haklarına sahipsiniz.</p>
      <p>
        Başvurularınızı {info("email", "E-posta")} adresine kayıtlı e-posta adresinizden veya {info("address", "Adres")}{" "}
        adresine yazılı olarak iletebilirsiniz. Başvurular en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.
      </p>
      <p className="text-sm text-slate-500">
        Panel: <a href={panelUrl} className="underline">{panelUrl.replace(/^https?:\/\//, "")}</a>
      </p>
    </LegalDoc>
  );
}
