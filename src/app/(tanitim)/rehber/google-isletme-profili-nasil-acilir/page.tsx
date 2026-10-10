import { GuideArticle, guideMetadata } from "../../_components/article";

const slug = "google-isletme-profili-nasil-acilir";

export const metadata = guideMetadata(slug);

export default function GoogleBusinessProfileGuide() {
  return (
    <GuideArticle slug={slug}>
      <p>
        Birisi telefonundan &quot;yakınımdaki tesisatçı&quot; ya da &quot;Kadıköy kuaför&quot; diye aradığında, sonuçların
        en üstünde haritayla birlikte işletme kartları çıkar. Bu kartlar <strong>Google İşletme Profili</strong>{" "}
        (eski adıyla Google My Business) ile oluşturulur. Profil ücretsizdir ve küçük bir işletmenin internette
        bulunması için atabileceği en önemli adımdır.
      </p>

      <h2>Profil ne işe yarar?</h2>
      <ul>
        <li>İşletmeniz Google Haritalar&apos;da ve aramalarda adresi, telefonu ve çalışma saatleriyle görünür.</li>
        <li>Müşteri tek dokunuşla sizi arar, yol tarifi alır veya web sitenize gider.</li>
        <li>Müşteriler yorum yazabilir; siz de yorumlara cevap verebilirsiniz.</li>
        <li>Fotoğraflarınızı, hizmetlerinizi ve (restoranlarda) menünüzü gösterebilirsiniz.</li>
      </ul>

      <h2>Başlamadan önce hazırlayın</h2>
      <ul>
        <li>
          <strong>İşletme adı:</strong> Tabelanızda ve faturanızda yazan ad. Adın yanına &quot;en iyi&quot;,
          &quot;ucuz&quot;, semt adı gibi ifadeler eklemeyin; Google kuralları bunu yasaklar ve profil askıya alınabilir.
        </li>
        <li>
          <strong>Kategori:</strong> İşinizi en iyi anlatan ana kategori (ör. Tesisatçı, Restoran, Kuaför, Diş kliniği).
        </li>
        <li>
          <strong>Adres veya hizmet bölgesi:</strong> Müşteri size geliyorsa dükkânınızın adresi; siz müşteriye
          gidiyorsanız (usta, servis) gittiğiniz ilçeler.
        </li>
        <li>Telefon numarası, web sitenizin adresi ve çalışma saatleriniz.</li>
        <li>Birkaç güncel fotoğraf: dış cephe ve tabela, iç mekân, yaptığınız işler.</li>
      </ul>

      <h2>Adım adım profil açma</h2>
      <ol>
        <li>
          Bir Google hesabıyla <a href="https://www.google.com/business/">google.com/business</a> adresine girin ve
          profil oluşturmayı başlatın. Google Haritalar uygulamasında işletme ekleme seçeneği de aynı adımlara çıkar.
        </li>
        <li>
          İşletme adını yazın. Listede işletmeniz zaten görünüyorsa (biri daha önce eklemiş olabilir) yeni profil açmak
          yerine onu seçip sahiplenin.
        </li>
        <li>Ana kategoriyi seçin. Daha sonra ek kategoriler de ekleyebilirsiniz.</li>
        <li>
          Müşterilerin gelebileceği bir adresiniz varsa adresi girin ve haritadaki işaretin doğru yerde olduğunu
          kontrol edin. Sadece müşteriye gidiyorsanız adresi gizleyip hizmet verdiğiniz bölgeleri seçin.
        </li>
        <li>Telefon numaranızı ve web sitenizin adresini girin.</li>
        <li>
          <strong>Doğrulama:</strong> Google, işletmenin gerçekten size ait olduğunu doğrular. Hangi yöntemin
          sunulacağını Google belirler; örneğin işletmenizi, tabelanızı ve işe ait bir belgeyi gösteren kısa bir video
          kaydı, telefon, e-posta veya posta yoluyla gelen kod olabilir. Doğrulamanın onaylanması birkaç gün sürebilir.
        </li>
        <li>
          Doğrulama sonrası profili tamamlayın: çalışma saatleri, fotoğraflar, hizmetler (restoranlarda menü bağlantısı)
          ve işletmenizi anlatan kısa bir açıklama.
        </li>
      </ol>

      <h2>Profil açıldıktan sonra</h2>
      <ul>
        <li>
          <strong>Yorum isteyin:</strong> Memnun müşterilerinizden yorum yazmalarını rica edin ve yorumlara kibarca cevap
          verin. Yorum karşılığında indirim veya hediye vermek ve sahte yorum yazdırmak Google kurallarına aykırıdır.
        </li>
        <li>
          <strong>Bilgileri güncel tutun:</strong> Bayram ve tatil günlerinde çalışma saatlerini güncelleyin; telefon
          değişirse hemen düzeltin.
        </li>
        <li>
          <strong>Her yerde aynı bilgi:</strong> İşletme adı, adres ve telefon; web sitenizde, profilinizde ve sosyal
          medyada birebir aynı yazılsın. Arama motorları ve yapay zekâ asistanları bu tutarlılığa bakar.
        </li>
        <li>Ara ara yeni fotoğraf ekleyin; güncel görünen profiller daha çok ilgi görür.</li>
      </ul>

      <h2>Web siteniz ve profiliniz birlikte</h2>
      <p>
        Profil, müşterinin sizi bulmasını; web siteniz ise sizi seçmesini sağlar. Profilde web sitenizin adresini
        mutlaka girin. Siftah AI ile açılan sitelerde Google puanınızı ve yorum sayınızı sitenize ekleyebilir, harita
        bağlantınızı iletişim bölümüne koyabilirsiniz; işletme bilgileriniz de arama motorlarının anladığı yapıda
        (schema.org) siteye eklenir.
      </p>
    </GuideArticle>
  );
}
