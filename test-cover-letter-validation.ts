import z from "zod";

// This is the output schema from the router
const coverLetterOutputSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	recipient: z.string().nullable(),
	content: z.string(),
	tags: z.array(z.string()),
	isPublic: z.boolean(),
	isLocked: z.boolean(),
	password: z.string().nullable(),
	senderName: z.string().nullable(),
	senderAddress: z.string().nullable(),
	senderCity: z.string().nullable(),
	senderPhone: z.string().nullable(),
	senderEmail: z.string().nullable(),
	companyName: z.string().nullable(),
	companyAddress: z.string().nullable(),
	companyCity: z.string().nullable(),
	hiringManager: z.string().nullable(),
	position: z.string().nullable(),
	userId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Test data that might be coming from the database
const testData = {
	id: "test-id",
	title: "Test Cover Letter",
	slug: "test-cover-letter",
	recipient: null,
	content: "Test content",
	tags: [],
	isPublic: false,
	isLocked: false,
	password: null,
	senderName: null,
	senderAddress: null,
	senderCity: null,
	senderPhone: null,
	senderEmail: null,
	companyName: null,
	companyAddress: null,
	companyCity: null,
	hiringManager: null,
	position: null,
	userId: "user-id",
	createdAt: new Date(),
	updatedAt: new Date(),
};

console.log("Testing validation...");
const result = coverLetterOutputSchema.safeParse(testData);

if (result.success) {
	console.log("✅ Validation passed!");
} else {
	console.log("❌ Validation failed:");
	console.log(JSON.stringify(result.error.issues, null, 2));
}
