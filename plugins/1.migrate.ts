import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { definePlugin } from "nitro";
import { Pool } from "pg";

async function migrateDatabase() {
	console.log("⌛ Running database migrations...");

	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}

	const usePglite = connectionString.startsWith("pglite://") || connectionString === "pglite";

	if (usePglite) {
		const dataDir = connectionString.replace("pglite://", "") || "./pglite-data";
		const client = new PGlite(dataDir);
		const db = drizzlePglite({ client });

		try {
			await migratePglite(db, { migrationsFolder: "./migrations" });
			console.log("✅ Database migrations completed (PGlite)");
		} catch (error) {
			console.error("🚨 Database migrations failed:", error);
		} finally {
			await client.close();
		}
	} else {
		const pool = new Pool({ connectionString });
		const db = drizzlePg({ client: pool });

		try {
			await migratePg(db, { migrationsFolder: "./migrations" });
			console.log("✅ Database migrations completed (PostgreSQL)");
		} catch (error) {
			console.error("🚨 Database migrations failed:", error);
		} finally {
			await pool.end();
		}
	}
}

export default definePlugin(async () => {
	await migrateDatabase();
});
