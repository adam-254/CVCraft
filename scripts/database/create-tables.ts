import { directDb } from "@/integrations/drizzle/direct-client";

async function createTables() {
	try {
		console.log("Creating tables directly...");

		// Create cover_letter table
		await directDb.execute(`
			CREATE TABLE IF NOT EXISTS "cover_letter" (
				"id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
				"title" text NOT NULL,
				"slug" text NOT NULL,
				"recipient" text,
				"content" text NOT NULL DEFAULT '',
				"tags" text[] DEFAULT '{}' NOT NULL,
				"is_public" boolean DEFAULT false NOT NULL,
				"is_locked" boolean DEFAULT false NOT NULL,
				"password" text,
				"user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
				"created_at" timestamp with time zone DEFAULT now() NOT NULL,
				"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
				CONSTRAINT "cover_letter_slug_user_id_unique" UNIQUE("slug", "user_id")
			)
		`);
		console.log("✓ Created cover_letter table");

		// Create indexes for cover_letter
		await directDb.execute(`CREATE INDEX IF NOT EXISTS "cover_letter_user_id_idx" ON "cover_letter" ("user_id")`);
		await directDb.execute(`CREATE INDEX IF NOT EXISTS "cover_letter_user_id_updated_at_idx" ON "cover_letter" ("user_id", "updated_at" DESC)`);
		await directDb.execute(`CREATE INDEX IF NOT EXISTS "cover_letter_public_slug_user_idx" ON "cover_letter" ("is_public", "slug", "user_id")`);
		console.log("✓ Created cover_letter indexes");

		// Create ai_provider table
		await directDb.execute(`
			CREATE TABLE IF NOT EXISTS "ai_provider" (
				"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				"user_id" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
				"provider" TEXT NOT NULL,
				"api_key" TEXT NOT NULL,
				"base_url" TEXT,
				"model" TEXT NOT NULL,
				"is_active" BOOLEAN NOT NULL DEFAULT false,
				"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
				"updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
			)
		`);
		console.log("✓ Created ai_provider table");

		// Create indexes for ai_provider
		await directDb.execute(`CREATE INDEX IF NOT EXISTS "idx_ai_provider_user_id" ON "ai_provider"("user_id")`);
		await directDb.execute(`CREATE INDEX IF NOT EXISTS "idx_ai_provider_user_active" ON "ai_provider"("user_id", "is_active")`);
		await directDb.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "idx_ai_provider_user_one_active" ON "ai_provider"("user_id") WHERE "is_active" = true`);
		console.log("✓ Created ai_provider indexes");

		console.log("All tables created successfully!");
	} catch (error) {
		console.error("Table creation failed:", error);
		throw error;
	}
}

// Run the table creation
createTables()
	.then(() => {
		console.log("Table creation completed successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Table creation failed:", error);
		process.exit(1);
	});

export { createTables };