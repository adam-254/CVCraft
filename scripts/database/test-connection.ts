import { sql } from "drizzle-orm";
import { db } from "@/integrations/drizzle/client";

/**
 * Test database connection to Supabase
 * Run with: npx tsx scripts/database/test-connection.ts
 */
async function testConnection() {
	console.log("🔍 Testing database connection...\n");

	try {
		// Test basic connection
		console.log("1️⃣ Testing basic connection...");
		const result = await db.execute(sql`SELECT NOW() as current_time, version() as pg_version`);
		console.log("✅ Connection successful!");
		console.log(`   Time: ${result.rows[0].current_time}`);
		console.log(`   PostgreSQL: ${result.rows[0].pg_version}\n`);

		// Check if tables exist
		console.log("2️⃣ Checking if tables exist...");
		const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

		if (tables.rows.length === 0) {
			console.log("⚠️  No tables found. Please run the migration:");
			console.log("   1. Open Supabase SQL Editor");
			console.log("   2. Run migrations/complete_setup.sql\n");
			return;
		}

		console.log(`✅ Found ${tables.rows.length} tables:`);
		for (const table of tables.rows) {
			console.log(`   - ${table.table_name}`);
		}
		console.log();

		// Check required auth tables
		console.log("3️⃣ Verifying authentication tables...");
		const requiredTables = ["user", "session", "account", "verification", "two_factor", "passkey"];
		const existingTables = tables.rows.map((t: any) => t.table_name);
		const missingTables = requiredTables.filter((t) => !existingTables.includes(t));

		if (missingTables.length > 0) {
			console.log("⚠️  Missing required tables:");
			for (const table of missingTables) {
				console.log(`   - ${table}`);
			}
			console.log("\n   Please run migrations/complete_setup.sql in Supabase SQL Editor\n");
			return;
		}

		console.log("✅ All authentication tables exist!\n");

		// Count records in each table
		console.log("4️⃣ Checking table contents...");
		for (const table of requiredTables) {
			const count = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM "${table}"`));
			console.log(`   ${table}: ${count.rows[0].count} records`);
		}
		console.log();

		// Test indexes
		console.log("5️⃣ Verifying indexes...");
		const indexes = await db.execute(sql`
      SELECT 
        tablename,
        indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('user', 'session', 'account', 'verification')
      ORDER BY tablename, indexname
    `);

		console.log(`✅ Found ${indexes.rows.length} indexes`);
		console.log();

		// Final summary
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("✅ Database connection test PASSED!");
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("\n🎉 Your database is ready for authentication!");
		console.log("\nNext steps:");
		console.log("1. Start your app: npm run dev");
		console.log("2. Test signup: http://localhost:3000/auth/register");
		console.log("3. Test login: http://localhost:3000/auth/login");
		console.log("4. Monitor in Supabase: https://supabase.com/dashboard\n");
	} catch (error) {
		console.error("❌ Connection test FAILED!\n");
		console.error("Error:", error);
		console.error("\nTroubleshooting:");
		console.error("1. Check DATABASE_URL in .env file");
		console.error("2. Verify Supabase project is active");
		console.error("3. Check network/firewall settings");
		console.error("4. Try direct connection (port 5432) instead of pooler (port 6543)");
		console.error("\nCurrent DATABASE_URL:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@"));
		process.exit(1);
	}
}

testConnection();
