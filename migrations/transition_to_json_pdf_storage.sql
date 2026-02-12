-- Migration: Transition to JSON + PDF Storage Architecture
-- This migration ensures we're using JSON as primary storage with PDF generation

-- ============================================
-- STEP 1: Update resume table structure
-- ============================================

-- Ensure resume table has proper JSON storage and PDF tracking
ALTER TABLE resume 
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS template_used TEXT DEFAULT 'professional';

-- Remove any HTML storage columns if they exist
-- (These might not exist, but we'll try to remove them safely)
ALTER TABLE resume DROP COLUMN IF EXISTS html_content;
ALTER TABLE resume DROP COLUMN IF EXISTS rendered_html;

-- Update document_url to pdf_url for clarity (if document_url exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'resume' AND column_name = 'document_url') THEN
        -- Copy data from document_url to pdf_url
        UPDATE resume SET pdf_url = document_url WHERE document_url IS NOT NULL;
        -- Drop the old column
        ALTER TABLE resume DROP COLUMN document_url;
    END IF;
END $$;

-- Update document_saved_at to pdf_generated_at for clarity (if document_saved_at exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'resume' AND column_name = 'document_saved_at') THEN
        -- Copy data from document_saved_at to pdf_generated_at
        UPDATE resume SET pdf_generated_at = document_saved_at WHERE document_saved_at IS NOT NULL;
        -- Drop the old column
        ALTER TABLE resume DROP COLUMN document_saved_at;
    END IF;
END $$;

-- ============================================
-- STEP 2: Update cover letter table structure
-- ============================================

-- Ensure cover letter table has proper PDF tracking
ALTER TABLE cover_letter 
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS template_used TEXT DEFAULT 'professional';

-- Remove any HTML storage columns if they exist
ALTER TABLE cover_letter DROP COLUMN IF EXISTS html_content;
ALTER TABLE cover_letter DROP COLUMN IF EXISTS rendered_html;

-- ============================================
-- STEP 3: Create indexes for better performance
-- ============================================

-- Indexes for PDF tracking
CREATE INDEX IF NOT EXISTS idx_resume_pdf_url ON resume(pdf_url) WHERE pdf_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_resume_pdf_generated_at ON resume(pdf_generated_at DESC) WHERE pdf_generated_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_resume_template_used ON resume(template_used);

CREATE INDEX IF NOT EXISTS idx_cover_letter_pdf_url ON cover_letter(pdf_url) WHERE pdf_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cover_letter_pdf_generated_at ON cover_letter(pdf_generated_at DESC) WHERE pdf_generated_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cover_letter_template_used ON cover_letter(template_used);

-- ============================================
-- STEP 4: Add comments for documentation
-- ============================================

COMMENT ON COLUMN resume.data IS 'JSON data containing all resume content - this is the source of truth';
COMMENT ON COLUMN resume.pdf_url IS 'URL to generated PDF file in storage bucket (cached)';
COMMENT ON COLUMN resume.pdf_generated_at IS 'Timestamp when PDF was last generated';
COMMENT ON COLUMN resume.template_used IS 'Template name used for PDF generation';

COMMENT ON COLUMN cover_letter.content IS 'Main content of the cover letter';
COMMENT ON COLUMN cover_letter.pages IS 'JSON array of cover letter pages';
COMMENT ON COLUMN cover_letter.pdf_url IS 'URL to generated PDF file in storage bucket (cached)';
COMMENT ON COLUMN cover_letter.pdf_generated_at IS 'Timestamp when PDF was last generated';
COMMENT ON COLUMN cover_letter.template_used IS 'Template name used for PDF generation';

-- ============================================
-- STEP 5: Create storage bucket policy (if using Supabase)
-- ============================================

-- Note: This needs to be run in Supabase dashboard if using Supabase Storage
-- 
-- 1. Create bucket named 'documents' if it doesn't exist
-- 2. Set up RLS policies for the bucket:
--
-- INSERT policy:
-- CREATE POLICY "Users can upload their own documents" ON storage.objects
-- FOR INSERT WITH CHECK (
--   bucket_id = 'documents' AND 
--   auth.uid()::text = (storage.foldername(name))[1]
-- );
--
-- SELECT policy:
-- CREATE POLICY "Users can view their own documents" ON storage.objects
-- FOR SELECT USING (
--   bucket_id = 'documents' AND 
--   auth.uid()::text = (storage.foldername(name))[1]
-- );
--
-- DELETE policy:
-- CREATE POLICY "Users can delete their own documents" ON storage.objects
-- FOR DELETE USING (
--   bucket_id = 'documents' AND 
--   auth.uid()::text = (storage.foldername(name))[1]
-- );

-- ============================================
-- STEP 6: Data validation
-- ============================================

-- Ensure all resumes have valid JSON data
UPDATE resume 
SET data = '{}'::jsonb 
WHERE data IS NULL OR data = 'null'::jsonb;

-- Ensure all cover letters have valid content
UPDATE cover_letter 
SET content = '' 
WHERE content IS NULL;

UPDATE cover_letter 
SET pages = '[{"id": "1", "content": ""}]'::jsonb 
WHERE pages IS NULL OR pages = 'null'::jsonb;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Summary of changes:
-- 1. ✅ JSON data remains primary storage in database
-- 2. ✅ Added PDF tracking columns (pdf_url, pdf_generated_at, template_used)
-- 3. ✅ Removed any HTML storage columns
-- 4. ✅ Added proper indexes for performance
-- 5. ✅ Added documentation comments
-- 6. ✅ Validated existing data

-- Next steps:
-- 1. Update application code to use new PDF generation service
-- 2. Create 'documents' bucket in Supabase Storage
-- 3. Set up bucket policies for user access
-- 4. Test PDF generation workflow