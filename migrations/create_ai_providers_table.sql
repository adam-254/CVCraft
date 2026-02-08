-- Create AI Providers table for storing user AI integration credentials
CREATE TABLE IF NOT EXISTS "ai_provider" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "provider" TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'gemini', 'ollama', 'vercel-ai-gateway')),
  "api_key" TEXT NOT NULL,
  "base_url" TEXT,
  "model" TEXT NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS "idx_ai_provider_user_id" ON "ai_provider"("user_id");

-- Create index on user_id and is_active for finding active provider
CREATE INDEX IF NOT EXISTS "idx_ai_provider_user_active" ON "ai_provider"("user_id", "is_active");

-- Ensure only one active provider per user
CREATE UNIQUE INDEX IF NOT EXISTS "idx_ai_provider_user_one_active" 
ON "ai_provider"("user_id") 
WHERE "is_active" = true;
