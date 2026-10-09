// Yerel geliştirme için süper admin hesabı oluşturur: npm run db:seed
import { config } from "dotenv";
config({ path: ".env.local" });

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

async function main() {
  const { db } = await import("../src/db");
  const { account, user } = await import("../src/db/schema");

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) throw new Error("SEED_ADMIN_EMAIL ve SEED_ADMIN_PASSWORD .env.local içinde tanımlı olmalı");

  const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, email));
  if (existing) {
    await db.update(user).set({ isSuperAdmin: true }).where(eq(user.id, existing.id));
    console.log(`Mevcut kullanıcı süper admin yapıldı: ${email}`);
    process.exit(0);
  }

  const userId = randomUUID();
  await db.transaction(async (tx) => {
    await tx.insert(user).values({ id: userId, name: "Süper Admin", email, emailVerified: true, isSuperAdmin: true });
    await tx.insert(account).values({
      id: randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: await hashPassword(password),
    });
  });

  console.log(`Süper admin oluşturuldu: ${email} (şifre .env.local içinde)`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
