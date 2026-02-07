import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TemplateMetadata } from "@/dialogs/resume/template/data";
import { templates } from "@/dialogs/resume/template/data";

type TemplateCardProps = {
	metadata: TemplateMetadata;
	index: number;
};

function TemplateCard({ metadata, index }: TemplateCardProps) {
	return (
		<motion.div
			className="group relative"
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
		>
			<div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-border/50 bg-card shadow-lg transition-all duration-500 hover:scale-[1.02] hover:border-primary/50 hover:shadow-2xl">
				{/* Template Image */}
				<img
					src={metadata.imageUrl}
					alt={metadata.name}
					className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
				/>

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				{/* Content Overlay */}
				<div className="absolute inset-x-0 bottom-0 translate-y-full p-6 transition-transform duration-300 group-hover:translate-y-0">
					<div className="space-y-3">
						<h3 className="font-bold text-white text-xl drop-shadow-lg">{metadata.name}</h3>
						<Button
							asChild
							size="sm"
							className="w-full gap-2 bg-white text-black hover:bg-white/90"
						>
							<Link to="/dashboard" aria-label={t`Use ${metadata.name} template`}>
								<Trans>Use Template</Trans>
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
					</div>
				</div>

				{/* Shine Effect */}
				<div className="pointer-events-none absolute inset-0 -translate-x-full rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
			</div>
		</motion.div>
	);
}

export function Templates() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

	const templateEntries = Object.entries(templates);
	const templateCount = templateEntries.length;

	return (
		<section ref={containerRef} id="templates" className="relative overflow-hidden py-16 md:py-24 lg:py-32">
			{/* Background Decoration */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0">
				<motion.div
					style={{ y, opacity }}
					className="absolute start-1/4 top-1/4 size-96 rounded-full bg-purple-500/10 blur-3xl"
				/>
				<motion.div
					style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]), opacity }}
					className="absolute end-1/4 bottom-1/4 size-96 rounded-full bg-blue-500/10 blur-3xl"
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
						<CheckCircleIcon weight="fill" className="size-4 text-green-600 dark:text-green-400" />
						<Trans>{templateCount} Professional Templates</Trans>
					</Badge>

					<h2 className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
						<Trans>
							<span className="inline-block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
								Choose Your Perfect
							</span>
							<br />
							<span className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
								Template
							</span>
						</Trans>
					</h2>

					<p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
						<Trans>
							Explore our diverse collection of professionally designed templates. Each one is fully customizable to
							match your style and industry. More templates are added regularly.
						</Trans>
					</p>
				</motion.div>

				{/* Templates Grid */}
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{templateEntries.map(([key, metadata], index) => (
						<TemplateCard key={key} metadata={metadata} index={index} />
					))}
				</div>

				{/* CTA Section */}
				<motion.div
					className="mt-16 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<p className="mb-6 text-muted-foreground">
						<Trans>Ready to create your resume?</Trans>
					</p>
					<Button asChild size="lg" className="gap-2 shadow-lg">
						<Link to="/dashboard">
							<Trans>Get Started Free</Trans>
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
