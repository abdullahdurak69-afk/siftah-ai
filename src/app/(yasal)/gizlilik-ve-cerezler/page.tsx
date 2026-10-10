import type { Metadata } from "next";
import { info } from "@/content/legal-info";
import { platformName } from "@/lib/config";
import { LegalDoc } from "../legal-doc";

export const metadata: Metadata = { title: `Gizlilik ve çerez politikası · ${platformName}` };

export default function PrivacyPage() {
  return (
    <LegalDoc title="Gizlilik ve çerez politikası">
      <p>
        {platformName} üç bölümden oluşur: bu tanıtım sitesi, müşterilerimizin kullandığı yönetim paneli ve
        müşterilerimizin platform üzerinde yayınlanan web siteleri. Aşağıda her birinde hangi çerezlerin ve verilerin
        kullanıldığını açıklıyoruz.
      </p>

      <h2>Yönetim paneli</h2>
      <p>
        Panelde yalnızca oturumunuzu açık tutmak için zorunlu bir oturum çerezi kullanılır. Bu çerez giriş yapmanız
        için gereklidir, reklam veya takip amacıyla kullanılmaz ve çıkış yaptığınızda ya da süresi dolduğunda geçersiz
        olur. Zorunlu çerezler için ayrıca onay alınmaz.
      </p>

      <h2>Müşteri web siteleri</h2>
      <p>
        Platformda yayınlanan web sitelerinde <strong>hiç çerez kullanılmaz</strong> ve ziyaretçiler siteler arasında
        takip edilmez. Site sahibine ziyaret istatistiği sunmak için yalnızca şunlar sayılır:
      </p>
      <ul>
        <li>Sayfanın görüntülenmesi ve günlük tekil ziyaretçi sayısı,</li>
        <li>Sitedeki telefon ve WhatsApp butonlarına tıklanma sayısı.</li>
      </ul>
      <p>
        Aynı ziyaretçinin gün içinde iki kez sayılmaması için IP adresi ve tarayıcı bilgisi, her gün değişen gizli bir
        anahtarla geri döndürülemez şekilde özetlenir. IP adresinin kendisi hiçbir yerde saklanmaz; özetler ertesi gün
        silinir. Site sahibi yalnızca toplam sayıları görür.
      </p>
      <p>
        Müşteri sitelerinde gösterilen haritalar (Google Haritalar gibi) ilgili sağlayıcının kendi çerezlerini
        kullanabilir; bu durumda o sağlayıcının gizlilik politikası geçerlidir.
      </p>

      <h2>Hata kayıtları</h2>
      <p>
        Sunucuda bir hata oluştuğunda, sorunu çözebilmemiz için hatanın türü, oluştuğu adres ve zamanı kaydedilir.
        Bu kayıtlara çerez, IP adresi veya form içeriği eklenmez.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için: {info("email", "E-posta")}. Kişisel verilerinizle ilgili haklarınız için KVKK aydınlatma
        metnine bakabilirsiniz.
      </p>
    </LegalDoc>
  );
}
