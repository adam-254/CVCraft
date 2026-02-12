/**
 * Client-side PDF Generation
 * Uses browser's native print functionality for better quality
 */

/**
 * Download PDF using browser's print dialog
 * This provides much better quality than html2canvas approach
 */
export async function downloadPDF(element: HTMLElement, filename: string): Promise<void> {
	// Store original title
	const originalTitle = document.title;
	
	// Set filename as title (some browsers use this for the PDF filename)
	document.title = filename.replace('.pdf', '');

	// Create a print-specific stylesheet
	const printStyles = document.createElement('style');
	printStyles.textContent = `
		@media print {
			body * {
				visibility: hidden;
			}
			.resume-preview-container,
			.resume-preview-container * {
				visibility: visible;
			}
			.resume-preview-container {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
			}
			/* Hide any UI elements */
			button, .dock, nav, header, footer, .sidebar {
				display: none !important;
			}
		}
	`;
	document.head.appendChild(printStyles);

	// Trigger print dialog
	window.print();

	// Clean up
	setTimeout(() => {
		document.title = originalTitle;
		document.head.removeChild(printStyles);
	}, 100);
}

/**
 * Alternative: Generate PDF using jsPDF with better settings
 * This is a fallback if print dialog doesn't work
 */
export async function downloadPDFAlternative(element: HTMLElement, filename: string): Promise<void> {
	// Dynamic import to reduce bundle size
	const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
		import('html2canvas'),
		import('jspdf')
	]);

	// Clone the element to avoid modifying the original
	const clone = element.cloneNode(true) as HTMLElement;
	clone.style.position = 'absolute';
	clone.style.left = '-9999px';
	clone.style.top = '0';
	document.body.appendChild(clone);

	try {
		// Wait for fonts to load
		await document.fonts.ready;
		await new Promise(resolve => setTimeout(resolve, 100));

		// Capture with higher quality settings
		const canvas = await html2canvas(clone, {
			scale: 3, // Higher scale for better quality
			useCORS: true,
			logging: false,
			backgroundColor: '#ffffff',
			removeContainer: false,
			imageTimeout: 0,
			allowTaint: false,
		});

		// A4 dimensions in mm
		const a4Width = 210;
		const a4Height = 297;

		// Calculate dimensions maintaining aspect ratio
		const imgWidth = a4Width;
		const imgHeight = (canvas.height * a4Width) / canvas.width;

		// Create PDF with better compression
		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4',
			compress: true,
			precision: 2,
		});

		// Convert canvas to image with high quality
		const imgData = canvas.toDataURL('image/png', 1.0);

		// Calculate pages needed
		let heightLeft = imgHeight;
		let position = 0;

		// Add first page
		pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
		heightLeft -= a4Height;

		// Add additional pages if needed
		while (heightLeft > 0) {
			position = heightLeft - imgHeight;
			pdf.addPage();
			pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
			heightLeft -= a4Height;
		}

		// Download
		pdf.save(filename);
	} finally {
		// Clean up
		document.body.removeChild(clone);
	}
}
