import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon, TranslateIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring } from "motion/react";
import * as React from "react";
import { useEffect, useRef } from "react";
import { LocaleCombobox } from "@/components/locale/combobox";
import { ThemeToggleButton } from "@/components/theme/toggle-button";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Button } from "@/components/ui/button";
import { ProductHuntBanner } from "./product-hunt-banner";

export function Header() {
	const y = useMotionValue(0);
	const lastScroll = useRef(0);
	const ticking = useRef(false);
	const springY = useSpring(y, { stiffness: 300, damping: 40 });
	const [hasScrolled, setHasScrolled] = React.useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;

		function onScroll() {
			const current = window.scrollY ?? 0;
			setHasScrolled(current > 50);

			if (!ticking.current) {
				window.requestAnimationFrame(() => {
					if (current > 32 && current > lastScroll.current) {
						// Scrolling down, hide
						y.set(-100);
					} else {
						// Scrolling up, show
						y.set(0);
					}
					lastScroll.current = current;
					ticking.current = false;
				});
				ticking.current = true;
			}
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [y]);

	return (
		<motion.header
			style={{ y: springY }}
			className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
				hasScrolled
					? "border-border/50 bg-background/80 shadow-lg backdrop-blur-xl"
					: "border-transparent bg-transparent"
			}`}
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<ProductHuntBanner />

			<nav aria-label={t`Main navigation`} className="container mx-auto flex items-center gap-x-4 px-4 py-4 lg:px-12">
				<Link
					to="/"
					className="group flex items-center gap-3 transition-opacity hover:opacity-80"
					aria-label={t`CVCraft - Go to homepage`}
				>
					<motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
						<BrandIcon className="size-9" />
					</motion.div>
					<span className="hidden font-bold text-lg tracking-tight md:inline-block">CVCraft</span>
				</Link>

				{/* Navigation links - hidden on mobile */}
				<div className="ml-8 hidden items-center gap-x-6 lg:flex">
					<a
						href="#features"
						className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
					>
						<Trans>Features</Trans>
					</a>
					<a
						href="#templates"
						className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
					>
						<Trans>Templates</Trans>
					</a>
				</div>

				<div className="ml-auto flex items-center gap-x-2">
					<LocaleCombobox
						buttonProps={{
							size: "icon",
							variant: "ghost",
							className: "justify-center hover:bg-secondary/80",
							"aria-label": t`Change language`,
							children: () => <TranslateIcon aria-hidden="true" />,
						}}
					/>

					<ThemeToggleButton />

					<div className="hidden items-center gap-x-2 sm:flex">
						<Button
							asChild
							size="default"
							className="gap-2 font-semibold shadow-md transition-shadow hover:shadow-lg"
							aria-label={t`Go to dashboard`}
						>
							<Link to="/dashboard">
								<Trans>Get Started</Trans>
								<ArrowRightIcon aria-hidden="true" className="size-4" />
							</Link>
						</Button>
					</div>

					{/* Mobile CTA */}
					<Button asChild size="icon" className="sm:hidden" aria-label={t`Go to dashboard`}>
						<Link to="/dashboard">
							<ArrowRightIcon aria-hidden="true" />
						</Link>
					</Button>
				</div>
			</nav>
		</motion.header>
	);
}
