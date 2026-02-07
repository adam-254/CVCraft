import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CaretRightIcon, ChatCircleDotsIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/style";

const crowdinUrl = "https://crowdin.com/project/reactive-resume";

type FAQItemData = {
	question: string;
	answer: React.ReactNode;
	category: "general" | "privacy" | "features" | "technical";
};

const getFaqItems = (): FAQItemData[] => [
	{
		question: t`Is CVCraft really free?`,
		answer: t`Yes! CVCraft is completely free to use, with no hidden costs, premium tiers, or subscription fees. It's open-source and will always remain free.`,
		category: "general",
	},
	{
		question: t`How is my data protected?`,
		answer: t`Your data is stored securely and is never shared with third parties. You can also self-host CVCraft on your own servers for complete control over your data.`,
		category: "privacy",
	},
	{
		question: t`Can I export my resume to PDF?`,
		answer: t`Absolutely! You can export your resume to PDF with a single click. The exported PDF maintains all your formatting and styling perfectly.`,
		category: "features",
	},
	{
		question: t`Is CVCraft available in multiple languages?`,
		answer: (
			<Trans>
				Yes, CVCraft is available in multiple languages. You can choose your preferred language in the settings page, or
				using the language switcher in the top right corner. If you don't see your language, or you would like to
				improve the existing translations, you can{" "}
				<a
					href={crowdinUrl}
					target="_blank"
					rel="noopener"
					className={buttonVariants({ variant: "link", className: "h-auto px-0!" })}
				>
					contribute to the translations on Crowdin
					<span className="sr-only"> (opens in new tab)</span>
				</a>
				.
			</Trans>
		),
		category: "features",
	},
	{
		question: t`What makes CVCraft different from other resume builders?`,
		answer: t`CVCraft is open-source, privacy-focused, and completely free. Unlike other resume builders, it doesn't show ads, track your data, or limit your features behind a paywall.`,
		category: "general",
	},
	{
		question: t`Can I customize the templates?`,
		answer: t`Yes! Every template is fully customizable. You can change colors, fonts, spacing, and even write custom CSS for complete control over your resume's appearance.`,
		category: "features",
	},
	{
		question: t`How do I share my resume?`,
		answer: t`You can share your resume via a unique public URL, protect it with a password, or download it as a PDF to share directly. The choice is yours!`,
		category: "features",
	},
	{
		question: t`Can I self-host CVCraft?`,
		answer: t`Yes! CVCraft can be self-hosted using Docker. This gives you complete control over your data and infrastructure. Check our documentation for setup instructions.`,
		category: "technical",
	},
	{
		question: t`Do I need an account to use CVCraft?`,
		answer: t`No account is required for basic use. However, creating an account allows you to save your resumes, access them from any device, and use advanced features.`,
		category: "general",
	},
	{
		question: t`Is my data sold to third parties?`,
		answer: t`Never. We don't sell, share, or monetize your data in any way. Your privacy is our top priority, and we're committed to keeping your information secure.`,
		category: "privacy",
	},
];

const categoryLabels = {
	general: t`General`,
	privacy: t`Privacy & Security`,
	features: t`Features`,
	technical: t`Technical`,
};

const categoryColors = {
	general: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
	privacy: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
	features: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
	technical: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

export function FAQ() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

	const faqItems = getFaqItems();
	const categories = ["general", "privacy", "features", "technical"] as const;

	return (
		<section
			ref={containerRef}
			id="frequently-asked-questions"
			className="relative overflow-hidden py-16 md:py-24 lg:py-32"
		>
			{/* Animated Background */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0">
				<motion.div
					style={{ y, opacity }}
					className="absolute start-1/3 top-1/4 size-[500px] rounded-full bg-blue-500/10 blur-3xl"
				/>
				<motion.div
					style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]), opacity }}
					className="absolute end-1/3 bottom-1/4 size-[500px] rounded-full bg-purple-500/10 blur-3xl"
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
						<ChatCircleDotsIcon weight="fill" className="size-4 text-primary" />
						<Trans>Got Questions?</Trans>
					</Badge>

					<h2 className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
						<Trans>
							<span className="inline-block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
								Frequently Asked
							</span>
							<br />
							<span className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
								Questions
							</span>
						</Trans>
					</h2>

					<p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
						<Trans>
							Find answers to common questions about CVCraft. Can't find what you're looking for? Feel free to reach out
							to our community.
						</Trans>
					</p>
				</motion.div>

				{/* FAQ by Category */}
				<div className="mx-auto max-w-4xl space-y-12">
					{categories.map((category, categoryIndex) => {
						const categoryFaqs = faqItems.filter((f) => f.category === category);

						if (categoryFaqs.length === 0) return null;

						return (
							<motion.div
								key={category}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
							>
								{/* Category Header */}
								<div className="mb-6 flex items-center gap-3">
									<Badge
										variant="outline"
										className={cn("gap-2 px-3 py-1.5 font-semibold text-xs", categoryColors[category])}
									>
										<CheckCircleIcon weight="fill" className="size-3.5" />
										{categoryLabels[category]}
									</Badge>
									<div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
								</div>

								{/* Category FAQs */}
								<Accordion type="multiple" className="space-y-3">
									{categoryFaqs.map((item, index) => (
										<FAQItemComponent key={item.question} item={item} index={index} category={category} />
									))}
								</Accordion>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

type FAQItemComponentProps = {
	item: FAQItemData;
	index: number;
	category: FAQItemData["category"];
};

function FAQItemComponent({ item, index, category }: FAQItemComponentProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.4, delay: index * 0.05 }}
		>
			<AccordionItem
				value={item.question}
				className={cn(
					"group overflow-hidden rounded-xl border-2 bg-card/50 backdrop-blur-sm transition-all duration-300",
					isOpen ? "border-primary/50 shadow-lg" : "border-border/50 hover:border-border",
				)}
			>
				<AccordionTrigger
					className="px-6 py-5 text-left hover:no-underline [&[data-state=open]>svg]:rotate-90"
					onClick={() => setIsOpen(!isOpen)}
				>
					<div className="flex items-start gap-4 pr-4">
						<div
							className={cn(
								"mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
								isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
							)}
						>
							<span className="font-bold text-xs">{index + 1}</span>
						</div>
						<span className="flex-1 font-semibold text-base leading-relaxed">{item.question}</span>
					</div>
					<CaretRightIcon
						aria-hidden="true"
						className="shrink-0 text-muted-foreground transition-transform duration-300"
					/>
				</AccordionTrigger>
				<AccordionContent className="px-6 pt-2 pb-6">
					<div className="ml-10 text-muted-foreground leading-relaxed">{item.answer}</div>
				</AccordionContent>
			</AccordionItem>
		</motion.div>
	);
}
