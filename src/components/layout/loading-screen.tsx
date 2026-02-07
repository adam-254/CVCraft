import { Trans } from "@lingui/react/macro";
import { motion } from "motion/react";
import { BrandIcon } from "@/components/ui/brand-icon";

export function LoadingScreen() {
	return (
		<div className="fixed inset-0 z-50 flex h-svh w-svw items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0">
				<motion.div
					className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/20 blur-3xl"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-blue-500/20 blur-3xl"
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.5, 0.3, 0.5],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1,
					}}
				/>
				<motion.div
					className="absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/15 blur-3xl"
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{
						duration: 5,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 2,
					}}
				/>
			</div>

			{/* Main Content */}
			<div className="relative flex flex-col items-center gap-8">
				{/* Logo with Pulse Animation */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="relative"
				>
					<motion.div
						className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
						animate={{
							scale: [1, 1.5, 1],
							opacity: [0.5, 0, 0.5],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						animate={{
							rotate: 360,
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "linear",
						}}
					>
						<BrandIcon className="relative size-20" />
					</motion.div>
				</motion.div>

				{/* Loading Text */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="flex flex-col items-center gap-4"
				>
					<h2 className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text font-bold text-2xl text-transparent">
						<Trans>Loading</Trans>
					</h2>

					{/* Animated Dots */}
					<div className="flex items-center gap-2">
						{[0, 1, 2].map((i) => (
							<motion.div
								key={i}
								className="size-2 rounded-full bg-primary"
								animate={{
									scale: [1, 1.5, 1],
									opacity: [0.3, 1, 0.3],
								}}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: "easeInOut",
									delay: i * 0.2,
								}}
							/>
						))}
					</div>
				</motion.div>

				{/* Progress Bar */}
				<motion.div
					initial={{ opacity: 0, width: 0 }}
					animate={{ opacity: 1, width: 200 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="relative h-1 overflow-hidden rounded-full bg-muted"
				>
					<motion.div
						className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-blue-500 to-purple-500"
						animate={{
							x: ["-100%", "200%"],
						}}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						style={{ width: "50%" }}
					/>
				</motion.div>

				{/* Tagline */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="text-center text-muted-foreground text-sm"
				>
					<Trans>Preparing your experience...</Trans>
				</motion.p>
			</div>
		</div>
	);
}
