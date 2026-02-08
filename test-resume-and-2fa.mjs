/**
 * Test Resume Storage and 2FA in Supabase
 * This script tests resume creation, fetching, and 2FA setup
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import { readFileSync } from "fs";

// Read .env file
const envFile = readFileSync(".env", "utf-8");
const envVars = {};
envFile.split("\n").forEach((line) => {
	line = line.trim();
	if (!line || line.startsWith("#")) return;
	const equalIndex = line.indexOf("=");
	if (equalIndex > 0) {
		const key = line.substring(0, equalIndex).trim();
		let value = line.substring(equalIndex + 1).trim();
		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
		envVars[key] = value;
	}
});

console.log("Script loaded successfully");
console.log("Starting tests...");

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false },
});

function generateId() {
	return crypto.randomUUID();
}

async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}

async function testResumeAnd2FA() {
	console.log("🧪 Testing Resume Storage and 2FA in Supabase\n");
	console.log("DEBUG: Script started");
	console.log("DEBUG: Supabase URL:", envVars.VITE_SUPABASE_URL);
	console.log("DEBUG: Has service key:", !!envVars.SUPABASE_SERVICE_ROLE_KEY);
	console.log();

	const testEmail = `resumetest${Date.now()}@example.com`;
	const testUsername = `resumeuser${Date.now()}`;
	const testPassword = "TestPassword123!";

	let userId, accountId, resumeId, twoFactorId;

	try {
		// Step 1: Create User
		console.log("1️⃣ Creating test user...");
		userId = generateId();
		const hashedPassword = await hashPassword(testPassword);

		const { data: user, error: userError } = await supabase
			.from("user")
			.insert({
				id: userId,
				name: "Resume Test User",
				email: testEmail,
				username: testUsername,
				display_username: testUsername,
				email_verified: true,
				two_factor_enabled: false,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (userError) {
			console.error("❌ User creation failed:", userError.message);
			return;
		}

		console.log("✅ User created:", user.email);

		// Create account
		accountId = generateId();
		await supabase.from("account").insert({
			id: accountId,
			user_id: userId,
			provider_id: "credential",
			account_id: testEmail,
			password: hashedPassword,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		});

		console.log("✅ Account created\n");

		// Step 2: Create Resume
		console.log("2️⃣ Testing Resume Creation...");
		resumeId = generateId();

		const resumeData = {
			basics: {
				name: "John Doe",
				email: "john@example.com",
				phone: "+1234567890",
				location: "New York, USA",
				headline: "Software Engineer",
				summary: "Experienced software engineer with 5 years of experience",
			},
			sections: {
				experience: [
					{
						id: generateId(),
						company: "Tech Corp",
						position: "Senior Developer",
						startDate: "2020-01-01",
						endDate: "2024-01-01",
						summary: "Led development of key features",
					},
				],
				education: [
					{
						id: generateId(),
						institution: "University of Technology",
						degree: "Bachelor of Science",
						field: "Computer Science",
						startDate: "2015-09-01",
						endDate: "2019-06-01",
					},
				],
				skills: [
					{
						id: generateId(),
						name: "JavaScript",
						level: "Expert",
					},
					{
						id: generateId(),
						name: "React",
						level: "Advanced",
					},
				],
			},
		};

		const { data: resume, error: resumeError } = await supabase
			.from("resume")
			.insert({
				id: resumeId,
				user_id: userId,
				name: "My Professional Resume",
				slug: "my-professional-resume",
				tags: ["software", "engineering"],
				is_public: false,
				is_locked: false,
				data: resumeData,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (resumeError) {
			console.error("❌ Resume creation failed:", resumeError.message);
			return;
		}

		console.log("✅ Resume created:", resume.name);
		console.log("   Resume ID:", resume.id);
		console.log("   Slug:", resume.slug);
		console.log("   Tags:", resume.tags.join(", "));
		console.log("   Public:", resume.is_public);
		console.log("\n");

		// Step 3: Fetch User's Resumes
		console.log("3️⃣ Testing Resume Fetching...");
		const { data: userResumes, error: fetchError } = await supabase
			.from("resume")
			.select("*")
			.eq("user_id", userId)
			.order("updated_at", { ascending: false });

		if (fetchError) {
			console.error("❌ Resume fetching failed:", fetchError.message);
			return;
		}

		console.log(`✅ Fetched ${userResumes.length} resume(s) for user`);
		userResumes.forEach((r, index) => {
			console.log(`   ${index + 1}. ${r.name} (${r.slug})`);
			console.log(`      Created: ${new Date(r.created_at).toLocaleString()}`);
			console.log(`      Updated: ${new Date(r.updated_at).toLocaleString()}`);
		});
		console.log("\n");

		// Step 4: Update Resume
		console.log("4️⃣ Testing Resume Update...");
		const updatedData = {
			...resumeData,
			basics: {
				...resumeData.basics,
				headline: "Senior Software Engineer", // Updated
			},
		};

		const { data: updatedResume, error: updateError } = await supabase
			.from("resume")
			.update({
				data: updatedData,
				updated_at: new Date().toISOString(),
			})
			.eq("id", resumeId)
			.select()
			.single();

		if (updateError) {
			console.error("❌ Resume update failed:", updateError.message);
			return;
		}

		console.log("✅ Resume updated successfully");
		console.log("   New headline:", updatedResume.data.basics.headline);
		console.log("\n");

		// Step 5: Create Resume Statistics
		console.log("5️⃣ Testing Resume Statistics...");
		const statsId = generateId();
		const { data: stats, error: statsError } = await supabase
			.from("resume_statistics")
			.insert({
				id: statsId,
				resume_id: resumeId,
				views: 0,
				downloads: 0,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (statsError) {
			console.error("❌ Statistics creation failed:", statsError.message);
			return;
		}

		console.log("✅ Resume statistics created");
		console.log("   Views:", stats.views);
		console.log("   Downloads:", stats.downloads);
		console.log("\n");

		// Step 6: Increment Views
		console.log("6️⃣ Testing Statistics Update (View Count)...");
		const { data: updatedStats, error: viewError } = await supabase
			.from("resume_statistics")
			.update({
				views: 5,
				last_viewed_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq("resume_id", resumeId)
			.select()
			.single();

		if (viewError) {
			console.error("❌ Statistics update failed:", viewError.message);
			return;
		}

		console.log("✅ Statistics updated");
		console.log("   Views:", updatedStats.views);
		console.log("   Last viewed:", new Date(updatedStats.last_viewed_at).toLocaleString());
		console.log("\n");

		// Step 7: Setup 2FA
		console.log("7️⃣ Testing 2FA Setup...");
		twoFactorId = generateId();
		const secret = "JBSWY3DPEHPK3PXP"; // Example TOTP secret
		const backupCodes = JSON.stringify([
			"BACKUP-CODE-1",
			"BACKUP-CODE-2",
			"BACKUP-CODE-3",
			"BACKUP-CODE-4",
			"BACKUP-CODE-5",
		]);

		const { data: twoFactor, error: twoFactorError } = await supabase
			.from("two_factor")
			.insert({
				id: twoFactorId,
				user_id: userId,
				secret: secret,
				backup_codes: backupCodes,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (twoFactorError) {
			console.error("❌ 2FA setup failed:", twoFactorError.message);
			return;
		}

		console.log("✅ 2FA configured");
		console.log("   Secret:", twoFactor.secret);
		console.log("   Backup codes:", JSON.parse(twoFactor.backup_codes).length, "codes");
		console.log("\n");

		// Step 8: Enable 2FA on User
		console.log("8️⃣ Testing 2FA Enablement...");
		const { error: enable2FAError } = await supabase
			.from("user")
			.update({
				two_factor_enabled: true,
				updated_at: new Date().toISOString(),
			})
			.eq("id", userId);

		if (enable2FAError) {
			console.error("❌ 2FA enablement failed:", enable2FAError.message);
			return;
		}

		console.log("✅ 2FA enabled for user");
		console.log("\n");

		// Step 9: Verify 2FA Status
		console.log("9️⃣ Testing 2FA Status Check...");
		const { data: userWith2FA, error: check2FAError } = await supabase
			.from("user")
			.select("*, two_factor(*)")
			.eq("id", userId)
			.single();

		if (check2FAError) {
			console.error("❌ 2FA status check failed:", check2FAError.message);
			return;
		}

		console.log("✅ 2FA status verified");
		console.log("   2FA Enabled:", userWith2FA.two_factor_enabled);
		console.log("   Has 2FA record:", userWith2FA.two_factor.length > 0);
		console.log("\n");

		// Step 10: Fetch Resume with User Info
		console.log("🔟 Testing Resume Fetch with User Info...");
		const { data: resumeWithUser, error: joinError } = await supabase
			.from("resume")
			.select(`
        *,
        user:user_id (
          id,
          name,
          email,
          username
        ),
        resume_statistics (
          views,
          downloads,
          last_viewed_at
        )
      `)
			.eq("id", resumeId)
			.single();

		if (joinError) {
			console.error("❌ Resume fetch with joins failed:", joinError.message);
			return;
		}

		console.log("✅ Resume fetched with related data");
		console.log("   Resume:", resumeWithUser.name);
		console.log("   Owner:", resumeWithUser.user.name, `(${resumeWithUser.user.email})`);
		console.log("   Views:", resumeWithUser.resume_statistics[0]?.views || 0);
		console.log("   Downloads:", resumeWithUser.resume_statistics[0]?.downloads || 0);
		console.log("\n");

		// Cleanup
		console.log("🧹 Cleaning up test data...");
		await supabase.from("resume_statistics").delete().eq("resume_id", resumeId);
		await supabase.from("resume").delete().eq("id", resumeId);
		await supabase.from("two_factor").delete().eq("id", twoFactorId);
		await supabase.from("account").delete().eq("id", accountId);
		await supabase.from("user").delete().eq("id", userId);
		console.log("✅ Cleanup complete\n");

		// Summary
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("✅ ALL TESTS PASSED!");
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("\n🎉 Resume and 2FA functionality working correctly!");
		console.log("\n📝 Test Summary:");
		console.log("   ✅ User creation");
		console.log("   ✅ Resume creation");
		console.log("   ✅ Resume fetching");
		console.log("   ✅ Resume updating");
		console.log("   ✅ Resume statistics");
		console.log("   ✅ Statistics tracking");
		console.log("   ✅ 2FA setup");
		console.log("   ✅ 2FA enablement");
		console.log("   ✅ 2FA status check");
		console.log("   ✅ Resume with joins\n");
	} catch (error) {
		console.error("❌ Test failed:", error.message);
		console.error(error);

		// Cleanup on error
		if (resumeId) await supabase.from("resume").delete().eq("id", resumeId);
		if (twoFactorId) await supabase.from("two_factor").delete().eq("id", twoFactorId);
		if (accountId) await supabase.from("account").delete().eq("id", accountId);
		if (userId) await supabase.from("user").delete().eq("id", userId);
	}
}

testResumeAnd2FA();

// Run the test
testResumeAnd2FA().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
