CREATE TABLE "site_sections" (
	"site_id" uuid NOT NULL,
	"key" text NOT NULL,
	"position" integer NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"content" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_sections_site_id_key_pk" PRIMARY KEY("site_id","key")
);
--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "profession" text;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "theme" text DEFAULT 'turuncu' NOT NULL;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "setup_completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "site_sections" ADD CONSTRAINT "site_sections_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;