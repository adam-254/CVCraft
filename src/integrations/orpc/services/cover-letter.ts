import { and, desc, eq } from "drizzle-orm";
import { db } from "@/integrations/drizzle/client";
import { coverLetter } from "@/integrations/drizzle/schema";
import { slugify } from "@/utils/string";

export const coverLetterService = {
	create: async (input: { userId: string; title: string; recipient?: string; content?: string; tags?: string[] }) => {
		const slug = slugify(input.title);

		const [newCoverLetter] = await db
			.insert(coverLetter)
			.values({
				title: input.title,
				slug,
				recipient: input.recipient || "",
				content: input.content || "",
				tags: input.tags || [],
				userId: input.userId,
			})
			.returning();

		return newCoverLetter;
	},

	findAll: async (input: { userId: string }) => {
		return await db
			.select()
			.from(coverLetter)
			.where(eq(coverLetter.userId, input.userId))
			.orderBy(desc(coverLetter.updatedAt));
	},

	findOne: async (input: { id: string; userId: string }) => {
		const [result] = await db
			.select()
			.from(coverLetter)
			.where(and(eq(coverLetter.id, input.id), eq(coverLetter.userId, input.userId)))
			.limit(1);

		if (!result) {
			throw new Error("Cover letter not found");
		}

		return result;
	},

	update: async (input: { id: string; userId: string; title?: string; recipient?: string; content?: string; tags?: string[] }) => {
		const updateData: Partial<{
			title: string;
			slug: string;
			recipient: string;
			content: string;
			tags: string[];
		}> = {};

		if (input.title !== undefined) {
			updateData.title = input.title;
			updateData.slug = slugify(input.title);
		}
		if (input.recipient !== undefined) updateData.recipient = input.recipient;
		if (input.content !== undefined) updateData.content = input.content;
		if (input.tags !== undefined) updateData.tags = input.tags;

		const [updated] = await db
			.update(coverLetter)
			.set(updateData)
			.where(and(eq(coverLetter.id, input.id), eq(coverLetter.userId, input.userId)))
			.returning();

		if (!updated) {
			throw new Error("Cover letter not found");
		}

		return updated;
	},

	remove: async (input: { id: string; userId: string }) => {
		const [deleted] = await db
			.delete(coverLetter)
			.where(and(eq(coverLetter.id, input.id), eq(coverLetter.userId, input.userId)))
			.returning();

		if (!deleted) {
			throw new Error("Cover letter not found");
		}
	},
};
