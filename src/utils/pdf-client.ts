/**
 * Client-side PDF Generation
 * Uses jsPDF and html2canvas to generate PDFs in the browser
 */

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export interface PDFOptions {
	filename?: string;
	quality?: number;
	scale?: number;
}

/**
 * Generate PDF from HTML element
 */
export async function generatePDFFromElement(
	element: HTMLElement,
	options: PDFOptions = {}
): Promise<Blob> {
	const { quality = 0.95, scale = 2 } = options;

	// Capture the element as canvas
	const canvas = await html2canvas(element, {
		scale,
		useCORS: true,
		logging: false,
		backgroundColor: "#ffffff",
		removeContainer: true,
	});

	// A4 dimensions in mm
	const a4Width = 210;
	const a4Height = 297;

	// Calculate dimensions
	const imgWidth = a4Width;
	const imgHeight = (canvas.height * a4Width) / canvas.width;

	// Create PDF
	const pdf = new jsPDF({
		orientation: imgHeight > a4Height ? "portrait" : "portrait",
		unit: "mm",
		format: "a4",
		compress: true,
	});

	// Convert canvas to image
	const imgData = canvas.toDataURL("image/jpeg", quality);

	// Calculate how many pages we need
	let heightLeft = imgHeight;
	let position = 0;
	let page = 0;

	// Add first page
	pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
	heightLeft -= a4Height;

	// Add additional pages if needed
	while (heightLeft > 0) {
		position = heightLeft - imgHeight;
		pdf.addPage();
		page++;
		pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
		heightLeft -= a4Height;
	}

	// Return as blob
	return pdf.output("blob");
}

/**
 * Download PDF directly
 */
export async function downloadPDF(element: HTMLElement, filename: string): Promise<void> {
	const blob = await generatePDFFromElement(element, { filename });

	// Create download link
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Generate PDF from saved HTML URL
 */
export async function generatePDFFromHTML(htmlContent: string, filename: string): Promise<void> {
	// Create a temporary container
	const container = document.createElement("div");
	container.style.position = "fixed";
	container.style.left = "-9999px";
	container.style.top = "0";
	container.style.width = "210mm"; // A4 width
	container.innerHTML = htmlContent;
	document.body.appendChild(container);

	try {
		// Wait for fonts and images to load
		await document.fonts.ready;
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Find the resume container
		const resumeElement = container.querySelector(".resume-preview-container") as HTMLElement;
		if (!resumeElement) {
			throw new Error("Resume preview container not found");
		}

		// Generate and download PDF
		await downloadPDF(resumeElement, filename);
	} finally {
		// Clean up
		document.body.removeChild(container);
	}
}
