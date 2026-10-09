import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { panelUrl } from "@/lib/config";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
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
