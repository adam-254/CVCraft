import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import {
	ArrowRightIcon,
	CheckCircleIcon,
	DownloadIcon,
	PencilIcon,
	RocketLaunchIcon,
	SparkleIcon,
} from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/style";

type Step = {
	number: number;
	title: MessageDescriptor;
	description: MessageDescriptor;
	icon: typeof PencilIcon;
	color: string;
	features: MessageDescriptor[];
};

const getSteps = (): Step[] => [
	{
		number: 1,
		title: msg`Choose Your Template`,
		description: msg`Select from 12+ professionally designed templates that suit your style and industry.`,
		icon: SparkleIcon,
		color: "from-blue-500 to-cyan-500",
		features: [msg`12+ Professional Templates`, msg`Modern & Clean Designs`, msg`Industry-Specific Options`],
	},
	{
		number: 2,
		title: msg`Build & Customize`,
		description: msg`Fill in your details with AI assistance and customize every aspect to match your personal brand.`,
		icon: PencilIcon,
		color: "from-purple-500 to-pink-500",
		features: [msg`AI-Powered Content`, msg`Real-Time Preview`, msg`Full Customization`],
	},
	{
		number: 3,
		title: msg`Export & Share`,
		description: msg`Download your resume as PDF or share it with a unique link. Your success story starts here!`,
		icon: RocketLaunchIcon,
		color: "from-green-500 to-emerald-500",
		features: [msg`High-Quality PDF Export`, msg`Shareable Public Links`, msg`Password Protection`],
	},
];

type StepCardProps = Step & {
	index: number;
};

function StepCard({ number, title, description, icon: Icon, color, features, index }: StepCardProps) {
	const { i18n } = useLingui();

	return (
		<motion.div
			className="group relative"
			initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6, delay: index * 0.2 }}
		>
			<div className="relative h-full overflow-hidden rounded-3xl border-2 border-border/50 bg-card/50 p-8 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-2xl md:p-10">
				{/* Step Number Badge */}
				<motion.div
					className={cn(
						"absolute -top-4 -right-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br font-bold text-3xl text-white shadow-xl",
						color,
					)}
					whileHover={{ scale: 1.1, rotate: 10 }}
					transition={{ type: "spring", stiffness: 400, damping: 20 }}
				>
					{number}
				</motion.div>

				{/* Icon */}
				<motion.div
					className={cn("mb-6 inline-flex rounded-2xl bg-gradient-to-br p-4 shadow-lg", color)}
					whileHover={{ scale: 1.05, rotate: -5 }}
					transition={{ type: "spring", stiffness: 400, damping: 20 }}
				>
					<Icon size={40} weight="duotone" className="text-white" />
				</motion.div>

				{/* Content */}
				<div className="space-y-4">
					<h3 className="font-bold text-2xl tracking-tight">{i18n._(title)}</h3>
					<p className="text-muted-foreground leading-relaxed">{i18n._(description)}</p>

					{/* Features List */}
					<ul className="space-y-3 pt-4">
						{features.map((feature, i) => (
							<motion.li
								key={i}
								className="flex items-center gap-3"
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.2 + i * 0.1 }}
							>
								<CheckCircleIcon size={20} weight="fill" className="shrink-0 text-primary" />
								<span className="text-sm">{i18n._(feature)}</span>
							</motion.li>
						))}
					</ul>
				</div>

				{/* Arrow Connector (hidden on last item) */}
				{index < 2 && (
					<motion.div
						className="absolute -bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
						animate={{ y: [0, 10, 0] }}
						transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
					>
						<ArrowRightIcon size={32} weight="bold" className="rotate-90 text-primary/30" />
					</motion.div>
				)}

				{/* Shine effect */}
				<motion.div
					className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
					initial={{ translateX: "-100%" }}
					whileHover={{ translateX: "200%" }}
					transition={{ duration: 0.8 }}
				/>
			</div>
		</motion.div>
	);
}

export function HowItWorks() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

	const steps = getSteps();

	return (
		<section ref={containerRef} id="how-it-works" className="relative overflow-hidden py-16 md:py-24 lg:py-32">
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
					className="mx-auto mb-20 max-w-3xl space-y-6 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<Badge variant="secondary" className="gap-2 px-4 py-2 text-sm">
						<RocketLaunchIcon weight="fill" className="size-4 text-primary" />
						<Trans>Simple Process</Trans>
					</Badge>

					<h2 className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
						<Trans>
							<span className="inline-block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
								Create Your Resume
							</span>
							<br />
							<span className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
								In 3 Easy Steps
							</span>
						</Trans>
					</h2>

					<p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
						<Trans>
							Building a professional resume has never been easier. Follow our simple 3-step process and land your dream
							job in minutes, not hours.
						</Trans>
					</p>
				</motion.div>

				{/* Steps */}
				<div className="mx-auto max-w-5xl space-y-16 lg:space-y-24">
					{steps.map((step, index) => (
						<StepCard key={step.number} {...step} index={index} />
					))}
				</div>

				{/* CTA Section */}
				<motion.div
					className="mt-20 text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<div className="mx-auto max-w-2xl rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 backdrop-blur-sm md:p-12">
						<DownloadIcon size={48} weight="duotone" className="mx-auto mb-6 text-primary" />
						<h3 className="mb-4 font-bold text-2xl md:text-3xl">
							<Trans>Ready to Get Started?</Trans>
						</h3>
						<p className="mb-8 text-muted-foreground leading-relaxed">
							<Trans>
								Join thousands of professionals who have already created their perfect resume with CVCraft. It's free,
								fast, and incredibly easy!
							</Trans>
						</p>
						<motion.a
							href="/auth/register"
							className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Trans>Start Building Free</Trans>
							<ArrowRightIcon size={20} weight="bold" />
						</motion.a>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
