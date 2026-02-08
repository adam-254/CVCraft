/**
 * Supabase HTTP Adapter for Drizzle
 *
 * This adapter uses Supabase's REST API instead of direct PostgreSQL connection.
 * It bypasses DNS/network issues while still providing full database functionality.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/utils/env";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient() {
	if (!supabaseClient) {
		const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
		const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !supabaseKey) {
			throw new Error("Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
		}

		supabaseClient = createClient(supabaseUrl, supabaseKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
			db: {
				schema: "public",
			},
		});
	}

	return supabaseClient;
}

/**
 * Execute raw SQL through Supabase's RPC
 * This is a fallback for complex queries that can't use the REST API
 */
export async function executeRawSQL(query: string, params?: any[]) {
	const client = getSupabaseClient();

	// Supabase doesn't directly support raw SQL through REST API
	// We need to use their RPC functions or create a custom function
	// For now, we'll use the PostgREST API for standard operations

	throw new Error("Raw SQL execution requires direct PostgreSQL connection or custom RPC function");
}

/**
 * Check if we should use Supabase HTTP adapter
 */
export function shouldUseSupabaseAdapter() {
	const dbUrl = process.env.DATABASE_URL || env.DATABASE_URL;
	return dbUrl?.startsWith("supabase://") || process.env.USE_SUPABASE_ADAPTER === "true";
}
