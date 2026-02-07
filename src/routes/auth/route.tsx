import { ArrowLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="relative flex min-h-svh w-dvw items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/5 to-background py-8">
			{/* Animated Background */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0">
				<motion.div
					className="absolute start-1/4 top-1/4 size-[500px] rounded-full bg-purple-500/10 blur-3xl"
					animate={{
						x: [0, 100, 0],
						y: [0, -50, 0],
						scale: [1, 1.2, 1],
					}}
					transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
				/>
				<motion.div
					className="absolute end-1/4 bottom-1/4 size-[600px] rounded-full bg-blue-500/10 blur-3xl"
					animate={{
						x: [0, -80, 0],
						y: [0, 60, 0],
						scale: [1, 1.3, 1],
					}}
					transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
				/>
			</div>

			{/* Back to Home Button */}
			<motion.div
				className="absolute top-6 left-6"
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<Button asChild variant="ghost" size="sm" className="gap-2 rounded-xl">
					<Link to="/">
						<ArrowLeftIcon className="size-4" />
						<span className="hidden sm:inline">Back to Home</span>
					</Link>
				</Button>
			</motion.div>

			{/* Auth Card */}
			<motion.div
				className="relative z-10 mx-auto w-full max-w-md px-4 xs:px-0"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<div className="overflow-hidden rounded-3xl border-2 border-border/50 bg-card/80 shadow-2xl backdrop-blur-xl">
					{/* Gradient Border Effect */}
					<div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-primary/20 blur-xl" />

					{/* Content */}
					<div className="max-h-[calc(100svh-8rem)] space-y-6 overflow-y-auto p-6 sm:p-8">
						{/* Logo */}
						<motion.div
							className="flex justify-center"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<div className="relative">
								<div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
								<BrandIcon className="relative size-14" />
							</div>
						</motion.div>

						{/* Form Content */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<Outlet />
						</motion.div>
					</div>
				</div>

				{/* Bottom Text */}
				<motion.p
					className="mt-4 text-center text-muted-foreground text-xs"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.5 }}
				>
					© {new Date().getFullYear()} CVCraft. All rights reserved.
				</motion.p>
			</motion.div>
		</div>
	);
}
