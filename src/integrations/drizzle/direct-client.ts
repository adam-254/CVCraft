import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import { Pool } from "pg";
import { schema } from "@/integrations/drizzle";

// Direct database client that can be used in both server and client contexts
// This bypasses the server-only restriction for debugging purposes

type DirectDbType = NodePgDatabase<typeof schema> | PgliteDatabase<typeof schema>;

let _directDb: DirectDbType | null = null;

function createDirectDb(): DirectDbType {
	// Get DATABASE_URL from environment
	const databaseUrl = process.env.DATABASE_URL;
	
	// Determine if we should use PGlite
	const usePglite = !databaseUrl || databaseUrl.startsWith("pglite://") || databaseUrl === "pglite";
	
	if (usePglite) {
		const dataDir = databaseUrl?.replace("pglite://", "") || "./pglite-data";
		const client = new PGlite(dataDir);
		return drizzlePglite({ client, schema });
	} else {
		const pool = new Pool({ connectionString: databaseUrl });
		return drizzlePg({ client: pool, schema });
	}
}

export function getDirectDb(): DirectDbType {
	if (!_directDb) {
		_directDb = createDirectDb();
	}
	return _directDb;
}

// Export the database client
export const directDb = getDirectDb();