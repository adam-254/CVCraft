import { Trans } from "@lingui/react/macro";
import { KeyIcon, LockOpenIcon, ToggleLeftIcon, ToggleRightIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { match } from "ts-pattern";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/dialogs/store";
import { authClient } from "@/integrations/auth/client";
import { useAuthAccounts } from "./hooks";

export function TwoFactorSection() {
	const { openDialog } = useDialogStore();
	const { hasAccount } = useAuthAccounts();
	const { data: session } = authClient.useSession();

	const hasPassword = useMemo(() => hasAccount("credential"), [hasAccount]);
	const hasTwoFactor = useMemo(() => session?.user.twoFactorEnabled ?? false, [session]);

	const handleTwoFactorAction = useCallback(() => {
		if (hasTwoFactor) {
			openDialog("auth.two-factor.disable", undefined);
		} else {
			openDialog("auth.two-factor.enable", undefined);
		}
	}, [hasTwoFactor, openDialog]);

	if (!hasPassword) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.2 }}
			className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-gradient-to-br from-card via-card to-green-500/5 p-8 shadow-xl transition-all hover:shadow-2xl"
		>
			{/* Decorative gradient overlay */}
			<div className="absolute top-0 right-0 size-40 rounded-full bg-gradient-to-br from-green-500/10 to-transparent blur-3xl transition-all group-hover:scale-150" />

			<div className="relative flex items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<div
						className={`flex size-12 items-center justify-center rounded-xl shadow-md ${
							hasTwoFactor
								? "bg-gradient-to-br from-green-500/20 to-green-500/10"
								: "bg-gradient-to-br from-amber-500/20 to-amber-500/10"
						}`}
					>
						{hasTwoFactor ? (
							<LockOpenIcon className="size-6 text-green-600" weight="bold" />
						) : (
							<KeyIcon className="size-6 text-amber-600" weight="bold" />
						)}
					</div>
					<div>
						<h2 className="font-semibold text-lg">
							<Trans>Two-Factor Authentication</Trans>
						</h2>
						<p className="text-muted-foreground text-sm">
							{hasTwoFactor ? <Trans>2FA is currently enabled</Trans> : <Trans>Add an extra layer of security</Trans>}
						</p>
					</div>
				</div>

				{match(hasTwoFactor)
					.with(true, () => (
						<Button
							variant="outline"
							onClick={handleTwoFactorAction}
							className="gap-2 border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent font-semibold transition-all hover:scale-105 hover:border-amber-500/50 hover:bg-amber-500/20 hover:shadow-amber-500/20 hover:shadow-lg"
						>
							<ToggleLeftIcon weight="bold" />
							<Trans>Disable</Trans>
						</Button>
					))
					.with(false, () => (
						<Button
							variant="outline"
							onClick={handleTwoFactorAction}
							className="gap-2 border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-transparent font-semibold transition-all hover:scale-105 hover:border-green-500/50 hover:bg-green-500/20 hover:shadow-green-500/20 hover:shadow-lg"
						>
							<ToggleRightIcon weight="bold" />
							<Trans>Enable</Trans>
						</Button>
					))
					.exhaustive()}
			</div>
		</motion.div>
	);
}
