import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import type { Icon } from "@phosphor-icons/react";
import {
	CodeIcon,
	GlobeIcon,
	LockKeyIcon,
	PaintBrushIcon,
	RocketLaunchIcon,
	SparkleIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";

type Highlight = {
	id: string;
	icon: Icon;
	title: string;
	description: string;
	color: string;
};

const highlights: Highlight[] = [
	{
		id: "templates",
		icon: PaintBrushIcon,
		title: t`30+ Templates`,
		description: t`Beautiful, professionally designed templates`,
		color: "from-purple-500 to-pink-500",
	},
	{
		id: "languages",
		icon: GlobeIcon,
		title: t`50+ Languages`,
		description: t`Truly global, accessible to everyone`,
		color: "from-blue-500 to-cyan-500",
	},
	{
		id: "ai",
		icon: SparkleIcon,
		title: t`AI-Powered`,
		description: t`Smart content generation with multiple AI providers`,
		color: "from-amber-500 to-orange-500",
	},
	{
		id: "privacy",
		icon: LockKeyIcon,
		title: t`Privacy First`,
		description: t`Your data stays yours, no tracking or selling`,
		color: "from-green-500 to-emerald-500",
	},
	{
		id: "opensource",
		icon: CodeIcon,
		title: t`Open Source`,
		description: t`Transparent, auditable, and community-driven`,
		color: "from-indigo-500 to-purple-500",
	},
	{
		id: "fast",
		icon: RocketLaunchIcon,
		title: t`Lightning Fast`,
		description: t`Built with modern tech for optimal performance`,
		color: "from-red-500 to-pink-500",
	},
];

type HighlightCardProps = {
	highlight: Highlight;
	index: number;
};

function HighlightCard({ highlight, index }: HighlightCardProps) {
	const Icon = highlight.icon;

	return (
		<motion.div
			className="group relative flex flex-col items-center gap-y-4 border-r border-b p-8 text-center transition-all last:border-e-0 hover:bg-secondary/30 sm:border-b-0 lg:p-10"
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
		>
			{/* Gradient background on hover */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
			>
				<div className={`absolute inset-0 bg-linear-to-br ${highlight.color} opacity-5`} />
			</div>

			{/* Icon with gradient */}
			<motion.div
				className="relative"
				whileHover={{ scale: 1.1, rotate: 5 }}
				transition={{ type: "spring", stiffness: 400, damping: 20 }}
			>
				<div className={`rounded-2xl bg-linear-to-br ${highlight.color} p-4 shadow-lg`}>
					<Icon size={32} weight="duotone" className="text-white" />
				</div>
			</motion.div>

			{/* Title */}
			<h3 className="font-bold text-xl tracking-tight">{highlight.title}</h3>

			{/* Description */}
			<p className="text-muted-foreground text-sm leading-relaxed">{highlight.description}</p>
		</motion.div>
	);
}

export function Highlights() {
	return (
		<section id="highlights" aria-labelledby="highlights-heading" className="py-16">
			<div className="mb-12 text-center">
				<motion.h2
					id="highlights-heading"
					className="mb-4 font-bold text-3xl tracking-tight md:text-4xl"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<Trans>Why Choose CVCraft?</Trans>
				</motion.h2>
				<motion.p
					className="mx-auto max-w-2xl text-lg text-muted-foreground"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					<Trans>Everything you need to create a professional resume, all in one place</Trans>
				</motion.p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{highlights.map((highlight, index) => (
					<HighlightCard key={highlight.id} highlight={highlight} index={index} />
				))}
			</div>
		</section>
	);
}
