/**
 * Supabase Client for Database Operations
 * Uses Supabase JavaScript SDK instead of direct PostgreSQL connection
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/utils/env';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });
  }
  
  return supabaseClient;
}

// Export a singleton instance
export const supabase = getSupabaseClient();
