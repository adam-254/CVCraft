-- Add document_url column to resume table to track saved documents
ALTER TABLE resume ADD COLUMN IF NOT EXISTS document_url TEXT;
ALTER TABLE resume ADD COLUMN IF NOT EXISTS document_saved_at TIMESTAMP WITH TIME ZONE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_resume_document_url ON resume(document_url);
