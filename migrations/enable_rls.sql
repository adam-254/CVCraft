-- Enable Row Level Security (RLS) on all tables
-- Run this manually in Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "apikey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "passkey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "resume" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "resume_statistics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "two_factor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;

-- Create policies for user table
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON "user"
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON "user"
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Create policies for resume table
-- Users can view their own resumes
CREATE POLICY "Users can view own resumes" ON "resume"
  FOR SELECT
  USING (auth.uid()::text = user_id::text OR is_public = true);

-- Users can insert their own resumes
CREATE POLICY "Users can create own resumes" ON "resume"
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own resumes
CREATE POLICY "Users can update own resumes" ON "resume"
  FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Users can delete their own resumes
CREATE POLICY "Users can delete own resumes" ON "resume"
  FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Create policies for resume_statistics table
-- Users can view statistics for their own resumes or public resumes
CREATE POLICY "Users can view resume statistics" ON "resume_statistics"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "resume"
      WHERE "resume".id = "resume_statistics".resume_id
      AND (auth.uid()::text = "resume".user_id::text OR "resume".is_public = true)
    )
  );

-- Create policies for account table
-- Users can view their own accounts
CREATE POLICY "Users can view own accounts" ON "account"
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Users can manage their own accounts
CREATE POLICY "Users can manage own accounts" ON "account"
  FOR ALL
  USING (auth.uid()::text = user_id::text);

-- Create policies for session table
-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON "session"
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Users can manage their own sessions
CREATE POLICY "Users can manage own sessions" ON "session"
  FOR ALL
  USING (auth.uid()::text = user_id::text);

-- Create policies for apikey table
-- Users can view their own API keys
CREATE POLICY "Users can view own API keys" ON "apikey"
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Users can manage their own API keys
CREATE POLICY "Users can manage own API keys" ON "apikey"
  FOR ALL
  USING (auth.uid()::text = user_id::text);

-- Create policies for passkey table
-- Users can view their own passkeys
CREATE POLICY "Users can view own passkeys" ON "passkey"
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Users can manage their own passkeys
CREATE POLICY "Users can manage own passkeys" ON "passkey"
  FOR ALL
  USING (auth.uid()::text = user_id::text);

-- Create policies for two_factor table
-- Users can view their own 2FA settings
CREATE POLICY "Users can view own 2FA" ON "two_factor"
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Users can manage their own 2FA settings
CREATE POLICY "Users can manage own 2FA" ON "two_factor"
  FOR ALL
  USING (auth.uid()::text = user_id::text);

-- Create policies for verification table
-- Allow service role to manage verifications (for email verification, password reset, etc.)
CREATE POLICY "Service role can manage verifications" ON "verification"
  FOR ALL
  USING (true);
