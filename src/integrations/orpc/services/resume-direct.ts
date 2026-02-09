import { supabase } from "@/integrations/supabase/client";
import { defaultResumeData, type ResumeData } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

export const resumeDirectService = {
	list: async (input: { userId: string; tags?: string[]; sort?: "lastUpdatedAt" | "createdAt" | "name" }) => {
		try {
			let query = supabase
				.from("resume")
				.select("id, name, slug, tags, is_public, is_locked, created_at, updated_at")
				.eq("user_id", input.userId);

			// Apply sorting
			switch (input.sort) {
				case "createdAt":
					query = query.order("created_at", { ascending: false });
					break;
				case "name":
					query = query.order("name", { ascending: true });
					break;
				default:
					query = query.order("updated_at", { ascending: false });
					break;
			}

			const { data, error } = await query;

			if (error) throw error;

			return (data || []).map((item) => ({
				id: item.id,
				name: item.name,
				slug: item.slug,
				tags: item.tags,
				isPublic: item.is_public,
				isLocked: item.is_locked,
				createdAt: new Date(item.created_at),
				updatedAt: new Date(item.updated_at),
			}));
		} catch (error) {
			console.error("Resume list error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to fetch resumes: ${errorMessage}`);
		}
	},

	getById: async (input: { id: string; userId: string }) => {
		try {
			const { data, error } = await supabase
				.from("resume")
				.select("*")
				.eq("id", input.id)
				.eq("user_id", input.userId)
				.single();

			if (error) throw error;
			if (!data) throw new Error("Resume not found");

			return {
				id: data.id,
				name: data.name,
				slug: data.slug,
				tags: data.tags,
				data: data.data,
				isPublic: data.is_public,
				isLocked: data.is_locked,
				password: data.password,
				userId: data.user_id,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at),
				hasPassword: !!data.password,
			};
		} catch (error) {
			console.error("Resume fetch error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to fetch resume: ${errorMessage}`);
		}
	},

	create: async (input: { userId: string; name: string; slug: string; tags: string[]; withSampleData?: boolean }) => {
		try {
			const id = generateId();
			
			const { data, error } = await supabase
				.from("resume")
				.insert({
					id,
					name: input.name,
					slug: input.slug,
					tags: input.tags,
					data: input.withSampleData ? defaultResumeData : defaultResumeData,
					user_id: input.userId,
				})
				.select("id")
				.single();

			if (error) throw error;
			if (!data) throw new Error("Failed to create resume");

			return data.id;
		} catch (error) {
			console.error("Resume creation error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to create resume: ${errorMessage}`);
		}
	},

	tags: {
		list: async (input: { userId: string }) => {
			try {
				const { data, error } = await supabase
					.from("resume")
					.select("tags")
					.eq("user_id", input.userId);

				if (error) throw error;

				// Extract all unique tags
				const allTags = new Set<string>();
				for (const resumeItem of data || []) {
					for (const tag of resumeItem.tags || []) {
						allTags.add(tag);
					}
				}

				return Array.from(allTags).sort();
			} catch (error) {
				console.error("Resume tags error:", error);
				const errorMessage = error instanceof Error ? error.message : "Unknown error";
				throw new Error(`Failed to fetch resume tags: ${errorMessage}`);
			}
		},
	},

	update: async (input: {
		id: string;
		userId: string;
		name?: string;
		slug?: string;
		tags?: string[];
		data?: ResumeData;
		isPublic?: boolean;
	}) => {
		const updateData: Record<string, any> = {};

		if (input.name !== undefined) updateData.name = input.name;
		if (input.slug !== undefined) updateData.slug = input.slug;
		if (input.tags !== undefined) updateData.tags = input.tags;
		if (input.data !== undefined) updateData.data = input.data;
		if (input.isPublic !== undefined) updateData.is_public = input.isPublic;

		try {
			const { data, error } = await supabase
				.from("resume")
				.update(updateData)
				.eq("id", input.id)
				.eq("user_id", input.userId)
				.select()
				.single();

			if (error) throw error;
			if (!data) throw new Error("Resume not found");

			return {
				id: data.id,
				name: data.name,
				slug: data.slug,
				tags: data.tags,
				data: data.data,
				isPublic: data.is_public,
				isLocked: data.is_locked,
				password: data.password,
				userId: data.user_id,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at),
			};
		} catch (error) {
			console.error("Resume update error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to update resume: ${errorMessage}`);
		}
	},

	delete: async (input: { id: string; userId: string }) => {
		try {
			const { error } = await supabase
				.from("resume")
				.delete()
				.eq("id", input.id)
				.eq("user_id", input.userId);

			if (error) throw error;
		} catch (error) {
			console.error("Resume delete error:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new Error(`Failed to delete resume: ${errorMessage}`);
		}
	},

	statistics: {
		getById: async (input: { id: string; userId: string }) => {
			try {
				// First get the resume to check if it's public
				const { data: resume, error: resumeError } = await supabase
					.from("resume")
					.select("is_public")
					.eq("id", input.id)
					.eq("user_id", input.userId)
					.single();

				if (resumeError) throw resumeError;
				if (!resume) throw new Error("Resume not found");

				// Get statistics
				const { data: stats, error: statsError } = await supabase
					.from("resume_statistics")
					.select("views, downloads, last_viewed_at, last_downloaded_at")
					.eq("resume_id", input.id)
					.single();

				// If no statistics exist yet, return defaults
				if (statsError && statsError.code === 'PGRST116') {
					return {
						isPublic: resume.is_public,
						views: 0,
						downloads: 0,
						lastViewedAt: null,
						lastDownloadedAt: null,
					};
				}

				if (statsError) throw statsError;

				return {
					isPublic: resume.is_public,
					views: stats?.views ?? 0,
					downloads: stats?.downloads ?? 0,
					lastViewedAt: stats?.last_viewed_at ? new Date(stats.last_viewed_at) : null,
					lastDownloadedAt: stats?.last_downloaded_at ? new Date(stats.last_downloaded_at) : null,
				};
			} catch (error) {
				console.error("Resume statistics error:", error);
				const errorMessage = error instanceof Error ? error.message : "Unknown error";
				throw new Error(`Failed to fetch resume statistics: ${errorMessage}`);
			}
		},
	},
};
