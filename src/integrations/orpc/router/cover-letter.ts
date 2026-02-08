import { z } from "zod";
import { orpc } from "../server";
import { coverLetterService } from "../services/cover-letter";

export const coverLetterRouter = {
	create: orpc.route({
		method: "POST",
		path: "/cover-letters",
		summary: "Create a new cover letter",
		description: "Creates a new cover letter for the authenticated user",
		input: z.object({
			title: z.string().min(1, "Title is required"),
			recipient: z.string().optional(),
			content: z.string().min(1, "Content is required"),
			tags: z.array(z.string()).optional(),
		}),
		output: z.object({
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
		func: coverLetterService.create,
	}),

	findAll: orpc.route({
		method: "GET",
		path: "/cover-letters",
		summary: "Get all cover letters",
		description: "Retrieves all cover letters for the authenticated user",
		output: z.array(
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
		func: coverLetterService.findAll,
	}),

	findOne: orpc.route({
		method: "GET",
		path: "/cover-letters/:id",
		summary: "Get a cover letter by ID",
		description: "Retrieves a specific cover letter by its ID",
		input: z.object({
			id: z.string().uuid(),
		}),
		output: z.object({
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
		func: coverLetterService.findOne,
	}),

	update: orpc.route({
		method: "PATCH",
		path: "/cover-letters/:id",
		summary: "Update a cover letter",
		description: "Updates an existing cover letter",
		input: z.object({
			id: z.string().uuid(),
			title: z.string().min(1).optional(),
			recipient: z.string().optional(),
			content: z.string().min(1).optional(),
			tags: z.array(z.string()).optional(),
		}),
		output: z.object({
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
		func: coverLetterService.update,
	}),

	delete: orpc.route({
		method: "DELETE",
		path: "/cover-letters/:id",
		summary: "Delete a cover letter",
		description: "Deletes a cover letter by its ID",
		input: z.object({
			id: z.string().uuid(),
		}),
		output: z.object({
			success: z.boolean(),
		}),
		func: coverLetterService.remove,
	}),
};
