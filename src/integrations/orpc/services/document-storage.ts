import { supabaseStorage } from "@/integrations/supabase/client";
import type { ResumeData } from "@/schema/resume/data";
import { pdfGeneratorService } from "./pdf-generator";
import { serverRendererService } from "./server-renderer";

const BUCKET_NAME = "documents";

export const documentStorageService = {
	/**
	 * Generate and store PDF from resume JSON data
	 * HTML is generated temporarily in-memory, not stored
	 */
	async generateResumePDF(
		userId: string,
		resumeId: string,
		resumeData: ResumeData,
		template = "professional",
	): Promise<string> {
		try {
			// Generate HTML from JSON data using server-side rendering
			const html = await serverRendererService.renderResumeHTML(resumeData, template);

			// Generate PDF from HTML
			const pdfBuffer = await pdfGeneratorService.generatePDF(html);

			// Store only the PDF - convert Buffer to Uint8Array for Blob
			const path = `${userId}/pdfs/resumes/${resumeId}.pdf`;
			const blob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" });

			await supabaseStorage.uploadFile(BUCKET_NAME, path, blob, "application/pdf");

			return supabaseStorage.getPublicUrl(BUCKET_NAME, path);
		} catch (error) {
			console.error("Failed to generate resume PDF:", error);
			throw new Error("PDF generation failed");
		}
	},

	/**
	 * Generate and store PDF from cover letter JSON data
	 */
	async generateCoverLetterPDF(
		userId: string,
		coverLetterId: string,
		coverLetterData: Record<string, unknown>,
		template = "professional",
	): Promise<string> {
		try {
			// Generate HTML from JSON data using server-side rendering
			const html = await serverRendererService.renderCoverLetterHTML(coverLetterData, template);

			// Generate PDF from HTML
			const pdfBuffer = await pdfGeneratorService.generatePDF(html);

			// Store only the PDF - convert Buffer to Uint8Array for Blob
			const path = `${userId}/pdfs/cover-letters/${coverLetterId}.pdf`;
			const blob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" });

			await supabaseStorage.uploadFile(BUCKET_NAME, path, blob, "application/pdf");

			return supabaseStorage.getPublicUrl(BUCKET_NAME, path);
		} catch (error) {
			console.error("Failed to generate cover letter PDF:", error);
			throw new Error("PDF generation failed");
		}
	},

	/**
	 * Get resume PDF URL (generate if missing)
	 */
	async getResumePDF(
		userId: string,
		resumeId: string,
		resumeData: ResumeData,
		template = "professional",
	): Promise<string> {
		const path = `${userId}/pdfs/resumes/${resumeId}.pdf`;

		// Try to get the file, if it doesn't exist, generate it
		try {
			await supabaseStorage.downloadFile(BUCKET_NAME, path);
			return supabaseStorage.getPublicUrl(BUCKET_NAME, path);
		} catch {
			// File doesn't exist, generate on-demand
			return await this.generateResumePDF(userId, resumeId, resumeData, template);
		}
	},

	/**
	 * Get cover letter PDF URL (generate if missing)
	 */
	async getCoverLetterPDF(
		userId: string,
		coverLetterId: string,
		coverLetterData: Record<string, unknown>,
		template = "professional",
	): Promise<string> {
		const path = `${userId}/pdfs/cover-letters/${coverLetterId}.pdf`;

		// Try to get the file, if it doesn't exist, generate it
		try {
			await supabaseStorage.downloadFile(BUCKET_NAME, path);
			return supabaseStorage.getPublicUrl(BUCKET_NAME, path);
		} catch {
			// File doesn't exist, generate on-demand
			return await this.generateCoverLetterPDF(userId, coverLetterId, coverLetterData, template);
		}
	},

	/**
	 * Delete resume PDF
	 */
	async deleteResumePDF(userId: string, resumeId: string): Promise<void> {
		const path = `${userId}/pdfs/resumes/${resumeId}.pdf`;
		try {
			await supabaseStorage.deleteFile(BUCKET_NAME, path);
		} catch {
			// Ignore errors if file doesn't exist
		}
	},

	/**
	 * Delete cover letter PDF
	 */
	async deleteCoverLetterPDF(userId: string, coverLetterId: string): Promise<void> {
		const path = `${userId}/pdfs/cover-letters/${coverLetterId}.pdf`;
		try {
			await supabaseStorage.deleteFile(BUCKET_NAME, path);
		} catch {
			// Ignore errors if file doesn't exist
		}
	},

	/**
	 * Invalidate cached PDF (force regeneration on next request)
	 */
	async invalidateResumePDF(userId: string, resumeId: string): Promise<void> {
		await this.deleteResumePDF(userId, resumeId);
	},

	/**
	 * Invalidate cached PDF (force regeneration on next request)
	 */
	async invalidateCoverLetterPDF(userId: string, coverLetterId: string): Promise<void> {
		await this.deleteCoverLetterPDF(userId, coverLetterId);
	},

	/**
	 * Generate PDF download URL from printer route (alternative method)
	 * Uses the existing printer routes for PDF generation
	 */
	async generatePDFFromPrinterRoute(
		type: "resume" | "cover-letter",
		documentId: string,
		baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	): Promise<Buffer> {
		const printerUrl = `${baseUrl}/printer/${type}/${documentId}`;
		return await pdfGeneratorService.generatePDFFromURL(printerUrl);
	},

	/**
	 * Get available templates
	 */
	getAvailableTemplates(type: "resume" | "cover-letter"): string[] {
		if (type === "resume") {
			return serverRendererService.getAvailableResumeTemplates();
		}
		return serverRendererService.getAvailableCoverLetterTemplates();
	},
};
