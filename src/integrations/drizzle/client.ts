/**
 * Database Client
 * Note: This client is being phased out in favor of direct Supabase client usage.
 * New code should use the Supabase client from @/integrations/supabase/client
 * See resume-direct.ts and cover-letter-direct.ts for examples.
 */

import { createServerOnlyFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

// Placeholder - services should use Supabase client directly
const getDatabaseServerFn = createServerOnlyFn(() => {
	// Return supabase client for now
	// Services using this will need to be migrated to use Supabase client methods
	return supabase as any;
});

export const db = getDatabaseServerFn();
