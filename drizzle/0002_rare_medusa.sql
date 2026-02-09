ALTER TABLE "public"."pg-drizzle_videos" ALTER COLUMN "source_language" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."pg-drizzle_videos" ALTER COLUMN "dest_language" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."language_code";--> statement-breakpoint
CREATE TYPE "public"."language_code" AS ENUM('Chinese', 'English', 'Japanese', 'Korean', 'German', 'French', 'Russian', 'Portuguese', 'Spanish', 'Italian');--> statement-breakpoint
ALTER TABLE "public"."pg-drizzle_videos" ALTER COLUMN "source_language" SET DATA TYPE "public"."language_code" USING "source_language"::"public"."language_code";--> statement-breakpoint
ALTER TABLE "public"."pg-drizzle_videos" ALTER COLUMN "dest_language" SET DATA TYPE "public"."language_code" USING "dest_language"::"public"."language_code";