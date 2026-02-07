import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import type { Template } from "@/schema/templates";

export type TemplateMetadata = {
	name: string;
	description: MessageDescriptor;
	imageUrl: string;
	tags: string[];
	sidebarPosition: "left" | "right" | "none";
};

export const templates = {
	azurill: {
		name: "Azurill",
		description: msg`Two-column with a bold colored sidebar and skill bars; great for creative or tech roles where visual flair is welcome.`,
		imageUrl: "/templates/jpg/azurill.jpg",
		tags: ["Two-column", "Creative", "Tech", "Visual flair"],
		sidebarPosition: "left",
	},
	bronzor: {
		name: "Bronzor",
		description: msg`Two-column, clean and professional with subtle section dividers; suits corporate, finance, or consulting positions.`,
		imageUrl: "/templates/jpg/bronzor.jpg",
		tags: ["Two-column", "Clean", "Professional", "Corporate", "Finance", "Consulting"],
		sidebarPosition: "none",
	},
	chikorita: {
		name: "Chikorita",
		description: msg`Two-column with a soft header accent and circular profile photo; ideal for marketing, HR, or client-facing roles.`,
		imageUrl: "/templates/jpg/chikorita.jpg",
		tags: ["Two-column", "Soft accent", "Marketing", "HR", "Client-facing"],
		sidebarPosition: "right",
	},
	ditgar: {
		name: "Ditgar",
		description: msg`Two-column with a dark teal sidebar and skills grid; modern feel for developers, data scientists, or technical PMs.`,
		imageUrl: "/templates/jpg/ditgar.jpg",
		tags: ["Two-column", "Modern", "Developer", "Data science", "Technical PM", "Dark sidebar"],
		sidebarPosition: "left",
	},
	ditto: {
		name: "Ditto",
		description: msg`Two-column, minimal and text-dense with no decorative elements; perfect for traditional industries or ATS-heavy applications.`,
		imageUrl: "/templates/jpg/ditto.jpg",
		tags: ["Two-column", "ATS friendly", "Minimal", "Text-dense", "Traditional", "No decoration"],
		sidebarPosition: "left",
	},
	gengar: {
		name: "Gengar",
		description: msg`Two-column with accent colors and clean typography; balanced choice for business analysts or operations roles.`,
		imageUrl: "/templates/jpg/gengar.jpg",
		tags: ["Two-column", "Accent colors", "Clean typography", "Business analyst", "Operations"],
		sidebarPosition: "left",
	},
	glalie: {
		name: "Glalie",
		description: msg`Two-column, minimal with light gray sidebar and subtle icons; professional and understated for legal, finance, or executive roles.`,
		imageUrl: "/templates/jpg/glalie.jpg",
		tags: ["Two-column", "Minimal", "Professional", "Legal", "Finance", "Executive", "Understated"],
		sidebarPosition: "left",
	},
	kakuna: {
		name: "Kakuna",
		description: msg`Single-column with a magenta left border accent; compact and efficient for entry-level or internship applications.`,
		imageUrl: "/templates/jpg/kakuna.jpg",
		tags: ["Single-column", "ATS friendly", "Compact", "Efficient", "Entry level", "Internship", "Magenta accent"],
		sidebarPosition: "none",
	},
	lapras: {
		name: "Lapras",
		description: msg`Single-column; polished and serious for senior or enterprise-level positions.`,
		imageUrl: "/templates/jpg/lapras.jpg",
		tags: ["Single-column", "ATS friendly", "Polished", "Senior", "Enterprise"],
		sidebarPosition: "none",
	},
	leafish: {
		name: "Leafish",
		description: msg`Two-column with a muted color sidebar; earthy and calm, suits sustainability, healthcare, or nonprofit sectors.`,
		imageUrl: "/templates/jpg/leafish.jpg",
		tags: ["Two-column", "Muted sidebar", "Earthy", "Calm", "Sustainability", "Healthcare", "Nonprofit"],
		sidebarPosition: "right",
	},
	onyx: {
		name: "Onyx",
		description: msg`Single-column with a sidebar and clean grid layout; versatile for any professional or technical role.`,
		imageUrl: "/templates/jpg/onyx.jpg",
		tags: ["Single-column", "ATS friendly", "Sidebar", "Grid layout", "Versatile", "Professional", "Technical"],
		sidebarPosition: "none",
	},
	pikachu: {
		name: "Pikachu",
		description: msg`Two-column with a left margin color; simple and approachable for creative, editorial, or junior roles.`,
		imageUrl: "/templates/jpg/pikachu.jpg",
		tags: ["Two-column", "Simple", "Creative", "Editorial", "Junior", "Accent colors"],
		sidebarPosition: "left",
	},
	rhyhorn: {
		name: "Rhyhorn",
		description: msg`Single-column with a minimal top header and lots of whitespace; clean and modern for designers or content creators.`,
		imageUrl: "/templates/jpg/rhyhorn.jpg",
		tags: ["Single-column", "ATS friendly", "Minimal", "Clean", "Modern", "Designer", "Content creator", "Whitespace"],
		sidebarPosition: "none",
	},
	snorlax: {
		name: "Snorlax",
		description: msg`Single-column with bold section headers and horizontal dividers; strong visual hierarchy for management or leadership roles.`,
		imageUrl: "/templates/jpg/snorlax.jpg",
		tags: ["Single-column", "ATS friendly", "Bold headers", "Leadership", "Management", "Strong hierarchy"],
		sidebarPosition: "none",
	},
	mewtwo: {
		name: "Mewtwo",
		description: msg`Two-column with elegant typography and refined spacing; sophisticated choice for executive, legal, or academic positions.`,
		imageUrl: "/templates/jpg/mewtwo.jpg",
		tags: ["Two-column", "Elegant", "Executive", "Legal", "Academic", "Sophisticated", "Refined"],
		sidebarPosition: "right",
	},
	jigglypuff: {
		name: "Jigglypuff",
		description: msg`Two-column with rounded corners and soft colors; friendly and approachable for education, social work, or customer service.`,
		imageUrl: "/templates/jpg/jigglypuff.jpg",
		tags: ["Two-column", "Rounded", "Soft colors", "Friendly", "Education", "Social work", "Customer service"],
		sidebarPosition: "left",
	},
	squirtle: {
		name: "Squirtle",
		description: msg`Two-column with a compact header and skill badges; efficient layout for tech startups, product managers, or UX designers.`,
		imageUrl: "/templates/jpg/squirtle.jpg",
		tags: ["Two-column", "Compact", "Tech startup", "Product manager", "UX designer", "Skill badges"],
		sidebarPosition: "left",
	},
	bulbasaur: {
		name: "Bulbasaur",
		description: msg`Two-column with nature-inspired accents and organic flow; perfect for environmental, creative, or wellness industries.`,
		imageUrl: "/templates/jpg/bulbasaur.jpg",
		tags: ["Two-column", "Nature-inspired", "Organic", "Environmental", "Creative", "Wellness", "Green accent"],
		sidebarPosition: "right",
	},
	charizard: {
		name: "Charizard",
		description: msg`Two-column with dramatic full-height colored sidebar and bold typography; commanding presence for senior executives or C-suite positions.`,
		imageUrl: "/templates/jpg/charizard.jpg",
		tags: ["Two-column", "Bold", "Dramatic", "Executive", "C-suite", "Full sidebar", "Leadership"],
		sidebarPosition: "left",
	},
	blastoise: {
		name: "Blastoise",
		description: msg`Two-column with structured grid layout and professional borders; solid choice for engineering, architecture, or project management.`,
		imageUrl: "/templates/jpg/blastoise.jpg",
		tags: ["Two-column", "Structured", "Grid", "Engineering", "Architecture", "Project management", "Professional"],
		sidebarPosition: "left",
	},
	venusaur: {
		name: "Venusaur",
		description: msg`Single-column with decorative header banner and section icons; balanced design for healthcare, education, or public service.`,
		imageUrl: "/templates/jpg/venusaur.jpg",
		tags: ["Single-column", "ATS friendly", "Decorative header", "Healthcare", "Education", "Public service", "Icons"],
		sidebarPosition: "none",
	},
	eevee: {
		name: "Eevee",
		description: msg`Two-column with adaptive styling and clean lines; versatile template that works for any industry or experience level.`,
		imageUrl: "/templates/jpg/eevee.jpg",
		tags: ["Two-column", "Versatile", "Adaptive", "Clean", "Any industry", "Modern", "Flexible"],
		sidebarPosition: "right",
	},
	dragonite: {
		name: "Dragonite",
		description: msg`Two-column with asymmetric layout and creative spacing; standout design for designers, artists, or creative directors.`,
		imageUrl: "/templates/jpg/dragonite.jpg",
		tags: ["Two-column", "Asymmetric", "Creative", "Designer", "Artist", "Creative director", "Unique"],
		sidebarPosition: "right",
	},
	gyarados: {
		name: "Gyarados",
		description: msg`Single-column with striking header and timeline markers; powerful layout for sales, business development, or consulting.`,
		imageUrl: "/templates/jpg/gyarados.jpg",
		tags: ["Single-column", "ATS friendly", "Timeline", "Sales", "Business development", "Consulting", "Striking"],
		sidebarPosition: "none",
	},
	alakazam: {
		name: "Alakazam",
		description: msg`Two-column with minimalist design and strategic whitespace; intelligent layout for researchers, analysts, or academics.`,
		imageUrl: "/templates/jpg/alakazam.jpg",
		tags: ["Two-column", "Minimalist", "Whitespace", "Research", "Analyst", "Academic", "Strategic"],
		sidebarPosition: "left",
	},
	articuno: {
		name: "Articuno",
		description: msg`Premium two-column with diagonal accent banner and floating profile; stunning design for creative directors, brand managers, or design leads.`,
		imageUrl: "/templates/jpg/articuno.jpg",
		tags: ["Two-column", "Premium", "Diagonal banner", "Creative director", "Brand manager", "Stunning", "Modern"],
		sidebarPosition: "left",
	},
	zapdos: {
		name: "Zapdos",
		description: msg`Dynamic two-column with electric zigzag dividers and bold accents; high-energy layout for sales leaders, entrepreneurs, or startup founders.`,
		imageUrl: "/templates/jpg/zapdos.jpg",
		tags: ["Two-column", "Dynamic", "Bold", "Sales leader", "Entrepreneur", "Startup", "High-energy", "Zigzag"],
		sidebarPosition: "right",
	},
	moltres: {
		name: "Moltres",
		description: msg`Striking single-column with flame-inspired header waves and gradient accents; passionate design for marketing executives or innovation leaders.`,
		imageUrl: "/templates/jpg/moltres.jpg",
		tags: ["Single-column", "Striking", "Gradient", "Marketing executive", "Innovation", "Passionate", "Wave design"],
		sidebarPosition: "none",
	},
	lugia: {
		name: "Lugia",
		description: msg`Elegant three-section layout with curved dividers and premium spacing; sophisticated choice for C-level executives or board members.`,
		imageUrl: "/templates/jpg/lugia.jpg",
		tags: ["Multi-column", "Elegant", "Curved dividers", "C-level", "Executive", "Board member", "Premium", "Sophisticated"],
		sidebarPosition: "left",
	},
	rayquaza: {
		name: "Rayquaza",
		description: msg`Ultra-modern asymmetric design with overlapping sections and bold typography; commanding presence for tech leaders or visionary roles.`,
		imageUrl: "/templates/jpg/rayquaza.jpg",
		tags: ["Two-column", "Ultra-modern", "Asymmetric", "Overlapping", "Tech leader", "Visionary", "Bold", "Commanding"],
		sidebarPosition: "right",
	},
} as const satisfies Record<Template, TemplateMetadata>;
