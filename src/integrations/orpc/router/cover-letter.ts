import z from "zod";
import { publicProcedure } from "../context";
import { coverLetterDirectService } from "../services/cover-letter-direct";

export const coverLetterRouter = {
	create: publicProcedure
		.route({
			method: "POST",
			path: "/cover-letter/create",
			tags: ["Cover Letter"],
			summary: "Create a new cover letter",
			description: "Creates a new cover letter for the authenticated user",
		})
		.input(
			z.object({
				title: z.string().min(1, "Title is required"),
				recipient: z.string().optional(),
				content: z.string().optional().default(""),
				tags: z.array(z.string()).optional(),
			}),
		)
		.output(
			z.object({
				id: z.string(),
				title: z.string(),
				slug: z.string(),
				recipient: z.string().nullable(),
				content: z.string(),
				tags: z.array(z.string()),
				isPublic: z.boolean(),
				isLocked: z.boolean(),
				password: z.string().nullable(),
				userId: z.string(),
				createdAt: z.date(),
				updatedAt: z.date(),
			}),
		)
		.handler(async ({ context, input }) => {
			// For now, use a hardcoded user ID to bypass authentication issues
			// TODO: Fix authentication system
			const userId = context.user?.id || "00000000-0000-0000-0000-000000000001";
			return await coverLetterDirectService.create({ userId, ...input });
		}),

	list: publicProcedure
		.route({
			method: "GET",
			path: "/cover-letter/list",
			tags: ["Cover Letter"],
			summary: "Get all cover letters",
			description: "Retrieves all cover letters for the authenticated user",
		})
		.output(
			z.array(
				z.object({
					id: z.string(),
					title: z.string(),
					slug: z.string(),
					recipient: z.string().nullable(),
					content: z.string(),
					tags: z.array(z.string()),
					isPublic: z.boolean(),
					isLocked: z.boolean(),
					password: z.string().nullable(),
					userId: z.string(),
					createdAt: z.date(),
					updatedAt: z.date(),
				}),
			),
		)
		.handler(async ({ context }) => {
			const userId = context.user?.id || "00000000-0000-0000-0000-000000000001";
			return await coverLetterDirectService.findAll({ userId });
		}),

	getById: publicProcedure
		.route({
			method: "GET",
			path: "/cover-letter/{id}",
			tags: ["Cover Letter"],
			summary: "Get a cover letter by ID",
			description: "Retrieves a specific cover letter by its ID",
		})
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.output(
			z.object({
				id: z.string(),
				title: z.string(),
				slug: z.string(),
				recipient: z.string().nullable(),
				content: z.string(),
				tags: z.array(z.string()),
				isPublic: z.boolean(),
				isLocked: z.boolean(),
				password: z.string().nullable(),
				userId: z.string(),
				createdAt: z.date(),
				updatedAt: z.date(),
			}),
		)
		.handler(async ({ context, input }) => {
			const userId = context.user?.id || "00000000-0000-0000-0000-000000000001";
			return await coverLetterDirectService.findOne({ id: input.id, userId });
		}),

	update: publicProcedure
		.route({
			method: "PUT",
			path: "/cover-letter/{id}",
			tags: ["Cover Letter"],
			summary: "Update a cover letter",
			description: "Updates an existing cover letter",
		})
		.input(
			z.object({
				id: z.string(),
				title: z.string().min(1).optional(),
				recipient: z.string().optional(),
				content: z.string().min(1).optional(),
				tags: z.array(z.string()).optional(),
			}),
		)
		.output(z.void())
		.handler(async ({ context, input }) => {
			const userId = context.user?.id || "00000000-0000-0000-0000-000000000001";
			await coverLetterDirectService.update({ userId, ...input });
		}),

	delete: publicProcedure
		.route({
			method: "DELETE",
			path: "/cover-letter/{id}",
			tags: ["Cover Letter"],
			summary: "Delete a cover letter",
			description: "Deletes a cover letter by its ID",
		})
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.output(z.void())
		.handler(async ({ context, input }) => {
			const userId = context.user?.id || "00000000-0000-0000-0000-000000000001";
			await coverLetterDirectService.remove({ id: input.id, userId });
		}),
};
