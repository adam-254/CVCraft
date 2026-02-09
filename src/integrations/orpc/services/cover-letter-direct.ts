import { supabase } from "@/integrations/supabase/client";
import { generateId, slugify } from "@/utils/string";

type CoverLetterUpdateInput = {
	id: string;
	userId: string;
	title?: string;
	recipient?: string;
	content?: string;
	tags?: string[];
	senderName?: string;
	senderAddress?: string;
	senderCity?: string;
	senderPhone?: string;
	senderEmail?: string;
	companyName?: string;
	companyAddress?: string;
	companyCity?: string;
	hiringManager?: string;
	position?: string;
};

const mapCoverLetterFromDb = (data: any) => ({
	id: data.id,
	title: data.title,
	slug: data.slug,
	recipient: data.recipient ?? null,
	content: data.content ?? "",
	tags: data.tags ?? [],
	isPublic: data.is_public ?? false,
	isLocked: data.is_locked ?? false,
	password: data.password ?? null,
	senderName: data.sender_name ?? null,
	senderAddress: data.sender_address ?? null,
	senderCity: data.sender_city ?? null,
	senderPhone: data.sender_phone ?? null,
	senderEmail: data.sender_email ?? null,
	companyName: data.company_name ?? null,
	companyAddress: data.company_address ?? null,
	companyCity: data.company_city ?? null,
	hiringManager: data.hiring_manager ?? null,
	position: data.position ?? null,
	userId: data.user_id,
	createdAt: new Date(data.created_at),
	updatedAt: new Date(data.updated_at),
});

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

			return mapCoverLetterFromDb(data);
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

			return (data || []).map(mapCoverLetterFromDb);
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

			return mapCoverLetterFromDb(data);
		} catch (error) {
			console.error("Cover letter fetch error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to fetch cover letter: ${errorMessage}`);
		}
	},

	update: async (input: CoverLetterUpdateInput) => {
		const updateData: Record<string, any> = {};

		if (input.title !== undefined) {
			updateData.title = input.title;
			updateData.slug = slugify(input.title);
		}
		if (input.recipient !== undefined) updateData.recipient = input.recipient;
		if (input.content !== undefined) updateData.content = input.content;
		if (input.tags !== undefined) updateData.tags = input.tags;
		if (input.senderName !== undefined) updateData.sender_name = input.senderName;
		if (input.senderAddress !== undefined) updateData.sender_address = input.senderAddress;
		if (input.senderCity !== undefined) updateData.sender_city = input.senderCity;
		if (input.senderPhone !== undefined) updateData.sender_phone = input.senderPhone;
		if (input.senderEmail !== undefined) updateData.sender_email = input.senderEmail;
		if (input.companyName !== undefined) updateData.company_name = input.companyName;
		if (input.companyAddress !== undefined) updateData.company_address = input.companyAddress;
		if (input.companyCity !== undefined) updateData.company_city = input.companyCity;
		if (input.hiringManager !== undefined) updateData.hiring_manager = input.hiringManager;
		if (input.position !== undefined) updateData.position = input.position;

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

			return mapCoverLetterFromDb(data);
		} catch (error) {
			console.error("Cover letter update error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to update cover letter: ${errorMessage}`);
		}
	},

	remove: async (input: { id: string; userId: string }) => {
		try {
			const { error } = await supabase.from("cover_letter").delete().eq("id", input.id).eq("user_id", input.userId);

			if (error) throw error;
		} catch (error) {
			console.error("Cover letter delete error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to delete cover letter: ${errorMessage}`);
		}
	},
};
