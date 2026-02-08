import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { GithubLogoIcon, HeartIcon, UsersIcon } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";

export function Prefooter() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

	return (
		<section ref={containerRef} id="prefooter" className="relative overflow-hidden py-24 md:py-32 lg:py-40">
			{/* Animated Background */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0">
				<motion.div
					style={{ y, opacity }}
					className="absolute start-1/4 top-1/4 size-[600px] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"
				/>
				<motion.div
					style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]), opacity }}
					className="absolute end-1/4 bottom-1/4 size-[600px] rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl"
				/>
			</div>

			<div className="container relative mx-auto px-4 sm:px-6 lg:px-12">
				<motion.div
					style={{ scale }}
					className="mx-auto max-w-4xl space-y-12 text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Badge variant="secondary" className="gap-2 px-4 py-2 text-sm backdrop-blur-sm">
							<HeartIcon weight="fill" className="size-4 text-primary" />
							<Trans>Made with Passion</Trans>
						</Badge>
					</motion.div>

					{/* Main Heading */}
					<motion.h2
						className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<Trans>
							<span className="inline-block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
								Crafted with
							</span>{" "}
							<span className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
								Passion
							</span>
							<br />
							<span className="inline-block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
								Built for
							</span>{" "}
							<span className="inline-block bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400">
								Everyone
							</span>
						</Trans>
					</motion.h2>

					{/* Description */}
					<motion.p
						className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						<Trans>
							CVCraft was built from the ground up with one mission: to provide a powerful, free, and privacy-focused
							resume builder for everyone. Every feature, every template, and every line of code was carefully crafted
							to ensure you have the best experience possible. No ads, no tracking, no hidden costs—just a tool that
							works for you.
						</Trans>
					</motion.p>

					{/* Stats/Icons */}
					<motion.div
						className="flex flex-wrap items-center justify-center gap-6 pt-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.5 }}
					>
						{[
							{ icon: GithubLogoIcon, label: t`Open Source`, color: "text-purple-600 dark:text-purple-400" },
							{ icon: HeartIcon, label: t`Made with Love`, color: "text-pink-600 dark:text-pink-400" },
							{ icon: UsersIcon, label: t`Built for You`, color: "text-blue-600 dark:text-blue-400" },
						].map((item, i) => (
							<motion.div
								key={item.label}
								className="flex items-center gap-3 rounded-full border-2 border-border/50 bg-card/50 px-6 py-3 backdrop-blur-sm"
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.6 + i * 0.1 }}
								whileHover={{ scale: 1.05 }}
							>
								<item.icon weight="fill" className={`size-5 ${item.color}`} />
								<span className="font-medium text-sm">{item.label}</span>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
