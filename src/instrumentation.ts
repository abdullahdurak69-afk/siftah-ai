import type { Instrumentation } from "next";

// Sunucu hatalarını Sentry'ye (veya Sentry uyumlu GlitchTip'e) gönderir. SENTRY_DSN tanımlı değilse kapalıdır.
// Müşteri sitelerine istemci tarafı betik eklenmez (sayfa hızı); sadece sunucuda yakalanan hatalar gider.
// Kişisel veri gönderilmez: çerezler, IP ve istek başlıkları eklenmez, sadece adres ve rota bilgisi.

const dsn = process.env.SENTRY_DSN;

export async function register() {
  if (!dsn || process.env.NEXT_RUNTIME !== "nodejs") return;
  const Sentry = await import("@sentry/node");
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    // Ziyaretçi ve kullanıcı verisi toplanmaz (KVKK)
    dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
    tracesSampleRate: 0,
  });
}

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (!dsn || process.env.NEXT_RUNTIME !== "nodejs") return;
  const Sentry = await import("@sentry/node");
  const host = request.headers.host;
  Sentry.withScope((scope) => {
    scope.setTags({ routeType: context.routeType, routePath: context.routePath, host: typeof host === "string" ? host : undefined });
    scope.setContext("request", { method: request.method, path: request.path, renderSource: context.renderSource });
    Sentry.captureException(error);
  });
  await Sentry.flush(2000);
};
