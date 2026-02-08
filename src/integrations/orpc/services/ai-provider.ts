import { and, eq } from "drizzle-orm";
import z from "zod";
import * as schema from "@/integrations/drizzle/schema";
import type { Database } from "../context";

export const aiProviderSchema = z.enum(["openai", "anthropic", "gemini", "ollama", "vercel-ai-gateway"]);

export type AIProvider = z.infer<typeof aiProviderSchema>;

export const createAIProviderSchema = z.object({
	provider: aiProviderSchema,
	model: z.string().min(1),
	apiKey: z.string().min(1),
	baseUrl: z.string().url().optional().nullable(),
});

export const updateAIProviderSchema = z.object({
	id: z.string().uuid(),
	model: z.string().min(1).optional(),
	apiKey: z.string().min(1).optional(),
	baseUrl: z.string().url().optional().nullable(),
});

export const aiProviderService = {
	async list(db: Database, userId: string) {
		return db.query.aiProvider.findMany({
			where: eq(schema.aiProvider.userId, userId),
			orderBy: (aiProvider, { desc }) => [desc(aiProvider.createdAt)],
		});
	},

	async create(db: Database, userId: string, data: z.infer<typeof createAIProviderSchema>) {
		// If this provider should be active, deactivate all others first
		const [newProvider] = await db
			.insert(schema.aiProvider)
			.values({
				userId,
				provider: data.provider,
				model: data.model,
				apiKey: data.apiKey,
				baseUrl: data.baseUrl,
				isActive: false, // Start as inactive
			})
			.returning();

		return newProvider;
	},

	async update(db: Database, userId: string, data: z.infer<typeof updateAIProviderSchema>) {
		const [updated] = await db
			.update(schema.aiProvider)
			.set({
				...(data.model && { model: data.model }),
				...(data.apiKey && { apiKey: data.apiKey }),
				...(data.baseUrl !== undefined && { baseUrl: data.baseUrl }),
				updatedAt: new Date(),
			})
			.where(and(eq(schema.aiProvider.id, data.id), eq(schema.aiProvider.userId, userId)))
			.returning();

		return updated;
	},

	async delete(db: Database, userId: string, id: string) {
		await db
			.delete(schema.aiProvider)
			.where(and(eq(schema.aiProvider.id, id), eq(schema.aiProvider.userId, userId)));
	},

	async activate(db: Database, userId: string, id: string) {
		// First, deactivate all providers for this user
		await db
			.update(schema.aiProvider)
			.set({ isActive: false, updatedAt: new Date() })
			.where(eq(schema.aiProvider.userId, userId));

		// Then activate the selected one
		const [activated] = await db
			.update(schema.aiProvider)
			.set({ isActive: true, updatedAt: new Date() })
			.where(and(eq(schema.aiProvider.id, id), eq(schema.aiProvider.userId, userId)))
			.returning();

		return activated;
	},

	async getActive(db: Database, userId: string) {
		return db.query.aiProvider.findFirst({
			where: and(eq(schema.aiProvider.userId, userId), eq(schema.aiProvider.isActive, true)),
		});
	},
};
