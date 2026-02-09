export interface CoverLetterTemplateProps {
	title: string;
	recipient?: string;
	content: string;
	tags: string[];
	className?: string;
}

export type CoverLetterTemplate = 
	| "professional"
	| "modern" 
	| "elegant"
	| "creative"
	| "minimal"
	| "classic";