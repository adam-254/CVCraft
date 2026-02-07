import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CloudArrowUpIcon,
	CodeSimpleIcon,
	CurrencyDollarIcon,
	DatabaseIcon,
	EyeIcon,
	FileCssIcon,
	FilesIcon,
	GithubLogoIcon,
	GlobeIcon,
	type Icon,
	KeyIcon,
	LayoutIcon,
	LockSimpleIcon,
	PaletteIcon,
	ProhibitIcon,
	SparkleIcon,
	TranslateIcon,
} from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/style";

type Feature = {
	id: string;
	icon: Icon;
	title: string;
	description: string;
	category: "core" | "security" | "design" | "advanced";
};

type FeatureCardProps = Feature & {
	index: number;
};

const getFeatures = (): Feature[] => [
	{
		id: "free",
		icon: CurrencyDollarIcon,
		title: t`100% Free Forever`,
		description: t`No hidden costs, no premium tiers, no subscriptions. Everything is free, always.`,
		category: "core",
	},
	{
		id: "open-source",
		icon: GithubLogoIcon,
		title: t`Open Source`,
		description: t`Transparent, trustworthy, and built with care. Inspect the code yourself.`,
		category: "core",
	},
	{
		id: "no-ads",
		icon: ProhibitIcon,
		title: t`No Ads, No Tracking`,
		description: t`Your privacy matters. We don't track, sell, or monetize your data.`,
		category: "core",
	},
	{
		id: "data-security",
		icon: DatabaseIcon,
		title: t`Secure Data Storage`,
		description: t`Your data is encrypted and never shared with third parties.`,
		category: "security",
	},
	{
		id: "self-host",
		icon: CloudArrowUpIcon,
		title: t`Self-Hosting Ready`,
		description: t`Deploy on your own servers with Docker for complete control.`,
		category: "security",
	},
	{
		id: "real-time-preview",
		icon: EyeIcon,
		title: t`Real-Time Preview`,
		description: t`See your changes instantly as you type with live preview updates.`,
		category: "security",
	},
	{
		id: "unlimited-resumes",
		icon: FilesIcon,
		title: t`Unlimited Resumes`,
		description: t`Create as many resumes as you need without any restrictions.`,
		category: "core",
	},
	{
		id: "design",
		icon: PaletteIcon,
		title: t`Full Customization`,
		description: t`Personalize colors, fonts, spacing, and layouts to match your style.`,
		category: "design",
	},
	{
		id: "css",
		icon: FileCssIcon,
		title: t`Custom CSS Support`,
		description: t`Write custom CSS or use AI to generate it for ultimate flexibility.`,
		category: "design",
	},
	{
		id: "templates",
		icon: LayoutIcon,
		title: t`12+ Templates`,
		description: t`Beautiful, professional templates with more being added regularly.`,
		category: "design",
	},
	{
		id: "languages",
		icon: TranslateIcon,
		title: t`Multilingual`,
		description: t`Available in 50+ languages with community translations.`,
		category: "advanced",
	},
	{
		id: "auth",
		icon: KeyIcon,
		title: t`One-Click Sign-In`,
		description: t`Quick authentication with Google, GitHub, or custom OAuth.`,
		category: "advanced",
	},
	{
		id: "public",
		icon: GlobeIcon,
		title: t`Shareable Links`,
		description: t`Share your resume with a public URL or password protection.`,
		category: "advanced",
	},
	{
		id: "password-protection",
		icon: LockSimpleIcon,
		title: t`Password Protection`,
		description: t`Secure your resume with password protection for privacy.`,
		category: "advanced",
	},
	{
		id: "api-access",
		icon: CodeSimpleIcon,
		title: t`API Access`,
		description: t`Programmatic access to your resumes via REST API.`,
		category: "advanced",
	},
	{
		id: "ai",
		icon: SparkleIcon,
		title: t`AI-Powered`,
		description: t`Generate content with AI assistance for faster resume creation.`,
		category: "advanced",
	},
];

const categoryColors = {
	core: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
	security: "from-green-500/20 to-emerald-500/20 border-green-500/30",
	design: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
	advanced: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
};

const categoryLabels = {
	core: t`Core Features`,
	security: t`Security & Privacy`,
	design: t`Design & Customization`,
	advanced: t`Advanced Features`,
};

function FeatureCard({ icon: Icon, title, description, category, index }: FeatureCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			className="group relative"
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5, delay: index * 0.05 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
		>
			<div
				className={cn(
					"relative h-full overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-6 transition-all duration-500",
					categoryColors[category],
					"hover:scale-[1.02] hover:shadow-2xl",
				)}
			>
				{/* Animated background gradient */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500"
					animate={{ opacity: isHovered ? 1 : 0 }}
				/>

				{/* Icon with animated background */}
				<motion.div
					className="relative mb-4 inline-flex rounded-xl bg-background/50 p-3 backdrop-blur-sm"
					whileHover={{ scale: 1.1, rotate: 5 }}
					transition={{ type: "spring", stiffness: 400, damping: 20 }}
				>
					<Icon size={28} weight="duotone" className="text-primary" />
				</motion.div>

				{/* Content */}
				<div className="relative space-y-2">
					<h3 className="font-bold text-lg tracking-tight">{title}</h3>
					<p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
				</div>

				{/* Shine effect */}
				<motion.div
					className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
					animate={{ translateX: isHovered ? "200%" : "-100%" }}
					transition={{ duration: 0.8 }}
				/>
			</div>
		</motion.div>
	);
}

export function Features() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

	const features = getFeatures();
	const categories = ["core", "security", "design", "advanced"] as const;

	return (
		<section ref={containerRef} id="features" className="relative overflow-hidden py-16 md:py-24 lg:py-32">
			{/* Animated Background */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0">
				<motion.div
					style={{ y, opacity }}
					className="absolute start-1/4 top-1/4 size-[600px] rounded-full bg-blue-500/10 blur-3xl"
				/>
				<motion.div
					style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]), opacity }}
					className="absolute end-1/4 bottom-1/4 size-[600px] rounded-full bg-purple-500/10 blur-3xl"
				/>
			</div>

			<div className="container relative mx-auto px-4 sm:px-6 lg:px-12">
				{/* Header */}
				<motion.div
					className="mx-auto mb-16 max-w-3xl space-y-6 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<Badge variant="secondary" className="gap-2 px-4 py-2 text-sm">
						<SparkleIcon weight="fill" className="size-4 text-primary" />
						<Trans>Powerful Features</Trans>
					</Badge>

					<h2 className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
						<Trans>
							<span className="inline-block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
								Everything You Need
							</span>
							<br />
							<span className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
								In One Place
							</span>
						</Trans>
					</h2>

					<p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
						<Trans>
							Built with privacy in mind, powered by open source, and completely free forever. Create professional
							resumes with all the features you need.
						</Trans>
					</p>
				</motion.div>

				{/* Features by Category */}
				<div className="space-y-16">
					{categories.map((category, categoryIndex) => {
						const categoryFeatures = features.filter((f) => f.category === category);

						return (
							<motion.div
								key={category}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
							>
								{/* Category Header */}
								<div className="mb-8 flex items-center gap-3">
									<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
									<h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
										{categoryLabels[category]}
									</h3>
									<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
								</div>

								{/* Category Features Grid */}
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{categoryFeatures.map((feature, index) => (
										<FeatureCard key={feature.id} {...feature} index={index} />
									))}
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
