import { and, eq } from "drizzle-orm";
import z from "zod";
import * as schema from "@/integrations/drizzle/schema";

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

export const list = async (context: { db: any; user: { id: string } }) => {
	return await context.db
		.select({
			id: schema.aiProvider.id,
			provider: schema.aiProvider.provider,
			model: schema.aiProvider.model,
			baseUrl: schema.aiProvider.baseUrl,
			isActive: schema.aiProvider.isActive,
			createdAt: schema.aiProvider.createdAt,
			updatedAt: schema.aiProvider.updatedAt,
		})
		.from(schema.aiProvider)
		.where(eq(schema.aiProvider.userId, context.user.id))
		.orderBy(schema.aiProvider.createdAt);
};

export const create = async (
	input: z.infer<typeof createAIProviderSchema>,
	context: { db: any; user: { id: string } },
) => {
	const [newProvider] = await context.db
		.insert(schema.aiProvider)
		.values({
			userId: context.user.id,
			provider: input.provider,
			model: input.model,
			apiKey: input.apiKey,
			baseUrl: input.baseUrl,
			isActive: false, // Start as inactive
		})
		.returning({
			id: schema.aiProvider.id,
			provider: schema.aiProvider.provider,
			model: schema.aiProvider.model,
			baseUrl: schema.aiProvider.baseUrl,
			isActive: schema.aiProvider.isActive,
			createdAt: schema.aiProvider.createdAt,
			updatedAt: schema.aiProvider.updatedAt,
		});

	return newProvider;
};

export const update = async (
	input: z.infer<typeof updateAIProviderSchema>,
	context: { db: any; user: { id: string } },
) => {
	const updateData: any = { updatedAt: new Date() };
	
	if (input.model !== undefined) updateData.model = input.model;
	if (input.apiKey !== undefined) updateData.apiKey = input.apiKey;
	if (input.baseUrl !== undefined) updateData.baseUrl = input.baseUrl;

	const [updated] = await context.db
		.update(schema.aiProvider)
		.set(updateData)
		.where(and(eq(schema.aiProvider.id, input.id), eq(schema.aiProvider.userId, context.user.id)))
		.returning({
			id: schema.aiProvider.id,
			provider: schema.aiProvider.provider,
			model: schema.aiProvider.model,
			baseUrl: schema.aiProvider.baseUrl,
			isActive: schema.aiProvider.isActive,
			createdAt: schema.aiProvider.createdAt,
			updatedAt: schema.aiProvider.updatedAt,
		});

	if (!updated) {
		throw new Error("AI provider not found");
	}

	return updated;
};

export const remove = async (input: { id: string }, context: { db: any; user: { id: string } }) => {
	const [deleted] = await context.db
		.delete(schema.aiProvider)
		.where(and(eq(schema.aiProvider.id, input.id), eq(schema.aiProvider.userId, context.user.id)))
		.returning();

	if (!deleted) {
		throw new Error("AI provider not found");
	}

	return { success: true };
};

export const activate = async (input: { id: string }, context: { db: any; user: { id: string } }) => {
	// First, deactivate all providers for this user
	await context.db
		.update(schema.aiProvider)
		.set({ isActive: false, updatedAt: new Date() })
		.where(eq(schema.aiProvider.userId, context.user.id));

	// Then activate the selected one
	const [activated] = await context.db
		.update(schema.aiProvider)
		.set({ isActive: true, updatedAt: new Date() })
		.where(and(eq(schema.aiProvider.id, input.id), eq(schema.aiProvider.userId, context.user.id)))
		.returning({
			id: schema.aiProvider.id,
			provider: schema.aiProvider.provider,
			model: schema.aiProvider.model,
			baseUrl: schema.aiProvider.baseUrl,
			isActive: schema.aiProvider.isActive,
			createdAt: schema.aiProvider.createdAt,
			updatedAt: schema.aiProvider.updatedAt,
		});

	if (!activated) {
		throw new Error("AI provider not found");
	}

	return activated;
};

export const getActive = async (context: { db: any; user: { id: string } }) => {
	const [result] = await context.db
		.select({
			id: schema.aiProvider.id,
			provider: schema.aiProvider.provider,
			model: schema.aiProvider.model,
			baseUrl: schema.aiProvider.baseUrl,
			isActive: schema.aiProvider.isActive,
			createdAt: schema.aiProvider.createdAt,
			updatedAt: schema.aiProvider.updatedAt,
		})
		.from(schema.aiProvider)
		.where(and(eq(schema.aiProvider.userId, context.user.id), eq(schema.aiProvider.isActive, true)))
		.limit(1);

	return result || null;
};

export const aiProviderService = {
	list,
	create,
	update,
	remove,
	activate,
	getActive,
};
