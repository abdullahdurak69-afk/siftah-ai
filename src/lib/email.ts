import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { db } from "@/db";
import { emailLog } from "@/db/schema";
import { panelUrl, platformName, rootHostname } from "@/lib/config";

// E-posta SMTP ile gönderilir; Resend, Brevo, Yandex veya herhangi bir SMTP sağlayıcısı çalışır.
//   SMTP_URL=smtps://kullanici:sifre@smtp.resend.com:465
//   MAIL_FROM="Platform Adı <bildirim@platformadi.com>"
// SMTP_URL tanımlı değilse (geliştirme) e-posta gönderilmez, içeriği sunucu konsoluna yazılır.

const globalForMail = globalThis as unknown as { mailTransport?: Transporter };

function transport() {
  const url = process.env.SMTP_URL;
  if (!url) return null;
  globalForMail.mailTransport ??= nodemailer.createTransport(url);
  return globalForMail.mailTransport;
}

export const mailFrom = process.env.MAIL_FROM ?? `${platformName} <bildirim@${rootHostname}>`;

export type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
  // Kayıt için: invite, password-reset, reminder-30, admin-digest...
  kind: string;
  siteId?: string | null;
};

// Hata fırlatmaz: e-posta gönderilemedi diye asıl işlem (davet, ödeme kaydı) yarıda kalmasın. Sonuç kaydedilir.
export async function sendEmail(email: Email): Promise<boolean> {
  const smtp = transport();
  let status: "sent" | "logged" | "failed" = "logged";
  let error: string | null = null;

  if (smtp) {
    try {
      await smtp.sendMail({ from: mailFrom, to: email.to, subject: email.subject, html: email.html, text: email.text });
      status = "sent";
    } catch (e) {
      status = "failed";
      error = e instanceof Error ? e.message : String(e);
      console.error(`[e-posta] gönderilemedi: ${email.to} · ${email.subject}`, e);
    }
  } else {
    console.log(`\n[e-posta] SMTP_URL ayarlı değil, gönderilmedi\nKime: ${email.to}\nKonu: ${email.subject}\n\n${email.text}\n`);
  }

  await db
    .insert(emailLog)
    .values({ to: email.to, subject: email.subject, kind: email.kind, siteId: email.siteId ?? null, status, error })
    .catch((e) => console.error("[e-posta] kayıt yazılamadı", e));

  return status !== "failed";
}

// --- Şablon ---

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

type Block = { paragraph: string } | { button: { label: string; url: string } } | { list: string[] } | { note: string };

// Basit, her e-posta istemcisinde düzgün görünen tek sütunlu şablon. Metinler düz yazı olarak verilir ve kaçışlanır.
export function renderEmail(title: string, blocks: Block[]): { html: string; text: string } {
  const htmlParts = blocks.map((block) => {
    if ("paragraph" in block) return `<p style="margin:0 0 16px;line-height:1.6">${escapeHtml(block.paragraph)}</p>`;
    if ("note" in block)
      return `<p style="margin:0 0 16px;line-height:1.5;font-size:13px;color:#64748b">${escapeHtml(block.note)}</p>`;
    if ("list" in block)
      return `<ul style="margin:0 0 16px;padding-left:20px;line-height:1.7">${block.list.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
    return `<p style="margin:24px 0"><a href="${escapeHtml(block.button.url)}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">${escapeHtml(block.button.label)}</a></p>`;
  });

  const html = `<!doctype html><html lang="tr"><body style="margin:0;background:#f1f5f9;padding:24px 12px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;font-size:15px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px">
<p style="margin:0 0 20px;font-weight:600;color:#475569">${escapeHtml(platformName)}</p>
<h1 style="margin:0 0 16px;font-size:20px">${escapeHtml(title)}</h1>
${htmlParts.join("\n")}
</div>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;color:#94a3b8;text-align:center">${escapeHtml(platformName)} · <a href="${escapeHtml(panelUrl)}" style="color:#94a3b8">${escapeHtml(panelUrl.replace(/^https?:\/\//, ""))}</a></p>
</body></html>`;

  const text = [
    title,
    "",
    ...blocks.map((block) => {
      if ("paragraph" in block) return `${block.paragraph}\n`;
      if ("note" in block) return `${block.note}\n`;
      if ("list" in block) return `${block.list.map((i) => `- ${i}`).join("\n")}\n`;
      return `${block.button.label}: ${block.button.url}\n`;
    }),
    `${platformName} · ${panelUrl}`,
  ].join("\n");

  return { html, text };
}
