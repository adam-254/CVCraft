-- Add pages column to cover_letter table
ALTER TABLE cover_letter 
ADD COLUMN IF NOT EXISTS pages JSONB NOT NULL DEFAULT '[{"id": "1", "content": ""}]'::jsonb;

-- Migrate existing content to pages format for existing records
UPDATE cover_letter 
SET pages = jsonb_build_array(
  jsonb_build_object(
    'id', '1',
    'content', COALESCE(content, '')
  )
)
WHERE pages = '[{"id": "1", "content": ""}]'::jsonb;
