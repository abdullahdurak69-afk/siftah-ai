import "server-only";
import { panelUrl, platformName } from "@/lib/config";
import { renderEmail, sendEmail } from "@/lib/email";

export function setPasswordUrl(token: string) {
  return `${panelUrl}/sifre-belirle?token=${encodeURIComponent(token)}`;
}

export async function passwordResetEmail(to: string, token: string) {
  const { html, text } = renderEmail("Şifrenizi yenileyin", [
    { paragraph: `${platformName} paneli için şifre yenileme isteği aldık. Yeni şifrenizi aşağıdaki bağlantıdan belirleyebilirsiniz.` },
    { button: { label: "Yeni şifre belirle", url: setPasswordUrl(token) } },
    { note: "Bağlantı 1 saat geçerlidir. Bu isteği siz yapmadıysanız bu e-postayı yok sayabilirsiniz; şifreniz değişmez." },
  ]);
  await sendEmail({ to, subject: "Şifre yenileme", html, text, kind: "password-reset" });
}

// Yeni kullanıcı: hesabı açıldı, şifresini belirlemesi gerekiyor
export async function inviteEmail(opts: { to: string; siteName: string; siteId: string; inviter: string; token: string; days: number }) {
  const { html, text } = renderEmail(`${opts.siteName} sitesini yönetmeye davet edildiniz`, [
    {
      paragraph: `${opts.inviter}, sizi ${platformName} üzerindeki "${opts.siteName}" web sitesini yönetmeniz için davet etti. Şifrenizi belirleyerek panele girebilir, sitenizin içeriğini ve fotoğraflarını düzenleyebilirsiniz.`,
    },
    { button: { label: "Şifremi belirle", url: setPasswordUrl(opts.token) } },
    { note: `Bağlantı ${opts.days} gün geçerlidir. Süresi dolarsa giriş sayfasındaki "Şifremi unuttum" ile yeni bağlantı alabilirsiniz.` },
  ]);
  await sendEmail({ to: opts.to, subject: `${opts.siteName} · Panel daveti`, html, text, kind: "invite", siteId: opts.siteId });
}

// Hesabı zaten olan kullanıcı başka bir siteye eklendi
export async function addedToSiteEmail(opts: { to: string; siteName: string; siteId: string; inviter: string }) {
  const { html, text } = renderEmail(`${opts.siteName} sitesine eklendiniz`, [
    { paragraph: `${opts.inviter}, sizi "${opts.siteName}" web sitesinin yöneticileri arasına ekledi. Mevcut hesabınızla panele girerek siteyi görebilirsiniz.` },
    { button: { label: "Panele git", url: `${panelUrl}/siteler/${opts.siteId}` } },
  ]);
  await sendEmail({ to: opts.to, subject: `${opts.siteName} · Siteye eklendiniz`, html, text, kind: "added-to-site", siteId: opts.siteId });
}
