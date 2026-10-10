CREATE TABLE "email_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"to" text NOT NULL,
	"subject" text NOT NULL,
	"kind" text NOT NULL,
	"site_id" uuid,
	"status" text NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"paid_on" date NOT NULL,
	"period_ends_at" timestamp with time zone NOT NULL,
	"note" text,
	"recorded_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_stats_daily" (
	"site_id" uuid NOT NULL,
	"day" date NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"visitors" integer DEFAULT 0 NOT NULL,
	"phone_clicks" integer DEFAULT 0 NOT NULL,
	"whatsapp_clicks" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "site_stats_daily_site_id_day_pk" PRIMARY KEY("site_id","day")
);
--> statement-breakpoint
CREATE TABLE "stat_visitors" (
	"day" date NOT NULL,
	"site_id" uuid NOT NULL,
	"hash" text NOT NULL,
	CONSTRAINT "stat_visitors_day_site_id_hash_pk" PRIMARY KEY("day","site_id","hash")
);
--> statement-breakpoint
CREATE TABLE "subscription_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_reminders_once" UNIQUE("site_id","kind","ends_at")
);
--> statement-breakpoint
ALTER TABLE "email_log" ADD CONSTRAINT "email_log_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_stats_daily" ADD CONSTRAINT "site_stats_daily_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stat_visitors" ADD CONSTRAINT "stat_visitors_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_reminders" ADD CONSTRAINT "subscription_reminders_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_log_created_at_idx" ON "email_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "payments_site_id_idx" ON "payments" USING btree ("site_id","paid_on");