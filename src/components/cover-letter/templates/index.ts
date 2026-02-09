export { ClassicTemplate } from "./classic";
export { CreativeTemplate } from "./creative";
export { ElegantTemplate } from "./elegant";
export { MinimalTemplate } from "./minimal";
export { ModernTemplate } from "./modern";
export { ProfessionalTemplate } from "./professional";

export type { CoverLetterTemplate, CoverLetterTemplateProps } from "./types";

export const coverLetterTemplates = [
	{
		id: "professional" as const,
		name: "Professional",
		description: "Clean and formal design perfect for corporate positions",
		component: "ProfessionalTemplate",
	},
	{
		id: "modern" as const,
		name: "Modern",
		description: "Contemporary design with gradient header and clean typography",
		component: "ModernTemplate",
	},
	{
		id: "elegant" as const,
		name: "Elegant",
		description: "Sophisticated design with serif fonts and decorative elements",
		component: "ElegantTemplate",
	},
	{
		id: "creative" as const,
		name: "Creative",
		description: "Bold and colorful design for creative industries",
		component: "CreativeTemplate",
	},
	{
		id: "minimal" as const,
		name: "Minimal",
		description: "Simple and clean design focusing on content",
		component: "MinimalTemplate",
	},
	{
		id: "classic" as const,
		name: "Classic",
		description: "Traditional formal letter design with serif typography",
		component: "ClassicTemplate",
	},
] as const;
