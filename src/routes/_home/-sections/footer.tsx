import { Trans } from "@lingui/react/macro";
import { CodeIcon, HeartIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { BrandIcon } from "@/components/ui/brand-icon";

export function Footer() {
	const currentYear = new Date().getFullYear();

	const features = [
		{ icon: CodeIcon, label: "Open Source" },
		{ icon: ShieldCheckIcon, label: "Privacy First" },
		{ icon: HeartIcon, label: "Free Forever" },
	];

	return (
		<motion.footer
			id="footer"
			className="relative overflow-hidden border-t bg-gradient-to-b from-background via-secondary/10 to-secondary/20"
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
		>
			{/* Background decoration */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0">
				<div className="absolute start-1/4 top-0 size-96 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute end-1/4 bottom-0 size-96 rounded-full bg-primary/5 blur-3xl" />
			</div>

			<div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-12">
				{/* Main Content */}
				<div className="mx-auto max-w-6xl">
					{/* Top Section */}
					<div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
						{/* Brand Section */}
						<motion.div
							className="flex flex-col items-center gap-6 lg:items-start"
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<div className="flex items-center gap-3">
								<BrandIcon variant="logo" className="size-12" />
								<div className="text-left">
									<h2 className="font-bold text-2xl tracking-tight">CVCraft</h2>
									<p className="text-muted-foreground text-sm">
										<Trans>Resume Builder</Trans>
									</p>
								</div>
							</div>

							<p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
								<Trans>
									A free and open-source resume builder that simplifies the process of creating, updating, and sharing
									your resume.
								</Trans>
							</p>
						</motion.div>

						{/* Features Pills */}
						<motion.div
							className="flex flex-wrap items-center justify-center gap-3 lg:justify-end"
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.1 }}
						>
							{features.map((feature, i) => (
								<motion.div
									key={feature.label}
									className="flex items-center gap-2 rounded-full border-2 border-border/50 bg-card/50 px-4 py-2 backdrop-blur-sm"
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.2 + i * 0.1 }}
									whileHover={{ scale: 1.05 }}
								>
									<feature.icon weight="fill" className="size-4 text-primary" />
									<span className="font-medium text-xs">{feature.label}</span>
								</motion.div>
							))}
						</motion.div>
					</div>

					{/* Divider */}
					<motion.div
						className="my-12 h-px bg-gradient-to-r from-transparent via-border to-transparent"
						initial={{ opacity: 0, scaleX: 0 }}
						whileInView={{ opacity: 1, scaleX: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.3 }}
					/>

					{/* Bottom Section */}
					<motion.div
						className="flex flex-col items-center justify-center gap-4 sm:flex-row"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						{/* Copyright & Creator */}
						<div className="flex flex-col items-center gap-2 text-center">
							<p className="text-muted-foreground text-sm">
								© {currentYear} CVCraft. <Trans>All rights reserved.</Trans>
							</p>
							<p className="flex items-center gap-2 text-muted-foreground text-sm">
								<Trans>Made by</Trans>
								<span className="font-semibold text-foreground">Vincent Adam</span>
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</motion.footer>
	);
}
