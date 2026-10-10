import Link from "next/link";
import { GuideArticle, guideMetadata } from "../../_components/article";

const slug = "restoran-google-ve-yapay-zekada-one-cikma";

export const metadata = guideMetadata(slug);

export default function RestaurantVisibilityGuide() {
  return (
    <GuideArticle slug={slug}>
      <p>
        Misafirlerin çoğu bir restorana gitmeden önce telefonundan bakar: &quot;yakınımdaki lokanta&quot;, &quot;Moda&apos;da
        kahvaltı&quot;, &quot;açık pideci&quot;. Artık aynı soruları ChatGPT, Gemini veya Perplexity gibi yapay zekâ
        asistanlarına da soruyorlar. Bu yazıda, restoranınızın hem Google&apos;da hem de bu asistanların cevaplarında
        görünme ihtimalini artıran pratik adımları topladık.
      </p>
      <p>
        Önce dürüst bir not: Google&apos;da veya bir asistanın cevabında belirli bir yeri kimse garanti edemez. Ama
        aşağıdaki adımlar, sizi bulmak isteyen birinin sizi bulmasını kolaylaştırır.
      </p>

      <h2>1. Google İşletme Profilinizi eksiksiz doldurun</h2>
      <p>
        Yerel aramalarda en büyük etken budur. Doğru kategori (Restoran, Kafe, Kebapçı...), adres, telefon, çalışma
        saatleri, menü bağlantısı ve güncel fotoğraflar eksiksiz olsun. Adım adım anlatım için{" "}
        <Link href="/rehber/google-isletme-profili-nasil-acilir">Google İşletme Profili rehberimize</Link> bakın.
      </p>

      <h2>2. Menünüz fotoğraf veya PDF değil, metin olsun</h2>
      <p>
        Menüyü fotoğraf ya da PDF olarak paylaşmak kolaydır ama arama motorları ve yapay zekâ asistanları metni çok daha
        iyi okur. &quot;Kuzu tandır&quot;, &quot;glutensiz pizza&quot;, &quot;vegan kahvaltı&quot; gibi aramalarda çıkmak
        istiyorsanız bu yemeklerin adı web sitenizde yazı olarak geçmeli. Masadaki QR menü de bu metin menüyü açarsa
        hem misafir için hızlı açılır hem de tek yerden güncellenir.
      </p>

      <h2>3. Adınız, adresiniz ve telefonunuz her yerde aynı olsun</h2>
      <p>
        Web siteniz, Google profiliniz, Instagram hesabınız ve yemek siteleri aynı işletme adını, adresi ve telefonu
        göstermeli. Farklı yazımlar (bir yerde &quot;Cad.&quot;, bir yerde eski telefon) hem arama motorlarının hem de
        asistanların kafasını karıştırır.
      </p>

      <h2>4. Misafirin sorabileceği soruları sitede cevaplayın</h2>
      <p>
        Asistanlar &quot;çocuklu gidilir mi&quot;, &quot;rezervasyon gerekiyor mu&quot;, &quot;otopark var mı&quot;
        gibi sorulara cevap ararken web&apos;deki metinlere bakar. Sitenizde kısa bir &quot;Sık sorulan sorular&quot;
        bölümü ve neler sunduğunuzu açıkça anlatan bir &quot;Hakkımızda&quot; yazısı bulunsun: kaç kişilik
        olduğunuz, paket servis, vejetaryen seçenekler, alkol servisi, bahçe gibi.
      </p>

      <h2>5. Gerçek yorumlar toplayın ve cevap verin</h2>
      <p>
        Memnun misafirlerden Google&apos;da yorum yazmalarını rica edin; olumlu olumsuz her yoruma kibarca cevap verin.
        Sahte yorum yazdırmak ya da yorum karşılığında indirim vermek Google kurallarına aykırıdır ve profilinizin
        kısıtlanmasına yol açabilir.
      </p>

      <h2>6. Çalışma saatlerini güncel tutun</h2>
      <p>
        Bayramda kapalı olduğunuz bir gün profilde &quot;açık&quot; görünmek, kapıdan dönen misafir ve kötü yorum
        demektir. Özel günlerin saatlerini önceden girin.
      </p>

      <h2>7. Siteniz botlara açık ve hızlı olsun</h2>
      <p>
        Bazı web sitesi altyapıları içeriği tarayıcıda sonradan yükler ya da yapay zekâ botlarını engeller. Bu durumda
        asistanlar sitenizi okuyamaz. Sitenin içeriği sunucuda hazır gelmeli, telefonda hızlı açılmalı ve botlara
        kapalı olmamalı. Siftah AI ile açılan restoran sitelerinde menü metin olarak yayınlanır, işletme ve menü
        bilgileri arama motorlarının anladığı yapıda (schema.org) eklenir ve yapay zekâ botları siteyi okuyabilir.
      </p>
    </GuideArticle>
  );
}
