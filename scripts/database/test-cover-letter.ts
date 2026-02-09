import { coverLetterDirectService } from "@/integrations/orpc/services/cover-letter-direct";

async function testCoverLetterCreation() {
	try {
		console.log("Testing cover letter creation...");

		const testUserId = "00000000-0000-0000-0000-000000000001";
		
		const coverLetter = await coverLetterDirectService.create({
			userId: testUserId,
			title: "Test Cover Letter",
			content: "This is a test cover letter content.",
			recipient: "Test Company",
			tags: ["test", "software"]
		});

		console.log("✓ Cover letter created successfully:", coverLetter);

		// Test listing cover letters
		const coverLetters = await coverLetterDirectService.findAll({ userId: testUserId });
		console.log("✓ Cover letters retrieved:", coverLetters.length, "found");

		console.log("Cover letter functionality is working!");
	} catch (error) {
		console.error("Cover letter test failed:", error);
		throw error;
	}
}

// Run the test
testCoverLetterCreation()
	.then(() => {
		console.log("Cover letter test completed successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Cover letter test failed:", error);
		process.exit(1);
	});

export { testCoverLetterCreation };