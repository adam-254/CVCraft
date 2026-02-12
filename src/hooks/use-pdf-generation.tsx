import { useMutation, useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/integrations/orpc/client";
import type { ResumeData } from "@/schema/resume/data";

/**
 * Hook for generating and managing PDF documents
 */
export function usePDFGeneration() {
	/**
	 * Generate resume PDF
	 */
	const generateResumePDF = useMutation({
		mutationFn: async ({
			resumeId,
			resumeData,
			template = "professional",
		}: {
			resumeId: string;
			resumeData: ResumeData;
			template?: string;
		}) => {
			const result = await orpcClient.pdf.generateResumePDF({
				resumeId,
				resumeData,
				template,
			});
			return result.url;
		},
		onSuccess: (url) => {
			// Trigger download
			window.open(url, '_blank');
		},
		onError: (error) => {
			console.error("Failed to generate resume PDF:", error);
		},
	});

	/**
	 * Generate cover letter PDF
	 */
	const generateCoverLetterPDF = useMutation({
		mutationFn: async ({
			coverLetterId,
			coverLetterData,
			template = "professional",
		}: {
			coverLetterId: string;
			coverLetterData: any;
			template?: string;
		}) => {
			const result = await orpcClient.pdf.generateCoverLetterPDF({
				coverLetterId,
				coverLetterData,
				template,
			});
			return result.url;
		},
		onSuccess: (url) => {
			// Trigger download
			window.open(url, '_blank');
		},
		onError: (error) => {
			console.error("Failed to generate cover letter PDF:", error);
		},
	});

	/**
	 * Get resume PDF (cached or generate)
	 */
	const getResumePDF = useMutation({
		mutationFn: async ({
			resumeId,
			resumeData,
			template = "professional",
		}: {
			resumeId: string;
			resumeData: ResumeData;
			template?: string;
		}) => {
			const result = await orpcClient.pdf.getResumePDF({
				resumeId,
				resumeData,
				template,
			});
			return result.url;
		},
		onSuccess: (url) => {
			// Trigger download
			window.open(url, '_blank');
		},
		onError: (error) => {
			console.error("Failed to get resume PDF:", error);
		},
	});

	/**
	 * Get cover letter PDF (cached or generate)
	 */
	const getCoverLetterPDF = useMutation({
		mutationFn: async ({
			coverLetterId,
			coverLetterData,
			template = "professional",
		}: {
			coverLetterId: string;
			coverLetterData: any;
			template?: string;
		}) => {
			const result = await orpcClient.pdf.getCoverLetterPDF({
				coverLetterId,
				coverLetterData,
				template,
			});
			return result.url;
		},
		onSuccess: (url) => {
			// Trigger download
			window.open(url, '_blank');
		},
		onError: (error) => {
			console.error("Failed to get cover letter PDF:", error);
		},
	});

	/**
	 * Invalidate resume PDF cache
	 */
	const invalidateResumePDF = useMutation({
		mutationFn: async (resumeId: string) => {
			await orpcClient.pdf.invalidateResumePDF({ resumeId });
		},
		onSuccess: () => {
			console.log("Resume PDF cache invalidated");
		},
		onError: (error) => {
			console.error("Failed to invalidate resume PDF cache:", error);
		},
	});

	/**
	 * Invalidate cover letter PDF cache
	 */
	const invalidateCoverLetterPDF = useMutation({
		mutationFn: async (coverLetterId: string) => {
			await orpcClient.pdf.invalidateCoverLetterPDF({ coverLetterId });
		},
		onSuccess: () => {
			console.log("Cover letter PDF cache invalidated");
		},
		onError: (error) => {
			console.error("Failed to invalidate cover letter PDF cache:", error);
		},
	});

	/**
	 * Get available templates
	 */
	const useAvailableTemplates = (type: 'resume' | 'cover-letter') => {
		return useQuery({
			queryKey: ['available-templates', type],
			queryFn: async () => {
				const result = await orpcClient.pdf.getAvailableTemplates({ type });
				return result.templates;
			},
			staleTime: 5 * 60 * 1000, // 5 minutes
		});
	};

	return {
		// Mutations
		generateResumePDF,
		generateCoverLetterPDF,
		getResumePDF,
		getCoverLetterPDF,
		invalidateResumePDF,
		invalidateCoverLetterPDF,
		
		// Queries
		useAvailableTemplates,
		
		// Helper functions
		downloadResumePDF: (resumeId: string, resumeData: ResumeData, template?: string) => {
			getResumePDF.mutate({ resumeId, resumeData, template });
		},
		
		downloadCoverLetterPDF: (coverLetterId: string, coverLetterData: any, template?: string) => {
			getCoverLetterPDF.mutate({ coverLetterId, coverLetterData, template });
		},
		
		// Status checks
		isGenerating: generateResumePDF.isPending || generateCoverLetterPDF.isPending,
		isDownloading: getResumePDF.isPending || getCoverLetterPDF.isPending,
		isInvalidating: invalidateResumePDF.isPending || invalidateCoverLetterPDF.isPending,
	};
}