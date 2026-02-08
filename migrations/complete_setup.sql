-- Complete Database Setup for CVCraft on Supabase
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Create all tables and indexes
-- ============================================

-- This migration creates all necessary tables for authentication and resume management
-- The app uses better-auth (not Supabase Auth) for authentication

-- User table - stores user account information
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY,
	"image" text,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"username" text NOT NULL UNIQUE,
	"display_username" text NOT NULL UNIQUE,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Session table - stores active user sessions
CREATE TABLE IF NOT EXISTS "session" (
	"id" uuid PRIMARY KEY,
	"token" text NOT NULL UNIQUE,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Account table - stores authentication provider information
CREATE TABLE IF NOT EXISTS "account" (
	"id" uuid PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text DEFAULT 'credential' NOT NULL,
	"user_id" uuid NOT NULL,
	"scope" text,
	"id_token" text,
	"password" text,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Verification table - stores email verification and password reset tokens
CREATE TABLE IF NOT EXISTS "verification" (
	"id" uuid PRIMARY KEY,
	"identifier" text NOT NULL UNIQUE,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Two Factor table - stores 2FA secrets and backup codes
CREATE TABLE IF NOT EXISTS "two_factor" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"secret" text,
	"backup_codes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Passkey table - stores WebAuthn passkey credentials
CREATE TABLE IF NOT EXISTS "passkey" (
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
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Resume table - stores resume data
CREATE TABLE IF NOT EXISTS "resume" (
	"id" uuid PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"password" text,
	"data" jsonb NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "resume_slug_user_id_unique" UNIQUE("slug","user_id")
);

-- Resume Statistics table - tracks views and downloads
CREATE TABLE IF NOT EXISTS "resume_statistics" (
	"id" uuid PRIMARY KEY,
	"views" integer DEFAULT 0 NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"last_viewed_at" timestamp with time zone,
	"last_downloaded_at" timestamp with time zone,
	"resume_id" uuid NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- API Key table - stores API keys for programmatic access
CREATE TABLE IF NOT EXISTS "apikey" (
	"id" uuid PRIMARY KEY,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"user_id" uuid NOT NULL,
	"refill_interval" integer,
	"refill_amount" integer,
	"last_refill_at" timestamp with time zone,
	"enabled" boolean DEFAULT true NOT NULL,
	"rate_limit_enabled" boolean DEFAULT false NOT NULL,
	"rate_limit_time_window" integer,
	"rate_limit_max" integer,
	"request_count" integer DEFAULT 0 NOT NULL,
	"remaining" integer,
	"last_request" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"permissions" text,
	"metadata" jsonb
);

-- ============================================
-- STEP 2: Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS "user_email_index" ON "user" ("email");
CREATE INDEX IF NOT EXISTS "user_username_index" ON "user" ("username");
CREATE INDEX IF NOT EXISTS "session_token_user_id_index" ON "session" ("token","user_id");
CREATE INDEX IF NOT EXISTS "session_expires_at_index" ON "session" ("expires_at");
CREATE INDEX IF NOT EXISTS "account_user_id_index" ON "account" ("user_id");
CREATE INDEX IF NOT EXISTS "verification_identifier_index" ON "verification" ("identifier");
CREATE INDEX IF NOT EXISTS "two_factor_user_id_index" ON "two_factor" ("user_id");
CREATE INDEX IF NOT EXISTS "two_factor_secret_index" ON "two_factor" ("secret");
CREATE INDEX IF NOT EXISTS "passkey_user_id_index" ON "passkey" ("user_id");
CREATE INDEX IF NOT EXISTS "resume_user_id_index" ON "resume" ("user_id");
CREATE INDEX IF NOT EXISTS "resume_user_id_updated_at_index" ON "resume" ("user_id", "updated_at" DESC);
CREATE INDEX IF NOT EXISTS "resume_is_public_slug_user_id_index" ON "resume" ("is_public","slug","user_id");
CREATE INDEX IF NOT EXISTS "resume_statistics_resume_id_index" ON "resume_statistics" ("resume_id");
CREATE INDEX IF NOT EXISTS "apikey_user_id_index" ON "apikey" ("user_id");
CREATE INDEX IF NOT EXISTS "apikey_key_index" ON "apikey" ("key");
CREATE INDEX IF NOT EXISTS "apikey_enabled_user_id_index" ON "apikey" ("enabled", "user_id");

-- ============================================
-- STEP 3: Add foreign key constraints
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'session_user_id_user_id_fkey'
    ) THEN
        ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'account_user_id_user_id_fkey'
    ) THEN
        ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'two_factor_user_id_user_id_fkey'
    ) THEN
        ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'passkey_user_id_user_id_fkey'
    ) THEN
        ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'resume_user_id_user_id_fkey'
    ) THEN
        ALTER TABLE "resume" ADD CONSTRAINT "resume_user_id_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'resume_statistics_resume_id_resume_id_fkey'
    ) THEN
        ALTER TABLE "resume_statistics" ADD CONSTRAINT "resume_statistics_resume_id_resume_id_fkey" 
        FOREIGN KEY ("resume_id") REFERENCES "resume"("id") ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'apikey_user_id_user_id_fkey'
    ) THEN
        ALTER TABLE "apikey" ADD CONSTRAINT "apikey_user_id_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
    END IF;
END $$;

-- ============================================
-- STEP 4: Create function to auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- STEP 5: Create triggers for updated_at
-- ============================================

DROP TRIGGER IF EXISTS update_user_updated_at ON "user";
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_session_updated_at ON "session";
CREATE TRIGGER update_session_updated_at BEFORE UPDATE ON "session"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_account_updated_at ON "account";
CREATE TRIGGER update_account_updated_at BEFORE UPDATE ON "account"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_verification_updated_at ON "verification";
CREATE TRIGGER update_verification_updated_at BEFORE UPDATE ON "verification"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_two_factor_updated_at ON "two_factor";
CREATE TRIGGER update_two_factor_updated_at BEFORE UPDATE ON "two_factor"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_passkey_updated_at ON "passkey";
CREATE TRIGGER update_passkey_updated_at BEFORE UPDATE ON "passkey"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resume_updated_at ON "resume";
CREATE TRIGGER update_resume_updated_at BEFORE UPDATE ON "resume"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resume_statistics_updated_at ON "resume_statistics";
CREATE TRIGGER update_resume_statistics_updated_at BEFORE UPDATE ON "resume_statistics"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_apikey_updated_at ON "apikey";
CREATE TRIGGER update_apikey_updated_at BEFORE UPDATE ON "apikey"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 6: Grant necessary permissions
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant all privileges on all tables to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant all privileges on all sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, service_role;

-- Grant execute on all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, authenticated, service_role;

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. This app uses better-auth (application-level authentication)
--    NOT Supabase Auth. All security is handled at the API level.
--
-- 2. Row Level Security (RLS) is NOT enabled because:
--    - The app uses its own session management
--    - All data access goes through the application API
--    - The app uses service role credentials
--
-- 3. If you want to enable RLS for extra security:
--    - You'll need to create custom policies
--    - Policies must work with better-auth sessions
--    - The app must use service role to bypass RLS
--
-- 4. Authentication flows (signup, login, forgot password) 
--    will now store data in these Supabase tables
--
-- 5. Make sure your DATABASE_URL in .env points to Supabase:
--    DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

-- ============================================
-- Setup Complete! 
-- ============================================
-- Your database is now ready for CVCraft.
-- All authentication flows will store data here.
