-- Enable Row Level Security (RLS) for cover_letter and ai_provider tables only
-- Only applies when auth.uid() function exists (Supabase environment)

DO $$
BEGIN
    -- Check if auth.uid() function exists (Supabase environment)
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'uid' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth')) THEN
        
        -- Enable RLS on cover_letter table
        ALTER TABLE "cover_letter" ENABLE ROW LEVEL SECURITY;
        
        -- Create policies for cover_letter table
        CREATE POLICY "Users can view their own cover letters"
            ON "cover_letter"
            FOR SELECT
            USING (auth.uid()::text = user_id::text OR is_public = true);

        CREATE POLICY "Users can insert their own cover letters"
            ON "cover_letter"
            FOR INSERT
            WITH CHECK (auth.uid()::text = user_id::text);

        CREATE POLICY "Users can update their own cover letters"
            ON "cover_letter"
            FOR UPDATE
            USING (auth.uid()::text = user_id::text);

        CREATE POLICY "Users can delete their own cover letters"
            ON "cover_letter"
            FOR DELETE
            USING (auth.uid()::text = user_id::text);

        -- Enable RLS on ai_provider table
        ALTER TABLE "ai_provider" ENABLE ROW LEVEL SECURITY;
        
        -- Create policies for ai_provider table
        CREATE POLICY "Users can view their own AI providers"
            ON "ai_provider"
            FOR SELECT
            USING (auth.uid()::text = user_id::text);

        CREATE POLICY "Users can insert their own AI providers"
            ON "ai_provider"
            FOR INSERT
            WITH CHECK (auth.uid()::text = user_id::text);

        CREATE POLICY "Users can update their own AI providers"
            ON "ai_provider"
            FOR UPDATE
            USING (auth.uid()::text = user_id::text);

        CREATE POLICY "Users can delete their own AI providers"
            ON "ai_provider"
            FOR DELETE
            USING (auth.uid()::text = user_id::text);
            
    END IF;
END $$;