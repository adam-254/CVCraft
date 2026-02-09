export interface CoverLetterTemplateProps {
	title: string;
	recipient?: string;
	content: string;
	tags: string[];
	className?: string;
	// Extended metadata for professional letter headers
	senderName?: string;
	senderAddress?: string;
	senderCity?: string;
	senderPhone?: string;
	senderEmail?: string;
	companyName?: string;
	companyAddress?: string;
	companyCity?: string;
	hiringManager?: string;
	position?: string;
}

export type CoverLetterTemplate = 
	| "professional"
	| "modern" 
	| "elegant"
	| "creative"
	| "minimal"
	| "classic"
	| "executive"
	| "tech"
	| "artistic"
	| "corporate"
	| "startup"
	| "academic";