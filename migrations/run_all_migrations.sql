-- ============================================
-- REACTIVE RESUME - COMPLETE DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Migration 1: Initial Schema
-- From: 20260114102228_peaceful_pestilence/migration.sql

CREATE TABLE "account" (
	"id" uuid PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text DEFAULT 'credential' NOT NULL,
	"user_id" uuid NOT NULL,
	"scope" text,
	"id_token" text,
	"password" text,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "apikey" (
	"id" uuid PRIMARY KEY,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"user_id" uuid NOT NULL,
	"refill_interval" integer,
	"refill_amount" integer,
	"last_refill_at" timestamp,
	"enabled" boolean DEFAULT true NOT NULL,
	"rate_limit_enabled" boolean DEFAULT false NOT NULL,
	"rate_limit_time_window" integer,
	"rate_limit_max" integer,
	"request_count" integer DEFAULT 0 NOT NULL,
	"remaining" integer,
	"last_request" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"permissions" text,
	"metadata" jsonb
);

CREATE TABLE "passkey" (
	"id" uuid PRIMARY KEY,
	"name" text,
	"aaguid" text,
	"public_key" text NOT NULL,
	"credential_id" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean DEFAULT false NOT NULL,
	"transports" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "resume" (
	"id" uuid PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"password" text,
	"data" jsonb NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "resume_slug_user_id_unique" UNIQUE("slug","user_id")
);

CREATE TABLE "resume_statistics" (
	"id" uuid PRIMARY KEY,
	"views" integer DEFAULT 0 NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"last_viewed_at" timestamp,
	"last_downloaded_at" timestamp,
	"resume_id" uuid NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "session" (
	"id" uuid PRIMARY KEY,
	"token" text NOT NULL UNIQUE,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "two_factor" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"secret" text,
	"backup_codes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "user" (
	"id" uuid PRIMARY KEY,
	"image" text,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"username" text NOT NULL UNIQUE,
	"display_username" text NOT NULL UNIQUE,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY,
	"identifier" text NOT NULL UNIQUE,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "account_user_id_index" ON "account" ("user_id");
CREATE INDEX "passkey_user_id_index" ON "passkey" ("user_id");
CREATE INDEX "resume_is_public_slug_user_id_index" ON "resume" ("is_public","slug","user_id");
CREATE INDEX "session_token_user_id_index" ON "session" ("token","user_id");
CREATE INDEX "two_factor_user_id_index" ON "two_factor" ("user_id");

ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "apikey" ADD CONSTRAINT "apikey_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "resume" ADD CONSTRAINT "resume_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "resume_statistics" ADD CONSTRAINT "resume_statistics_resume_id_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resume"("id") ON DELETE CASCADE;
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;

-- Migration 2: Update Timestamps to TIMESTAMPTZ
-- From: 20260115232736_nervous_maddog/migration.sql

ALTER TABLE "account" ALTER COLUMN "access_token_expires_at" SET DATA TYPE timestamp with time zone USING "access_token_expires_at"::timestamp with time zone;
ALTER TABLE "account" ALTER COLUMN "refresh_token_expires_at" SET DATA TYPE timestamp with time zone USING "refresh_token_expires_at"::timestamp with time zone;
ALTER TABLE "account" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;

ALTER TABLE "apikey" ALTER COLUMN "last_refill_at" SET DATA TYPE timestamp with time zone USING "last_refill_at"::timestamp with time zone;
ALTER TABLE "apikey" ALTER COLUMN "last_request" SET DATA TYPE timestamp with time zone USING "last_request"::timestamp with time zone;
ALTER TABLE "apikey" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone USING "expires_at"::timestamp with time zone;
ALTER TABLE "apikey" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;
ALTER TABLE "apikey" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;

ALTER TABLE "passkey" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;
ALTER TABLE "passkey" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;

ALTER TABLE "resume" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;
ALTER TABLE "resume" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;

ALTER TABLE "resume_statistics" ALTER COLUMN "last_viewed_at" SET DATA TYPE timestamp with time zone USING "last_viewed_at"::timestamp with time zone;
ALTER TABLE "resume_statistics" ALTER COLUMN "last_downloaded_at" SET DATA TYPE timestamp with time zone USING "last_downloaded_at"::timestamp with time zone;
ALTER TABLE "resume_statistics" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;
ALTER TABLE "resume_statistics" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;

ALTER TABLE "session" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone USING "expires_at"::timestamp with time zone;
ALTER TABLE "session" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;

ALTER TABLE "two_factor" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;
ALTER TABLE "two_factor" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;

ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;

ALTER TABLE "verification" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone USING "expires_at"::timestamp with time zone;
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;

CREATE INDEX "apikey_user_id_index" ON "apikey" ("user_id");
CREATE INDEX "apikey_key_index" ON "apikey" ("key");
CREATE INDEX "apikey_enabled_user_id_index" ON "apikey" ("enabled","user_id");
CREATE INDEX "resume_user_id_index" ON "resume" ("user_id");
CREATE INDEX "resume_user_id_updated_at_index" ON "resume" ("user_id","updated_at" DESC NULLS LAST);
CREATE INDEX "resume_statistics_resume_id_index" ON "resume_statistics" ("resume_id");
CREATE INDEX "session_expires_at_index" ON "session" ("expires_at");
CREATE INDEX "two_factor_secret_index" ON "two_factor" ("secret");
CREATE INDEX "user_email_index" ON "user" ("email");
CREATE INDEX "user_username_index" ON "user" ("username");
CREATE INDEX "verification_identifier_index" ON "verification" ("identifier");

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready for Reactive Resume
-- No RLS policies added (app handles auth at application level)
