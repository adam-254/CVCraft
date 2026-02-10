import { supabaseStorage } from "@/integrations/supabase/client";

const BUCKET_NAME = "documents"; // You'll need to create this bucket in Supabase

export const documentStorageService = {
	/**
	 * Save resume HTML to storage
	 */
	async saveResumeDocument(userId: string, resumeId: string, htmlContent: string): Promise<string> {
		const path = `${userId}/resumes/${resumeId}/document.html`;
		const blob = new Blob([htmlContent], { type: "text/html" });

		await supabaseStorage.uploadFile(BUCKET_NAME, path, blob, "text/html");

		return supabaseStorage.getPublicUrl(BUCKET_NAME, path);
	},

	/**
	 * Get resume document URL
	 */
	getResumeDocumentUrl(userId: string, resumeId: string): string {
		const path = `${userId}/resumes/${resumeId}/document.html`;
		return supabaseStorage.getPublicUrl(BUCKET_NAME, path);
	},

	/**
	 * Download resume document
	 */
	async downloadResumeDocument(userId: string, resumeId: string): Promise<Blob> {
		const path = `${userId}/resumes/${resumeId}/document.html`;
		return await supabaseStorage.downloadFile(BUCKET_NAME, path);
	},

	/**
	 * Delete resume document
	 */
	async deleteResumeDocument(userId: string, resumeId: string): Promise<void> {
		const path = `${userId}/resumes/${resumeId}/document.html`;
		await supabaseStorage.deleteFile(BUCKET_NAME, path);
	},

	/**
	 * Save cover letter HTML to storage
	 */
	async saveCoverLetterDocument(userId: string, coverLetterId: string, htmlContent: string): Promise<string> {
		const path = `${userId}/cover-letters/${coverLetterId}/document.html`;
		const blob = new Blob([htmlContent], { type: "text/html" });

		await supabaseStorage.uploadFile(BUCKET_NAME, path, blob, "text/html");

		return supabaseStorage.getPublicUrl(BUCKET_NAME, path);
	},

	/**
	 * Get cover letter document URL
	 */
	getCoverLetterDocumentUrl(userId: string, coverLetterId: string): string {
		const path = `${userId}/cover-letters/${coverLetterId}/document.html`;
		return supabaseStorage.getPublicUrl(BUCKET_NAME, path);
	},

	/**
	 * Download cover letter document
	 */
	async downloadCoverLetterDocument(userId: string, coverLetterId: string): Promise<Blob> {
		const path = `${userId}/cover-letters/${coverLetterId}/document.html`;
		return await supabaseStorage.downloadFile(BUCKET_NAME, path);
	},

	/**
	 * Delete cover letter document
	 */
	async deleteCoverLetterDocument(userId: string, coverLetterId: string): Promise<void> {
		const path = `${userId}/cover-letters/${coverLetterId}/document.html`;
		await supabaseStorage.deleteFile(BUCKET_NAME, path);
	},
};
