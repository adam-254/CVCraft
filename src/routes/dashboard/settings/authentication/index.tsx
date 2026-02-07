import { Trans } from "@lingui/react/macro";
import { ShieldCheckIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { useEnabledProviders } from "./-components/hooks";
import { PasswordSection } from "./-components/password";
import { SocialProviderSection } from "./-components/social-provider";
import { TwoFactorSection } from "./-components/two-factor";

export const Route = createFileRoute("/dashboard/settings/authentication/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { enabledProviders } = useEnabledProviders();

	return (
		<div className="relative mx-auto w-full max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-0 -left-32 size-64 animate-pulse rounded-full bg-gradient-to-br from-green-500/20 to-transparent blur-3xl" />
				<div className="absolute top-32 -right-32 size-96 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl delay-1000" />
				<div className="absolute top-64 left-1/2 size-80 animate-pulse rounded-full bg-gradient-to-br from-purple-500/15 to-transparent blur-3xl delay-500" />
			</div>

			{/* Header Section */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="relative space-y-3 text-center"
			>
				<div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 via-green-500/10 to-green-500/5 shadow-lg">
					<ShieldCheckIcon className="size-8 text-green-600" weight="duotone" />
				</div>
				<div>
					<h1 className="font-bold text-3xl tracking-tight">
						<Trans>Authentication</Trans>
					</h1>
					<p className="mt-2 text-muted-foreground">
						<Trans>Manage your security settings and authentication methods</Trans>
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
				<PasswordSection />

				<TwoFactorSection />

				{"google" in enabledProviders && <SocialProviderSection provider="google" animationDelay={0.4} />}

				{"github" in enabledProviders && <SocialProviderSection provider="github" animationDelay={0.5} />}

				{"custom" in enabledProviders && (
					<SocialProviderSection provider="custom" animationDelay={0.6} name={enabledProviders.custom} />
				)}

				{/* Security Info Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7, duration: 0.4 }}
					className="rounded-xl border-2 border-border/30 bg-gradient-to-br from-muted/40 to-muted/10 p-5 shadow-md"
				>
					<div className="flex items-start gap-4">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 shadow-sm">
							<span className="text-2xl">🔒</span>
						</div>
						<div className="space-y-1.5">
							<p className="font-semibold text-foreground text-sm">
								<Trans>Security Best Practices</Trans>
							</p>
							<p className="text-muted-foreground text-sm leading-relaxed">
								<Trans>
									Enable two-factor authentication via email for enhanced security. Keep your password strong and unique.
								</Trans>
							</p>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
