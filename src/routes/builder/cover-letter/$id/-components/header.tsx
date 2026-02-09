import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowLeftIcon, FloppyDiskIcon, GearIcon, ShareIcon, SidebarIcon } from "@phosphor-icons/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { authClient } from "@/integrations/auth/client";
import { orpc } from "@/integrations/orpc/client";
import { useBuilderSidebar } from "../-store/sidebar";

export function BuilderHeader() {
	const { data: session } = authClient.useSession();
	const params = useParams({ from: "/builder/cover-letter/$id" });
	const [_, copyToClipboard] = useCopyToClipboard();

	const { data: coverLetter } = useSuspenseQuery(
		orpc.coverLetter.getById.queryOptions({ input: { id: params.id } }),
	);
	const { mutateAsync: updateCoverLetter } = useMutation(orpc.coverLetter.update.mutationOptions());

	const { toggleSidebar } = useBuilderSidebar();

	const publicUrl = `${window.location.origin}/${session?.user.username}/${coverLetter.slug}`;

	const onCopyUrl = async () => {
		await copyToClipboard(publicUrl);
		toast.success(t`A link to your cover letter has been copied to clipboard.`);
	};

	useHotkeys(
		"mod+s",
		() => {
			toast.info(t`Your changes are saved automatically.`, {
				id: "auto-save",
				icon: <FloppyDiskIcon />,
			});
		},
		{ preventDefault: true, enableOnFormTags: true },
	);

	return (
		<header className="fixed inset-x-0 top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4">
			<div className="flex items-center gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" asChild>
							<Link to="/dashboard/cover-letters">
								<ArrowLeftIcon />
							</Link>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<Trans>Back to Dashboard</Trans>
					</TooltipContent>
				</Tooltip>

				<Separator orientation="vertical" className="h-6" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" onClick={() => toggleSidebar("left")}>
							<SidebarIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<Trans>Toggle Left Sidebar</Trans>
					</TooltipContent>
				</Tooltip>

				<div className="flex items-center gap-2">
					<FloppyDiskIcon className="size-4 text-muted-foreground" />
					<span className="text-muted-foreground text-sm">
						<Trans>Auto-saving...</Trans>
					</span>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" onClick={onCopyUrl}>
							<ShareIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<Trans>Copy Public URL</Trans>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" onClick={() => toggleSidebar("right")}>
							<GearIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<Trans>Toggle Right Sidebar</Trans>
					</TooltipContent>
				</Tooltip>
			</div>
		</header>
	);
}
