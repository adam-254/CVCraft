import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon, CheckCircleIcon, RocketLaunchIcon, SparkleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
	const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

	return (
		<section
			ref={containerRef}
			id="hero"
			className="relative flex min-h-svh w-svw flex-col items-center justify-center overflow-hidden py-24"
		>
			{/* Animated gradient background */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<motion.div
					className="absolute -inset-[100%] opacity-30 dark:opacity-20"
					animate={{
						background: [
							"radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 40% 20%, rgba(119, 198, 255, 0.3), transparent 50%)",
							"radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 60% 80%, rgba(119, 198, 255, 0.3), transparent 50%)",
							"radial-gradient(circle at 40% 80%, rgba(119, 198, 255, 0.3), transparent 50%), radial-gradient(circle at 60% 20%, rgba(255, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%)",
						],
					}}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
				/>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)]" />
			</div>

			{/* Floating orbs */}
			<motion.div
				className="absolute top-1/4 left-1/4 size-64 rounded-full bg-purple-500/10 blur-3xl"
				animate={{
					x: [0, 100, 0],
					y: [0, -50, 0],
					scale: [1, 1.2, 1],
				}}
				transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-blue-500/10 blur-3xl"
				animate={{
					x: [0, -80, 0],
					y: [0, 60, 0],
					scale: [1, 1.3, 1],
				}}
				transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
			/>

			<motion.div
				style={{ y, opacity }}
				className="relative z-10 flex w-full max-w-7xl flex-col items-center gap-y-12 px-4 xs:px-6"
			>
				{/* Badge */}
				<motion.a
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					href="#features"
					className="group"
				>
					<Badge
						variant="secondary"
						className="h-auto gap-2 border border-border/50 px-4 py-2 text-sm backdrop-blur-sm transition-all hover:border-border"
					>
						<motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
							<SparkleIcon aria-hidden="true" className="size-4" weight="fill" />
						</motion.div>
						<Trans>Everything You Need In One Place</Trans>
						<ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-1" />
					</Badge>
				</motion.a>

				{/* Main headline with gradient text */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="flex flex-col items-center gap-y-6 text-center"
				>
					<h1 className="max-w-5xl font-bold text-5xl tracking-tight md:text-7xl lg:text-8xl">
						<Trans>
							<span className="inline-block bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
								Craft Your Perfect
							</span>
							<br />
							<span className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
								Resume in Minutes
							</span>
						</Trans>
					</h1>

					<p className="max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
						<Trans>
							The most powerful, privacy-focused resume builder. Free forever, open-source, and designed to help you
							land your dream job.
						</Trans>
					</p>
				</motion.div>

				{/* Feature pills */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.8 }}
					className="flex flex-wrap items-center justify-center gap-3"
				>
					{[
						{ icon: CheckCircleIcon, text: t`Simple Authentication` },
						{ icon: CheckCircleIcon, text: t`100% Free & Open Source` },
						{ icon: CheckCircleIcon, text: t`AI-Powered` },
					].map((item, i) => (
						<motion.div
							key={item.text}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 1 + i * 0.1 }}
							className="flex items-center gap-2 rounded-full border border-border/30 bg-secondary/50 px-4 py-2 text-sm backdrop-blur-sm"
						>
							<item.icon className="size-4 text-green-600 dark:text-green-400" weight="fill" />
							<span className="font-medium">{item.text}</span>
						</motion.div>
					))}
				</motion.div>

				{/* CTA Buttons */}
				<motion.div
					className="flex flex-col items-center gap-4 sm:flex-row"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 1.2 }}
				>
					<Button
						asChild
						size="lg"
						className="group relative h-14 overflow-hidden px-8 text-base shadow-lg shadow-primary/20"
					>
						<Link to="/dashboard">
							<motion.div
								className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.3 }}
							/>
							<span className="relative z-10 flex items-center gap-2 font-semibold">
								<RocketLaunchIcon aria-hidden="true" className="size-5" weight="fill" />
								<Trans>Start Building Free</Trans>
								<ArrowRightIcon aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
							</span>
						</Link>
					</Button>
				</motion.div>

				{/* Preview mockup */}
				<motion.div
					initial={{ opacity: 0, y: 100, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
					className="relative mt-12 w-full max-w-6xl"
				>
					<div className="relative rounded-2xl border-2 border-border/50 bg-card/50 p-2 shadow-2xl backdrop-blur-sm md:p-4">
						<div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-xl" />
						<video
							loop
							muted
							autoPlay
							playsInline
							// @ts-expect-error - typescript doesn't know about fetchPriority for video elements
							fetchPriority="high"
							src="/videos/timelapse.mp4"
							aria-label={t`Timelapse demonstration of building a resume with CVCraft`}
							className="pointer-events-none relative size-full rounded-xl object-cover shadow-xl"
						/>
					</div>
				</motion.div>
			</motion.div>

			{/* Scroll indicator */}
			<motion.div
				aria-hidden="true"
				role="presentation"
				className="absolute start-1/2 bottom-8 -translate-x-1/2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 2, duration: 1 }}
			>
				<motion.div
					className="flex h-12 w-7 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-2"
					animate={{ y: [0, 8, 0] }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
				>
					<motion.div className="h-2 w-1.5 rounded-full bg-muted-foreground/50" />
				</motion.div>
			</motion.div>
		</section>
	);
}
