export { AcademicTemplate } from "./academic";
export { ArtisticTemplate } from "./artistic";
export { ClassicTemplate } from "./classic";
export { CorporateTemplate } from "./corporate";
export { CreativeTemplate } from "./creative";
export { ElegantTemplate } from "./elegant";
export { ExecutiveTemplate } from "./executive";
export { MinimalTemplate } from "./minimal";
export { ModernTemplate } from "./modern";
export { ProfessionalTemplate } from "./professional";
export { StartupTemplate } from "./startup";
export { TechTemplate } from "./tech";

export type { CoverLetterTemplate, CoverLetterTemplateProps } from "./types";

export const coverLetterTemplates = [
	{
		id: "professional" as const,
		name: "Professional",
		description: "Clean and formal design perfect for corporate positions",
		component: "ProfessionalTemplate",
		category: "basic",
	},
	{
		id: "modern" as const,
		name: "Modern",
		description: "Contemporary design with gradient header and clean typography",
		component: "ModernTemplate",
		category: "basic",
	},
	{
		id: "elegant" as const,
		name: "Elegant",
		description: "Sophisticated design with serif fonts and decorative elements",
		component: "ElegantTemplate",
		category: "basic",
	},
	{
		id: "creative" as const,
		name: "Creative",
		description: "Bold and colorful design for creative industries",
		component: "CreativeTemplate",
		category: "basic",
	},
	{
		id: "minimal" as const,
		name: "Minimal",
		description: "Simple and clean design focusing on content",
		component: "MinimalTemplate",
		category: "basic",
	},
	{
		id: "classic" as const,
		name: "Classic",
		description: "Traditional formal letter design with serif typography",
		component: "ClassicTemplate",
		category: "basic",
	},
	{
		id: "executive" as const,
		name: "Executive",
		description: "Premium design for C-level and senior leadership positions",
		component: "ExecutiveTemplate",
		category: "premium",
	},
	{
		id: "tech" as const,
		name: "Tech",
		description: "Modern terminal-inspired design for technology roles",
		component: "TechTemplate",
		category: "premium",
	},
	{
		id: "artistic" as const,
		name: "Artistic",
		description: "Creative and expressive design for artists and designers",
		component: "ArtisticTemplate",
		category: "premium",
	},
	{
		id: "corporate" as const,
		name: "Corporate",
		description: "Professional design for large corporations and formal business",
		component: "CorporateTemplate",
		category: "premium",
	},
	{
		id: "startup" as const,
		name: "Startup",
		description: "Dynamic and energetic design for startup culture",
		component: "StartupTemplate",
		category: "premium",
	},
	{
		id: "academic" as const,
		name: "Academic",
		description: "Scholarly design for academic positions and research roles",
		component: "AcademicTemplate",
		category: "premium",
	},
] as const;
