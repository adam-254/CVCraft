import { supabase } from "@/integrations/supabase/client";
import { slugify, generateId } from "@/utils/string";

export const coverLetterDirectService = {
	create: async (input: { userId: string; title: string; recipient?: string; content?: string; tags?: string[] }) => {
		const slug = slugify(input.title);
		const id = generateId();

		try {
			const { data, error } = await supabase
				.from("cover_letter")
				.insert({
					id,
					title: input.title,
					slug,
					recipient: input.recipient || null,
					content: input.content || "",
					tags: input.tags || [],
					user_id: input.userId,
				})
				.select()
				.single();

			if (error) throw error;
			if (!data) throw new Error("Failed to create cover letter");

			return {
				id: data.id,
				title: data.title,
				slug: data.slug,
				recipient: data.recipient,
				content: data.content,
				tags: data.tags,
				isPublic: data.is_public,
				isLocked: data.is_locked,
				password: data.password,
				userId: data.user_id,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at),
			};
		} catch (error) {
			console.error("Cover letter creation error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to create cover letter: ${errorMessage}`);
		}
	},

	findAll: async (input: { userId: string }) => {
		try {
			const { data, error } = await supabase
				.from("cover_letter")
				.select("*")
				.eq("user_id", input.userId)
				.order("updated_at", { ascending: false });

			if (error) throw error;

			return (data || []).map((item) => ({
				id: item.id,
				title: item.title,
				slug: item.slug,
				recipient: item.recipient,
				content: item.content,
				tags: item.tags,
				isPublic: item.is_public,
				isLocked: item.is_locked,
				password: item.password,
				userId: item.user_id,
				createdAt: new Date(item.created_at),
				updatedAt: new Date(item.updated_at),
			}));
		} catch (error) {
			console.error("Cover letter list error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to fetch cover letters: ${errorMessage}`);
		}
	},

	findOne: async (input: { id: string; userId: string }) => {
		try {
			const { data, error } = await supabase
				.from("cover_letter")
				.select("*")
				.eq("id", input.id)
				.eq("user_id", input.userId)
				.single();

			if (error) throw error;
			if (!data) throw new Error("Cover letter not found");

			return {
				id: data.id,
				title: data.title,
				slug: data.slug,
				recipient: data.recipient,
				content: data.content,
				tags: data.tags,
				isPublic: data.is_public,
				isLocked: data.is_locked,
				password: data.password,
				userId: data.user_id,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at),
			};
		} catch (error) {
			console.error("Cover letter fetch error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to fetch cover letter: ${errorMessage}`);
		}
	},

	update: async (input: { id: string; userId: string; title?: string; recipient?: string; content?: string; tags?: string[] }) => {
		const updateData: Record<string, any> = {};

		if (input.title !== undefined) {
			updateData.title = input.title;
			updateData.slug = slugify(input.title);
		}
		if (input.recipient !== undefined) updateData.recipient = input.recipient;
		if (input.content !== undefined) updateData.content = input.content;
		if (input.tags !== undefined) updateData.tags = input.tags;

		try {
			const { data, error } = await supabase
				.from("cover_letter")
				.update(updateData)
				.eq("id", input.id)
				.eq("user_id", input.userId)
				.select()
				.single();

			if (error) throw error;
			if (!data) throw new Error("Cover letter not found");

			return {
				id: data.id,
				title: data.title,
				slug: data.slug,
				recipient: data.recipient,
				content: data.content,
				tags: data.tags,
				isPublic: data.is_public,
				isLocked: data.is_locked,
				password: data.password,
				userId: data.user_id,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at),
			};
		} catch (error) {
			console.error("Cover letter update error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to update cover letter: ${errorMessage}`);
		}
	},

	remove: async (input: { id: string; userId: string }) => {
		try {
			const { error } = await supabase
				.from("cover_letter")
				.delete()
				.eq("id", input.id)
				.eq("user_id", input.userId);

			if (error) throw error;
		} catch (error) {
			console.error("Cover letter delete error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to delete cover letter: ${errorMessage}`);
		}
	},
};