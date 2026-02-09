-- Add metadata fields to cover_letter table
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
