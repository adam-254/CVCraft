/**
 * PDF Generation Service
 * Converts HTML to PDF using Puppeteer
 */

import { ORPCError } from "@orpc/client";
import puppeteer, { type Browser } from "puppeteer-core";

// Chromium executable paths for different environments
const CHROME_PATHS = {
	win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
	darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	linux: "/usr/bin/google-chrome",
};

function getChromePath(): string {
	const platform = process.platform;
	
	// Check for environment variable first (for production/Vercel)
	const envPath = process.env.CHROME_EXECUTABLE_PATH;
	if (envPath) {
		return envPath;
	}
	
	// Use platform-specific path
	return CHROME_PATHS[platform as keyof typeof CHROME_PATHS] || CHROME_PATHS.linux;
}

export const pdfGeneratorService = {
	/**
	 * Generate PDF from HTML content
	 */
	async generatePDF(htmlContent: string): Promise<Buffer> {
		let browser: Browser | undefined;
		
		try {
			// Launch browser
			browser = await puppeteer.launch({
				headless: true,
				executablePath: getChromePath(),
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-gpu",
				],
			});

			const page = await browser.newPage();
			
			// Set content
			await page.setContent(htmlContent, {
				waitUntil: "networkidle0",
			});

			// Generate PDF
			const pdfBuffer = await page.pdf({
				format: "A4",
				printBackground: true,
				margin: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
				preferCSSPageSize: true,
			});

			return Buffer.from(pdfBuffer);
		} catch (error) {
			console.error("PDF generation error:", error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to generate PDF",
			});
		} finally {
			if (browser) {
				await browser.close();
			}
		}
	},

	/**
	 * Generate PDF from URL
	 */
	async generatePDFFromURL(url: string): Promise<Buffer> {
		let browser: Browser | undefined;
		
		try {
			browser = await puppeteer.launch({
				headless: true,
				executablePath: getChromePath(),
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-gpu",
				],
			});

			const page = await browser.newPage();
			
			// Navigate to URL
			await page.goto(url, {
				waitUntil: "networkidle0",
			});

			// Generate PDF
			const pdfBuffer = await page.pdf({
				format: "A4",
				printBackground: true,
				margin: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
				preferCSSPageSize: true,
			});

			return Buffer.from(pdfBuffer);
		} catch (error) {
			console.error("PDF generation error:", error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to generate PDF from URL",
			});
		} finally {
			if (browser) {
				await browser.close();
			}
		}
	},
};
