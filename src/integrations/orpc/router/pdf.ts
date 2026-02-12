import { z } from "zod";
import { resumeDataSchema } from "@/schema/resume/data";
import { orpc } from "../context";
import { documentStorageService } from "../services/document-storage";

export const pdfRouter = orpc.router({
	/**
	 * Generate PDF for resume
	 */
	generateResumePDF: orpc
		.input(
			z.object({
				resumeId: z.string().uuid(),
				resumeData: resumeDataSchema,
				template: z.string().default("professional"),
			}),
		)
		.output(z.object({ url: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { user } = ctx;
			if (!user) {
				throw new Error("Unauthorized");
			}

			const url = await documentStorageService.generateResumePDF(
				user.id,
				input.resumeId,
				input.resumeData,
				input.template,
			);

			return { url };
		}),

	/**
	 * Generate PDF for cover letter
	 */
	generateCoverLetterPDF: orpc
		.input(
			z.object({
				coverLetterId: z.string().uuid(),
				coverLetterData: z.any(), // TODO: Add proper cover letter schema
				template: z.string().default("professional"),
			}),
		)
		.output(z.object({ url: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { user } = ctx;
			if (!user) {
				throw new Error("Unauthorized");
			}

			const url = await documentStorageService.generateCoverLetterPDF(
				user.id,
				input.coverLetterId,
				input.coverLetterData,
				input.template,
			);

			return { url };
		}),

	/**
	 * Get resume PDF URL (generate if missing)
	 */
	getResumePDF: orpc
		.input(
			z.object({
				resumeId: z.string().uuid(),
				resumeData: resumeDataSchema,
				template: z.string().default("professional"),
			}),
		)
		.output(z.object({ url: z.string() }))
		.query(async ({ input, ctx }) => {
			const { user } = ctx;
			if (!user) {
				throw new Error("Unauthorized");
			}

			const url = await documentStorageService.getResumePDF(user.id, input.resumeId, input.resumeData, input.template);

			return { url };
		}),

	/**
	 * Get cover letter PDF URL (generate if missing)
	 */
	getCoverLetterPDF: orpc
		.input(
			z.object({
				coverLetterId: z.string().uuid(),
				coverLetterData: z.any(), // TODO: Add proper cover letter schema
				template: z.string().default("professional"),
			}),
		)
		.output(z.object({ url: z.string() }))
		.query(async ({ input, ctx }) => {
			const { user } = ctx;
			if (!user) {
				throw new Error("Unauthorized");
			}

			const url = await documentStorageService.getCoverLetterPDF(
				user.id,
				input.coverLetterId,
				input.coverLetterData,
				input.template,
			);

			return { url };
		}),

	/**
	 * Invalidate resume PDF cache
	 */
	invalidateResumePDF: orpc
		.input(z.object({ resumeId: z.string().uuid() }))
		.output(z.object({ success: z.boolean() }))
		.mutation(async ({ input, ctx }) => {
			const { user } = ctx;
			if (!user) {
				throw new Error("Unauthorized");
			}

			await documentStorageService.invalidateResumePDF(user.id, input.resumeId);
			return { success: true };
		}),

	/**
	 * Invalidate cover letter PDF cache
	 */
	invalidateCoverLetterPDF: orpc
		.input(z.object({ coverLetterId: z.string().uuid() }))
		.output(z.object({ success: z.boolean() }))
		.mutation(async ({ input, ctx }) => {
			const { user } = ctx;
			if (!user) {
				throw new Error("Unauthorized");
			}

			await documentStorageService.invalidateCoverLetterPDF(user.id, input.coverLetterId);
			return { success: true };
		}),

	/**
	 * Get available templates
	 */
	getAvailableTemplates: orpc
		.input(z.object({ type: z.enum(["resume", "cover-letter"]) }))
		.output(z.object({ templates: z.array(z.string()) }))
		.query(async ({ input }) => {
			const templates = documentStorageService.getAvailableTemplates(input.type);
			return { templates };
		}),
});
