-- Create cover_letter table
CREATE TABLE IF NOT EXISTS "cover_letter" (
	"id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"recipient" text,
	"content" text NOT NULL DEFAULT '',
	"tags" text[] DEFAULT '{}' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"password" text,
	"user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cover_letter_slug_user_id_unique" UNIQUE("slug", "user_id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "cover_letter_user_id_idx" ON "cover_letter" ("user_id");
CREATE INDEX IF NOT EXISTS "cover_letter_user_id_updated_at_idx" ON "cover_letter" ("user_id", "updated_at" DESC);
CREATE INDEX IF NOT EXISTS "cover_letter_public_slug_user_idx" ON "cover_letter" ("is_public", "slug", "user_id");

-- Note: RLS policies for this table are defined in enable_rls_cover_letter_ai_provider.sql
