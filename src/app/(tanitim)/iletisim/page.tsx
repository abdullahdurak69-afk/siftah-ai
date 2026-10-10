import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { supportContact } from "@/lib/config";
import { telHref, whatsappHref } from "@/lib/turkish";
import { LeadForm } from "../_components/lead-form";
import { PageHeader, Section } from "../_components/ui";

export const metadata: Metadata = {
  title: "İletişim ve başvuru",
  description: "Web siteniz için başvurun: formu doldurun, sizi arayıp işletmenizi dinleyelim ve sitenizi hazırlayalım.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  const { phone, email } = supportContact;
  return (
    <>
      <PageHeader breadcrumbs={[{ name: "İletişim", path: "/iletisim" }]} title="Sitenizi birlikte açalım">
        <p>Formu doldurun, sizi arayalım. İsterseniz doğrudan arayabilir veya WhatsApp&apos;tan yazabilirsiniz.</p>
      </PageHeader>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <LeadForm source="/iletisim" />
          {(phone || email) && (
            <ul className="flex flex-col gap-3">
              {phone && (
                <>
                  <ContactLink href={telHref(phone)} Icon={Phone} label="Telefon" value={phone} />
                  <ContactLink href={whatsappHref(phone, "Merhaba, web sitesi hakkında bilgi almak istiyorum.")} Icon={MessageCircle} label="WhatsApp" value="Mesaj gönderin" />
                </>
              )}
              {email && <ContactLink href={`mailto:${email}`} Icon={Mail} label="E-posta" value={email} />}
            </ul>
          )}
        </div>
      </Section>
    </>
  );
}

function ContactLink({ href, Icon, label, value }: { href: string; Icon: typeof Phone; label: string; value: string }) {
  return (
    <li>
      <a href={href} className="flex items-center gap-4 rounded-2xl border border-stone-200 p-5 hover:border-emerald-300 hover:bg-emerald-50">
        <Icon className="size-6 text-emerald-700" aria-hidden />
        <span>
          <span className="block text-sm text-slate-500">{label}</span>
          <span className="font-semibold">{value}</span>
        </span>
      </a>
    </li>
  );
}
