import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { panelUrl } from "@/lib/config";
import { passwordResetEmail } from "@/lib/account-emails";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    // Kayıt kapalı: hesapları süper admin davetle açar (src/lib/invites.ts)
    disableSignUp: true,
    minPasswordLength: 8,
    // Link Better Auth'un ara sayfası yerine doğrudan paneldeki şifre belirleme sayfasını açar
    sendResetPassword: async ({ user, token }) => {
      await passwordResetEmail(user.email, token);
    },
    // Şifresini e-postadaki linkle belirleyen kullanıcının e-postası doğrulanmış sayılır
    onPasswordReset: async ({ user: { id } }) => {
      await db.update(schema.user).set({ emailVerified: true }).where(eq(schema.user.id, id));
    },
    revokeSessionsOnPasswordReset: true,
  },
  user: {
    additionalFields: {
      // Kullanıcı kendisi değiştiremez, sadece veritabanından / admin tarafından atanır
      isSuperAdmin: { type: "boolean", defaultValue: false, input: false },
    },
  },
  trustedOrigins: [panelUrl],
  // nextCookies, server action içinden yapılan giriş/çıkışlarda çerezleri ayarlar; listenin sonunda olmalı
  plugins: [nextCookies()],
});
