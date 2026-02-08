import { and, desc, eq } from "drizzle-orm";
import { coverLetter } from "@/integrations/drizzle/schema";
import { slugify } from "@/utils/string";

export const create = async (
	input: { title: string; recipient?: string; content: string; tags?: string[] },
	context: { db: any; user: { id: string } },
) => {
	const slug = slugify(input.title);

	const [newCoverLetter] = await context.db
		.insert(coverLetter)
		.values({
			title: input.title,
			slug,
			recipient: input.recipient || "",
			content: input.content,
			tags: input.tags || [],
			userId: context.user.id,
		})
		.returning();

	return newCoverLetter;
};

export const findAll = async (context: { db: any; user: { id: string } }) => {
	return await context.db
		.select()
		.from(coverLetter)
		.where(eq(coverLetter.userId, context.user.id))
		.orderBy(desc(coverLetter.updatedAt));
};

export const findOne = async (input: { id: string }, context: { db: any; user: { id: string } }) => {
	const [result] = await context.db
		.select()
		.from(coverLetter)
		.where(and(eq(coverLetter.id, input.id), eq(coverLetter.userId, context.user.id)))
		.limit(1);

	if (!result) {
		throw new Error("Cover letter not found");
	}

	return result;
};

export const update = async (
	input: { id: string; title?: string; recipient?: string; content?: string; tags?: string[] },
	context: { db: any; user: { id: string } },
) => {
	const updateData: any = {};

	if (input.title !== undefined) {
		updateData.title = input.title;
		updateData.slug = slugify(input.title);
	}
	if (input.recipient !== undefined) updateData.recipient = input.recipient;
	if (input.content !== undefined) updateData.content = input.content;
	if (input.tags !== undefined) updateData.tags = input.tags;

	const [updated] = await context.db
		.update(coverLetter)
		.set(updateData)
		.where(and(eq(coverLetter.id, input.id), eq(coverLetter.userId, context.user.id)))
		.returning();

	if (!updated) {
		throw new Error("Cover letter not found");
	}

	return updated;
};

export const remove = async (input: { id: string }, context: { db: any; user: { id: string } }) => {
	const [deleted] = await context.db
		.delete(coverLetter)
		.where(and(eq(coverLetter.id, input.id), eq(coverLetter.userId, context.user.id)))
		.returning();

	if (!deleted) {
		throw new Error("Cover letter not found");
	}

	return { success: true };
};

export const coverLetterService = {
	create,
	findAll,
	findOne,
	update,
	remove,
};
