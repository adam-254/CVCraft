import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { EyeIcon, EyeSlashIcon, LockIcon, LockOpenIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { orpc } from "@/integrations/orpc/client";
import { useCoverLetterBuilderStore } from "../../-store/cover-letter";

export function CoverLetterSettings() {
	const coverLetter = useCoverLetterBuilderStore((state) => state.coverLetter);
	const updateCoverLetter = useCoverLetterBuilderStore((state) => state.updateCoverLetter);

	const { mutateAsync: updateSettings } = useMutation(orpc.coverLetter.update.mutationOptions());

	const handlePublicToggle = async (isPublic: boolean) => {
		try {
			await updateSettings({
				id: coverLetter.id,
				isPublic,
			});
			updateCoverLetter((draft) => {
				draft.isPublic = isPublic;
			});
			toast.success(isPublic ? t`Cover letter is now public` : t`Cover letter is now private`);
		} catch (error) {
			toast.error(t`Failed to update visibility`);
		}
	};

	const handleLockToggle = async (isLocked: boolean) => {
		try {
			await updateSettings({
				id: coverLetter.id,
				isLocked,
			});
			updateCoverLetter((draft) => {
				draft.isLocked = isLocked;
			});
			toast.success(isLocked ? t`Cover letter is now locked` : t`Cover letter is now unlocked`);
		} catch (error) {
			toast.error(t`Failed to update lock status`);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<Label className="flex items-center gap-2">
						{coverLetter.isPublic ? <EyeIcon className="size-4" /> : <EyeSlashIcon className="size-4" />}
						<Trans>Public</Trans>
					</Label>
					<p className="text-muted-foreground text-xs">
						<Trans>Allow others to view this cover letter</Trans>
					</p>
				</div>
				<Switch checked={coverLetter.isPublic} onCheckedChange={handlePublicToggle} />
			</div>

			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<Label className="flex items-center gap-2">
						{coverLetter.isLocked ? <LockIcon className="size-4" /> : <LockOpenIcon className="size-4" />}
						<Trans>Locked</Trans>
					</Label>
					<p className="text-muted-foreground text-xs">
						<Trans>Prevent editing of this cover letter</Trans>
					</p>
				</div>
				<Switch checked={coverLetter.isLocked} onCheckedChange={handleLockToggle} />
			</div>

			<div className="space-y-2">
				<Label>
					<Trans>Export Options</Trans>
				</Label>
				<div className="grid gap-2">
					<Button variant="outline" size="sm">
						<Trans>Download as PDF</Trans>
					</Button>
					<Button variant="outline" size="sm">
						<Trans>Download as Word</Trans>
					</Button>
					<Button variant="outline" size="sm">
						<Trans>Download as Text</Trans>
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<Label>
					<Trans>AI Assistance</Trans>
				</Label>
				<div className="grid gap-2">
					<Button variant="outline" size="sm">
						<Trans>Improve Writing</Trans>
					</Button>
					<Button variant="outline" size="sm">
						<Trans>Check Grammar</Trans>
					</Button>
					<Button variant="outline" size="sm">
						<Trans>Suggest Improvements</Trans>
					</Button>
				</div>
			</div>
		</div>
	);
}
