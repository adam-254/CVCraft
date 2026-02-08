/**
 * Auth Config - DISABLED
 * Using direct Supabase client instead of better-auth
 * See: src/integrations/auth/simple-client.ts
 */

// Better-auth has been removed in favor of direct Supabase client calls
// This file is kept for compatibility but auth is now handled by:
// - src/routes/api/auth-simple.ts (API endpoints)
// - src/integrations/auth/simple-client.ts (Client SDK)

export const auth = {
	// Stub to prevent import errors
	api: null,
};
