/**
 * Server-Side Rendering Service
 * Renders React components to HTML strings for PDF generation
 */

import { createElement } from "react";
import { renderToString } from "react-dom/server";
import type { ResumeData } from "@/schema/resume/data";

// Template imports - these will be dynamically imported
const RESUME_TEMPLATES = {
	professional: () => import("@/components/resume/templates/professional"),
	modern: () => import("@/components/resume/templates/modern"),
	creative: () => import("@/components/resume/templates/creative"),
	minimal: () => import("@/components/resume/templates/minimal"),
	// Add other templates as needed
} as const;

const COVER_LETTER_TEMPLATES = {
	professional: () => import("@/components/cover-letter/templates/professional"),
	modern: () => import("@/components/cover-letter/templates/modern"),
	creative: () => import("@/components/cover-letter/templates/creative"),
	minimal: () => import("@/components/cover-letter/templates/minimal"),
	// Add other templates as needed
} as const;

export const serverRendererService = {
	/**
	 * Render resume to HTML string
	 */
	async renderResumeHTML(
		resumeData: ResumeData,
		template: string = "professional"
	): Promise<string> {
		try {
			// Get template loader
			const templateLoader = RESUME_TEMPLATES[template as keyof typeof RESUME_TEMPLATES];
			if (!templateLoader) {
				throw new Error(`Resume template "${template}" not found`);
			}

			// Dynamically import template component
			const templateModule = await templateLoader();
			const TemplateComponent = templateModule.default;

			// Render component to HTML string
			const componentHTML = renderToString(
				createElement(TemplateComponent, { data: resumeData })
			);

			// Wrap in complete HTML document
			return this.wrapInHTMLDocument(componentHTML, {
				title: `${resumeData.basics?.name || 'Resume'}`,
				type: 'resume',
				template,
			});
		} catch (error) {
			console.error("Failed to render resume HTML:", error);
			throw new Error(`Resume rendering failed: ${error.message}`);
		}
	},

	/**
	 * Render cover letter to HTML string
	 */
	async renderCoverLetterHTML(
		coverLetterData: any,
		template: string = "professional"
	): Promise<string> {
		try {
			// Get template loader
			const templateLoader = COVER_LETTER_TEMPLATES[template as keyof typeof COVER_LETTER_TEMPLATES];
			if (!templateLoader) {
				throw new Error(`Cover letter template "${template}" not found`);
			}

			// Dynamically import template component
			const templateModule = await templateLoader();
			const TemplateComponent = templateModule.default;

			// Render component to HTML string
			const componentHTML = renderToString(
				createElement(TemplateComponent, { data: coverLetterData })
			);

			// Wrap in complete HTML document
			return this.wrapInHTMLDocument(componentHTML, {
				title: coverLetterData.title || 'Cover Letter',
				type: 'cover-letter',
				template,
			});
		} catch (error) {
			console.error("Failed to render cover letter HTML:", error);
			throw new Error(`Cover letter rendering failed: ${error.message}`);
		}
	},

	/**
	 * Wrap component HTML in complete HTML document
	 */
	private wrapInHTMLDocument(
		componentHTML: string,
		options: {
			title: string;
			type: 'resume' | 'cover-letter';
			template: string;
		}
	): string {
		return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${options.title}</title>
	<style>
		/* Reset and base styles */
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			line-height: 1.5;
			color: #333;
			background: white;
		}
		
		/* Print styles */
		@media print {
			body {
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
			}
			
			.page-break {
				page-break-before: always;
			}
			
			.no-print {
				display: none !important;
			}
		}
		
		/* PDF generation styles */
		@page {
			size: A4;
			margin: 0;
		}
		
		.document-container {
			width: 210mm;
			min-height: 297mm;
			padding: 20mm;
			margin: 0 auto;
			background: white;
		}
		
		/* Template-specific styles would be injected here */
		/* TODO: Include CSS from the actual template components */
		
		/* Common typography */
		h1, h2, h3, h4, h5, h6 {
			font-weight: 600;
			margin-bottom: 0.5em;
		}
		
		p {
			margin-bottom: 1em;
		}
		
		ul, ol {
			margin-bottom: 1em;
			padding-left: 1.5em;
		}
		
		a {
			color: #2563eb;
			text-decoration: none;
		}
		
		a:hover {
			text-decoration: underline;
		}
	</style>
</head>
<body>
	<div class="document-container">
		${componentHTML}
	</div>
</body>
</html>
		`.trim();
	},

	/**
	 * Get available resume templates
	 */
	getAvailableResumeTemplates(): string[] {
		return Object.keys(RESUME_TEMPLATES);
	},

	/**
	 * Get available cover letter templates
	 */
	getAvailableCoverLetterTemplates(): string[] {
		return Object.keys(COVER_LETTER_TEMPLATES);
	},
};
