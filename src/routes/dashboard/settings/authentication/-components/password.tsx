import { Trans } from "@lingui/react/macro";
import { PasswordIcon, PencilSimpleLineIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { match } from "ts-pattern";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/dialogs/store";
import { useAuthAccounts } from "./hooks";

export function PasswordSection() {
	const navigate = useNavigate();
	const { openDialog } = useDialogStore();
	const { hasAccount } = useAuthAccounts();

	const hasPassword = useMemo(() => hasAccount("credential"), [hasAccount]);

	const handleUpdatePassword = useCallback(() => {
		if (hasPassword) {
			openDialog("auth.change-password", undefined);
		} else {
			navigate({ to: "/auth/forgot-password" });
		}
	}, [hasPassword, navigate, openDialog]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.1 }}
			className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-gradient-to-br from-card via-card to-blue-500/5 p-8 shadow-xl transition-all hover:shadow-2xl"
		>
			{/* Decorative gradient overlay */}
			<div className="absolute top-0 right-0 size-40 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-3xl transition-all group-hover:scale-150" />

			<div className="relative flex items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 shadow-md">
						<PasswordIcon className="size-6 text-blue-600" weight="bold" />
					</div>
					<div>
						<h2 className="font-semibold text-lg">
							<Trans>Password</Trans>
						</h2>
						<p className="text-muted-foreground text-sm">
							{hasPassword ? (
								<Trans>Update your account password</Trans>
							) : (
								<Trans>Set a password for your account</Trans>
							)}
						</p>
					</div>
				</div>

				{match(hasPassword)
					.with(true, () => (
						<Button
							variant="outline"
							onClick={handleUpdatePassword}
							className="gap-2 border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent font-semibold transition-all hover:scale-105 hover:border-blue-500/50 hover:bg-blue-500/20 hover:shadow-blue-500/20 hover:shadow-lg"
						>
							<PencilSimpleLineIcon weight="bold" />
							<Trans>Update</Trans>
						</Button>
					))
					.with(false, () => (
						<Button
							variant="outline"
							asChild
							className="gap-2 border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent font-semibold transition-all hover:scale-105 hover:border-blue-500/50 hover:bg-blue-500/20 hover:shadow-blue-500/20 hover:shadow-lg"
						>
							<Link to="/auth/forgot-password">
								<Trans>Set Password</Trans>
							</Link>
						</Button>
					))
					.exhaustive()}
			</div>
		</motion.div>
	);
}
