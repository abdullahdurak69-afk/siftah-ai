import {
  type AnyPgColumn,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// --- Better Auth tabloları (anahtar adları Better Auth'un model adlarıyla aynı olmalı) ---

export const user = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  isSuperAdmin: boolean("is_super_admin").notNull().default(false),
  ...timestamps,
});

export const session = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [index("sessions_user_id_idx").on(t.userId)],
);

export const account = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [index("accounts_user_id_idx").on(t.userId)],
);

export const verification = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps,
});

// --- Platform tabloları ---

export const sectorEnum = pgEnum("sector", ["usta", "restoran", "kuafor", "klinik"]);
export const siteStatusEnum = pgEnum("site_status", ["draft", "published", "suspended"]);
export const memberRoleEnum = pgEnum("member_role", ["owner", "editor"]);

export const sites = pgTable("sites", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  sector: sectorEnum("sector").notNull(),
  status: siteStatusEnum("status").notNull().default("draft"),
  // Usta şablonunda meslek ön ayarı (tv-uydu, su-tesisat...); kurulum sihirbazında seçilir
  profession: text("profession"),
  theme: text("theme").notNull().default("turuncu"),
  setupCompletedAt: timestamp("setup_completed_at", { withTimezone: true }),
  // Taslakta en son ne zaman değişiklik yapıldı; yayınlanmamış değişiklik var mı diye yayın tarihiyle karşılaştırılır
  contentUpdatedAt: timestamp("content_updated_at", { withTimezone: true }).notNull().defaultNow(),
  publishedVersionId: uuid("published_version_id").references((): AnyPgColumn => siteVersions.id, {
    onDelete: "set null",
  }),
  subscriptionEndsAt: timestamp("subscription_ends_at", { withTimezone: true }),
  ...timestamps,
});

export const siteMembers = pgTable(
  "site_members",
  {
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").notNull().default("owner"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.siteId, t.userId] }), index("site_members_user_id_idx").on(t.userId)],
);

// Sitenin bölümleri ve taslak içeriği. İçerik, şablonun şemasına göre doğrulanmış JSON'dur.
export const siteSections = pgTable(
  "site_sections",
  {
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    position: integer("position").notNull(),
    enabled: boolean("enabled").notNull().default(true),
    content: jsonb("content").$type<Record<string, unknown>>().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.siteId, t.key] })],
);

// Her "Yayınla" bir sürüm üretir. Ziyaretçiye her zaman yayındaki sürümün anlık görüntüsü gösterilir.
export const siteVersions = pgTable(
  "site_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    snapshot: jsonb("snapshot").$type<SiteSnapshot>().notNull(),
    publishedBy: text("published_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("site_versions_site_id_idx").on(t.siteId, t.createdAt)],
);

// Giriş yapmadan taslağı görmeyi sağlayan süreli linkler (ajans modelinde müşteri onayı için)
export const previewLinks = pgTable(
  "preview_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("preview_links_site_id_idx").on(t.siteId)],
);

export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    // Depolamadaki yol öneki; büyük ve küçük boyutlar <key>-1600.webp ve <key>-640.webp olarak saklanır
    key: text("key").notNull().unique(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    bytes: integer("bytes").notNull(),
    uploadedBy: text("uploaded_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("media_site_id_idx").on(t.siteId)],
);

export const domainStatusEnum = pgEnum("domain_status", ["pending", "verified"]);

// Müşterinin kendi domain'i. Ana domain (firmam.com) saklanır; www.firmam.com otomatik olarak ona yönlenir.
// Alt alan adı (site.firmam.com) bağlanırsa www yönlendirmesi yapılmaz.
export const domains = pgTable(
  "domains",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    hostname: text("hostname").notNull().unique(),
    status: domainStatusEnum("status").notNull().default("pending"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
    // Son kontrolde bulunan sorun (panelde kullanıcıya gösterilir)
    lastError: text("last_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("domains_site_id_idx").on(t.siteId)],
);

export type Domain = typeof domains.$inferSelect;

export type SiteSnapshot = {
  name: string;
  theme: string;
  profession: string | null;
  sections: { key: string; position: number; enabled: boolean; content: Record<string, unknown> }[];
};

export type Site = typeof sites.$inferSelect;
