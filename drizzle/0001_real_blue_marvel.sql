CREATE TYPE "public"."language_code" AS ENUM('ar', 'bn', 'bg', 'ca', 'zh-Hans', 'zh-Hant', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fil', 'fi', 'fr', 'fr-ca', 'de', 'el', 'gu', 'he', 'hi', 'hu', 'is', 'id', 'it', 'ja', 'kn', 'ko', 'lv', 'lt', 'ml', 'mr', 'nb', 'fa', 'pl', 'pt', 'pt-pt', 'pa', 'ro', 'ru', 'sr-Cyrl', 'sk', 'sl', 'es', 'sw', 'sv', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'vi');--> statement-breakpoint
CREATE TABLE "pg-drizzle_videos" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_by_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"blob" text NOT NULL,
	"status" text,
	"source_language" "language_code" NOT NULL,
	"dest_language" "language_code" NOT NULL
);
--> statement-breakpoint
DROP TABLE "pg-drizzle_post" CASCADE;--> statement-breakpoint
ALTER TABLE "pg-drizzle_videos" ADD CONSTRAINT "pg-drizzle_videos_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;