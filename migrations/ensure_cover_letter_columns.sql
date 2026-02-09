-- Ensure all cover_letter columns exist with proper defaults
-- This migration is idempotent and safe to run multiple times

-- Add metadata fields if they don't exist
ALTER TABLE cover_letter
ADD COLUMN IF NOT EXISTS sender_name TEXT,
ADD COLUMN IF NOT EXISTS sender_address TEXT,
ADD COLUMN IF NOT EXISTS sender_city TEXT,
ADD COLUMN IF NOT EXISTS sender_phone TEXT,
ADD COLUMN IF NOT EXISTS sender_email TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS company_address TEXT,
ADD COLUMN IF NOT EXISTS company_city TEXT,
ADD COLUMN IF NOT EXISTS hiring_manager TEXT,
ADD COLUMN IF NOT EXISTS position TEXT;

-- Ensure core fields have proper defaults
ALTER TABLE cover_letter
ALTER COLUMN content SET DEFAULT '',
ALTER COLUMN tags SET DEFAULT '{}',
ALTER COLUMN is_public SET DEFAULT false,
ALTER COLUMN is_locked SET DEFAULT false;

-- Ensure NOT NULL constraints on required fields
ALTER TABLE cover_letter
ALTER COLUMN content SET NOT NULL,
ALTER COLUMN tags SET NOT NULL,
ALTER COLUMN is_public SET NOT NULL,
ALTER COLUMN is_locked SET NOT NULL;
