import z from "zod";
import { protectedProcedure } from "../context";
import { aiProviderService, createAIProviderSchema, updateAIProviderSchema } from "../services/ai-provider";

export const aiProviderRouter = {
	list: protectedProcedure
		.route({
			method: "GET",
			path: "/ai-provider/list",
			tags: ["AI Provider"],
			summary: "Get all AI providers",
			description: "Retrieves all AI providers for the authenticated user",
		})
		.output(
			z.array(
				z.object({
					id: z.string(),
					provider: z.string(),
					model: z.string(),
					baseUrl: z.string().nullable(),
					isActive: z.boolean(),
					createdAt: z.date(),
					updatedAt: z.date(),
				}),
			),
		)
		.handler(async ({ context }) => {
			return await aiProviderService.list(context);
		}),

	create: protectedProcedure
		.route({
			method: "POST",
			path: "/ai-provider/create",
			tags: ["AI Provider"],
			summary: "Create a new AI provider",
			description: "Creates a new AI provider configuration for the authenticated user",
		})
		.input(createAIProviderSchema)
		.output(
			z.object({
				id: z.string(),
				provider: z.string(),
				model: z.string(),
				baseUrl: z.string().nullable(),
				isActive: z.boolean(),
				createdAt: z.date(),
				updatedAt: z.date(),
			}),
		)
		.handler(async ({ context, input }) => {
			return await aiProviderService.create(input, context);
		}),

	update: protectedProcedure
		.route({
			method: "PUT",
			path: "/ai-provider/{id}",
			tags: ["AI Provider"],
			summary: "Update an AI provider",
			description: "Updates an existing AI provider configuration",
		})
		.input(updateAIProviderSchema)
		.output(z.void())
		.handler(async ({ context, input }) => {
			await aiProviderService.update(input, context);
		}),

	delete: protectedProcedure
		.route({
			method: "DELETE",
			path: "/ai-provider/{id}",
			tags: ["AI Provider"],
			summary: "Delete an AI provider",
			description: "Deletes an AI provider configuration by its ID",
		})
		.input(z.object({ id: z.string().uuid() }))
		.output(z.void())
		.handler(async ({ context, input }) => {
			await aiProviderService.remove(input, context);
		}),

	activate: protectedProcedure
		.route({
			method: "POST",
			path: "/ai-provider/{id}/activate",
			tags: ["AI Provider"],
			summary: "Activate an AI provider",
			description: "Sets an AI provider as the active one for the user",
		})
		.input(z.object({ id: z.string().uuid() }))
		.output(z.void())
		.handler(async ({ context, input }) => {
			await aiProviderService.activate(input, context);
		}),

	getActive: protectedProcedure
		.route({
			method: "GET",
			path: "/ai-provider/active",
			tags: ["AI Provider"],
			summary: "Get active AI provider",
			description: "Retrieves the currently active AI provider for the user",
		})
		.output(
			z.object({
				id: z.string(),
				provider: z.string(),
				model: z.string(),
				baseUrl: z.string().nullable(),
				isActive: z.boolean(),
				createdAt: z.date(),
				updatedAt: z.date(),
			}).nullable(),
		)
		.handler(async ({ context }) => {
			return await aiProviderService.getActive(context);
		}),
};
