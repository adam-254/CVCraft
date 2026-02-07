import { PGlite } from "@electric-sql/pglite";
import { createServerOnlyFn } from "@tanstack/react-start";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { Pool } from "pg";
import { schema } from "@/integrations/drizzle";
import { env } from "@/utils/env";

// During hot reload (i.e., in development), global assignment ensures the pool/client persist across reloads.
// This prevents exhausting connection limits due to re-creation on every reload.

declare global {
	var __pool: Pool | undefined;
	var __pglite: PGlite | undefined;
	var __drizzle: NodePgDatabase<typeof schema> | any | undefined;
}

function usePglite() {
	return env.DATABASE_URL?.startsWith("pglite://") || env.DATABASE_URL === "pglite";
}

function getPglite() {
	if (!globalThis.__pglite) {
		const dataDir = env.DATABASE_URL?.replace("pglite://", "") || "./pglite-data";
		globalThis.__pglite = new PGlite(dataDir);
	}
	return globalThis.__pglite;
}

function getPool() {
	if (!globalThis.__pool) {
		globalThis.__pool = new Pool({ connectionString: env.DATABASE_URL });
	}
	return globalThis.__pool;
}

function makeDrizzleClient() {
	if (usePglite()) {
		const client = getPglite();
		return drizzlePglite({ client, schema });
	} else {
		const pool = getPool();
		return drizzlePg({ client: pool, schema });
	}
}

const getDatabaseServerFn = createServerOnlyFn(() => {
	if (!globalThis.__drizzle) {
		globalThis.__drizzle = makeDrizzleClient();
	}
	return globalThis.__drizzle;
});

export const db = getDatabaseServerFn();
