import { eq } from "drizzle-orm";
import { directDb } from "@/integrations/drizzle/direct-client";
import { user } from "@/integrations/drizzle/schema";

async function createTestUser() {
	try {
		const testUserId = "00000000-0000-0000-0000-000000000001";

		// Check if test user already exists
		const existingUser = await directDb.select().from(user).where(eq(user.id, testUserId)).limit(1);

		if (existingUser.length > 0) {
			console.log("Test user already exists:", existingUser[0]);
			return existingUser[0];
		}

		// Create test user
		const [newUser] = await directDb
			.insert(user)
			.values({
				id: testUserId,
				name: "Test User",
				email: "test@example.com",
				username: "testuser",
				displayUsername: "testuser",
				emailVerified: true,
			})
			.returning();

		console.log("Created test user:", newUser);
		return newUser;
	} catch (error) {
		console.error("Error creating test user:", error);
		throw error;
	}
}

// Run the function
createTestUser()
	.then(() => {
		console.log("Test user creation completed");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Test user creation failed:", error);
		process.exit(1);
	});

export { createTestUser };
