import type { Passkey } from "@better-auth/passkey";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { FingerprintIcon, PlusIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { usePrompt } from "@/hooks/use-prompt";
import { authClient } from "@/integrations/auth/client";
import { useAuthPasskeys } from "./hooks";

export function PasskeysSection() {
	const prompt = usePrompt();
	const queryClient = useQueryClient();
	const { passkeys } = useAuthPasskeys();

	const handleAddPasskey = async () => {
		const name = await prompt(t`What do you want to call this passkey?`);
		if (!name) return;

		const toastId = toast.loading(t`Adding your passkey...`);

		const { error } = await authClient.passkey.addPasskey({ name, useAutoRegister: true });

		if (error) {
			toast.error(error.message, { id: toastId });
			return;
		}

		toast.success(t`Your passkey has been added successfully.`, { id: toastId });
		queryClient.invalidateQueries({ queryKey: ["auth", "passkeys"] });
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.3 }}
			className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-gradient-to-br from-card via-card to-purple-500/5 p-8 shadow-xl transition-all hover:shadow-2xl"
		>
			{/* Decorative gradient overlay */}
			<div className="absolute top-0 right-0 size-40 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl transition-all group-hover:scale-150" />

			<div className="relative space-y-5">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 shadow-md">
							<FingerprintIcon className="size-6 text-purple-600" weight="bold" />
						</div>
						<div>
							<h2 className="font-semibold text-lg">
								<Trans>Passkeys</Trans>
							</h2>
							<p className="text-muted-foreground text-sm">
								<Trans>Secure passwordless authentication</Trans>
							</p>
						</div>
					</div>

					<Button
						variant="outline"
						onClick={handleAddPasskey}
						className="gap-2 border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-transparent font-semibold transition-all hover:scale-105 hover:border-purple-500/50 hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20"
					>
						<PlusIcon weight="bold" />
						<Trans>Add Device</Trans>
					</Button>
				</div>

				<AnimatePresence>
					{passkeys.length > 0 && (
						<div className="space-y-2 rounded-xl border-2 border-border/30 bg-gradient-to-br from-muted/20 to-transparent p-4">
							{passkeys.map((passkey) => (
								<PasskeyItem key={passkey.id} passkey={passkey} />
							))}
						</div>
					)}
				</AnimatePresence>

				{passkeys.length === 0 && (
					<div className="rounded-xl border-2 border-border/50 border-dashed bg-muted/20 p-5 text-center">
						<p className="text-muted-foreground text-sm">
							<Trans>No passkeys registered yet. Add your first device to get started.</Trans>
						</p>
					</div>
				)}
			</div>
		</motion.div>
	);
}

type PasskeyItemProps = {
	passkey: Passkey;
};

function PasskeyItem({ passkey }: PasskeyItemProps) {
	const confirm = useConfirm();
	const queryClient = useQueryClient();

	const handleDelete = async () => {
		const confirmed = await confirm(t`Are you sure you want to delete this passkey?`, {
			description: t`You cannot use the passkey "${passkey.name ?? "(WebAuthn Device)"}" anymore to sign in after deletion. This action cannot be undone.`,
			confirmText: "Delete",
			cancelText: "Cancel",
		});
		if (!confirmed) return;

		const toastId = toast.loading(t`Deleting your passkey...`);

		const { error } = await authClient.passkey.deletePasskey({ id: passkey.id });

		if (error) {
			toast.error(error.message, { id: toastId });
			return;
		}

		toast.success(t`Your passkey has been deleted successfully.`, { id: toastId });
		queryClient.invalidateQueries({ queryKey: ["auth", "passkeys"] });
	};

	return (
		<motion.div
			key={passkey.id}
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="group/item flex items-center gap-3 rounded-lg border border-border/30 bg-gradient-to-r from-background to-muted/10 p-3 transition-all hover:border-border/50 hover:bg-muted/20"
		>
			<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10">
				<FingerprintIcon className="size-4 text-purple-500" weight="bold" />
			</div>

			<div className="flex-1 space-y-0.5">
				<p className="truncate font-medium text-sm">{passkey.name ?? "WebAuthn Device"}</p>
				<p className="truncate text-muted-foreground text-xs">
					<Trans>Added on {passkey.createdAt.toLocaleDateString()}</Trans>
				</p>
			</div>

			<Button
				size="icon"
				variant="ghost"
				className="size-8 shrink-0 text-destructive opacity-0 transition-all hover:bg-destructive/10 group-hover/item:opacity-100"
				onClick={handleDelete}
			>
				<TrashSimpleIcon weight="bold" />
			</Button>
		</motion.div>
	);
}
