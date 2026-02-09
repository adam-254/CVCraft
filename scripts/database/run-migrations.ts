import { readFileSync } from "fs";
import { join } from "path";
import { directDb } from "@/integrations/drizzle/direct-client";

async function runMigrations() {
	try {
		console.log("Running database migrations...");

		// List of migration files to run in order
		const migrationFiles = ["migrations/create_cover_letter_table.sql", "migrations/create_ai_providers_table.sql"];

		for (const migrationFile of migrationFiles) {
			console.log(`Running migration: ${migrationFile}`);

			try {
				const migrationPath = join(process.cwd(), migrationFile);
				const migrationSql = readFileSync(migrationPath, "utf-8");

				// Split SQL into individual statements
				const statements = migrationSql
					.split(";")
					.map((stmt) => stmt.trim())
					.filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

				// Execute each statement individually
				for (const statement of statements) {
					if (statement.trim()) {
						await directDb.execute(statement);
					}
				}

				console.log(`✓ Migration completed: ${migrationFile}`);
			} catch (error) {
				console.error(`✗ Migration failed: ${migrationFile}`, error);
				// Continue with other migrations even if one fails
			}
		}

		console.log("All migrations completed!");
	} catch (error) {
		console.error("Migration process failed:", error);
		throw error;
	}
}

// Run the migrations
runMigrations()
	.then(() => {
		console.log("Migration process completed successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Migration process failed:", error);
		process.exit(1);
	});

export { runMigrations };
