import { GuideArticle, guideMetadata } from "../../_components/article";

const slug = "domain-nedir-nasil-alinir";

export const metadata = guideMetadata(slug);

export default function DomainGuide() {
  return (
    <GuideArticle slug={slug}>
      <p>
        Domain (alan adı), işletmenizin internetteki adresidir: <strong>firmaniz.com</strong> gibi. Kartvizitinize,
        tabelanıza, araç giydirmenize yazdığınız bu adres yıllarca değişmeden kalır. Bu yüzden seçerken birkaç noktaya
        dikkat etmek, ileride yaşanacak sorunların önüne geçer.
      </p>

      <h2>Domain satın alınmaz, yıllık kiralanır</h2>
      <p>
        Domain bir kayıt firmasından (Natro, İsimtescil, Turhost, GoDaddy gibi) yıllık olarak alınır. Süresi
        dolduğunda yenilenmezse boşa düşer ve başkası alabilir. Yıllarca kullandığınız adresi kaybetmemek için yenileme
        tarihini takip etmek gerekir.
      </p>

      <h2>İyi bir domain nasıl olur?</h2>
      <ul>
        <li>
          <strong>Kısa ve tabeladaki ada yakın:</strong> Müşteri adınızı biliyorsa adresinizi de tahmin edebilmeli.
        </li>
        <li>
          <strong>Türkçe karakter yok:</strong> ş, ğ, ı, ü, ö, ç içeren domain&apos;ler alınabilir ama paylaşırken ve
          e-postada sorun çıkarır. &quot;yildizsutesisati.com&quot; gibi Türkçe karaktersiz yazın.
        </li>
        <li>
          <strong>Telefonda söylenebilir:</strong> &quot;Tire var mı, harfle mi yazılıyor?&quot; diye sorulmamalı.
          Tire ve rakamı mümkünse kullanmayın.
        </li>
        <li>
          <strong>Semt veya meslek eklenebilir:</strong> Kısa ad doluysa &quot;kayaelektrik.com&quot; ya da
          &quot;kayakadikoy.com&quot; gibi bir ek işe yarar.
        </li>
      </ul>

      <h2>.com mu, .com.tr mi?</h2>
      <p>
        <strong>.com.tr</strong> Türkiye&apos;ye özel uzantıdır. Eylül 2022&apos;den beri belge istenmeden, .com kadar
        kolay alınabiliyor. Türkiye&apos;de güven verir ve kısa adlar .com&apos;a göre daha çok boştadır. Ülke uzantılı
        alan adları arama motorlarında o ülkeyle ilişkilendirilir; Türkiye&apos;deki müşteriye hitap eden bir işletme için
        bu bir avantajdır.
      </p>
      <p>
        <strong>.com</strong> en tanınan uzantıdır; insanlar adresin sonunu bilmediğinde çoğunlukla .com yazar.
      </p>
      <p>
        Bütçeniz izin veriyorsa ikisini birden alıp birini ana adres yapın, diğerini ona yönlendirin. Böylece hem yanlış
        yazanlar size ulaşır hem de adınızı başkası alamaz.
      </p>

      <h2>Domain kimin adına kayıtlı olmalı?</h2>
      <p>
        Domain mutlaka <strong>işletmenizin ya da sizin adınıza</strong>, doğru iletişim bilgileriyle kayıtlı olmalı.
        Bazı ajanslar domain&apos;i kendi adlarına kaydeder; ajansla yollarınız ayrıldığında adresinizi geri almak
        zorlaşır. Domain&apos;i size kim aldıysa, kayıt sahibi (registrant) bilgisinde kimin yazdığını sorun ve kayıt
        firmasının gönderdiği e-postaları saklayın.
      </p>

      <h2>Fiyata dikkat: ilk yıl ve yenileme</h2>
      <p>
        Kayıt firmaları ilk yıl için çoğu zaman indirimli kampanya yapar. Satın almadan önce ikinci yıldan itibaren
        ödeyeceğiniz yenileme ücretine de bakın.
      </p>

      <h2>Siteye bağlarken e-postanızı bozmayın</h2>
      <p>
        Domain&apos;inizde zaten bir e-posta adresi (info@firmaniz.com gibi) kullanıyorsanız, siteyi bağlarken{" "}
        <strong>nameserver (DNS sunucusu) adreslerini değiştirmeyin</strong> ve MX kayıtlarına dokunmayın. Siteyi
        bağlamak için domain firmanızın panelinde sadece birkaç A ve CNAME kaydı eklemek yeterlidir. Nameserver
        değiştirilirse e-postalarınız gelmemeye başlayabilir.
      </p>

      <h2>Siftah AI ile</h2>
      <p>
        Domain&apos;iniz yoksa sizin adınıza, firma bilgilerinizle alıp sitenize bağlarız; yenileme tarihini de biz
        takip ederiz. Domain&apos;iniz varsa sadece gerekli DNS kayıtlarını eklersiniz, mevcut e-postanız olduğu gibi
        çalışmaya devam eder. Siteyi bırakırsanız domain sizde kalır.
      </p>
    </GuideArticle>
  );
}
