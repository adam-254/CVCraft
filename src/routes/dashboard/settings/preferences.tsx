import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon, GearSixIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LocaleCombobox } from "@/components/locale/combobox";
import { ThemeCombobox } from "@/components/theme/combobox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/settings/preferences")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="relative mx-auto w-full max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-0 -left-32 size-64 animate-pulse rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
				<div className="absolute top-32 -right-32 size-96 animate-pulse rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-3xl delay-1000" />
				<div className="absolute top-64 left-1/2 size-80 animate-pulse rounded-full bg-gradient-to-br from-blue-500/15 to-transparent blur-3xl delay-500" />
			</div>

			{/* Header Section */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="relative space-y-3 text-center"
			>
				<div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-lg">
					<GearSixIcon className="size-8 text-primary" weight="duotone" />
				</div>
				<div>
					<h1 className="font-bold text-3xl tracking-tight">
						<Trans>Preferences</Trans>
					</h1>
					<p className="mt-2 text-muted-foreground">
						<Trans>Customize your experience with theme and language settings</Trans>
					</p>
				</div>
			</motion.div>

			<Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="relative mx-auto max-w-2xl space-y-6"
			>
				{/* Theme Section */}
				<div className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-gradient-to-br from-card via-card to-primary/5 p-8 shadow-xl transition-all hover:shadow-2xl">
					{/* Decorative gradient overlay */}
					<div className="absolute top-0 right-0 size-40 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl transition-all group-hover:scale-150" />

					<div className="relative space-y-5">
						<div className="flex items-start justify-between gap-4">
							<div className="space-y-2">
								<Label className="flex items-center gap-3 font-semibold text-lg">
									<div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-md">
										<GearSixIcon className="size-5 text-primary" weight="bold" />
									</div>
									<Trans>Theme</Trans>
								</Label>
								<p className="text-muted-foreground text-sm">
									<Trans>Choose your preferred color scheme</Trans>
								</p>
							</div>

							{/* Decorative badge */}
							<div className="rounded-full border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-1.5 font-semibold text-primary text-xs shadow-sm">
								<Trans>Appearance</Trans>
							</div>
						</div>

						<ThemeCombobox />
					</div>
				</div>

				{/* Language Section */}
				<div className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-gradient-to-br from-card via-card to-purple-500/5 p-8 shadow-xl transition-all hover:shadow-2xl">
					{/* Decorative gradient overlay */}
					<div className="absolute top-0 right-0 size-40 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl transition-all group-hover:scale-150" />

					<div className="relative space-y-5">
						<div className="flex items-start justify-between gap-4">
							<div className="space-y-2">
								<Label className="flex items-center gap-3 font-semibold text-lg">
									<div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 shadow-md">
										<span className="text-xl">🌐</span>
									</div>
									<Trans>Language</Trans>
								</Label>
								<p className="text-muted-foreground text-sm">
									<Trans>Select your preferred language</Trans>
								</p>
							</div>

							{/* Decorative badge */}
							<div className="rounded-full border-2 border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-purple-500/5 px-4 py-1.5 font-semibold text-purple-500 text-xs shadow-sm">
								<Trans>Localization</Trans>
							</div>
						</div>

						<LocaleCombobox />

						{/* Help translate section */}
						<div className="mt-6 rounded-xl border-2 border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent p-5 shadow-sm">
							<div className="flex items-start gap-4">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 shadow-sm">
									<span className="text-2xl">💬</span>
								</div>
								<div className="flex-1 space-y-3">
									<div>
										<p className="font-semibold text-foreground text-sm">
											<Trans>Help us translate</Trans>
										</p>
										<p className="mt-1 text-muted-foreground text-sm">
											<Trans>Contribute to making CVCraft available in more languages</Trans>
										</p>
									</div>
									<Button
										asChild
										size="sm"
										variant="outline"
										className="h-9 gap-2 border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent font-semibold text-blue-600 text-xs transition-all hover:scale-105 hover:border-blue-500/50 hover:bg-blue-500/20 hover:shadow-blue-500/20 hover:shadow-lg"
									>
										<a href="https://crowdin.com/project/reactive-resume" target="_blank" rel="noopener">
											<Trans>Join translation team</Trans>
											<ArrowRightIcon className="size-3.5" weight="bold" />
										</a>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Info Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="rounded-xl border-2 border-border/30 bg-gradient-to-br from-muted/40 to-muted/10 p-5 shadow-md"
				>
					<div className="flex items-start gap-4">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
							<span className="text-2xl">💡</span>
						</div>
						<div className="space-y-1.5">
							<p className="font-semibold text-foreground text-sm">
								<Trans>Quick Tip</Trans>
							</p>
							<p className="text-muted-foreground text-sm leading-relaxed">
								<Trans>
									Your preferences are automatically saved and will be applied across all your devices when you sign in.
								</Trans>
							</p>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
