import { t } from "@lingui/core/macro";
import {
	ArrowUUpLeftIcon,
	ArrowUUpRightIcon,
	FilePdfIcon,
	FileTextIcon,
	LinkSimpleIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useControls } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { authClient } from "@/integrations/auth/client";
import { orpc } from "@/integrations/orpc/client";
import { downloadWithAnchor, generateFilename } from "@/utils/file";
import { cn } from "@/utils/style";
import { useCoverLetterBuilderStore, useTemporalStore } from "../-store/cover-letter";

export function BuilderDock() {
	const { data: session } = authClient.useSession();
	const params = useParams({ from: "/builder/cover-letter/$id" });

	const [_, copyToClipboard] = useCopyToClipboard();
	const { zoomIn, zoomOut, centerView, zoomToElement } = useControls();

	const zoomPresets = [0.5, 0.75, 1, 1.5, 2];

	const handleZoomPreset = useCallback(
		(scale: number) => {
			zoomToElement("cover-letter-preview", scale, 300);
		},
		[zoomToElement],
	);

	const updateCoverLetter = useCoverLetterBuilderStore((state) => state.updateCoverLetter);

	const { data: coverLetter } = useQuery(
		orpc.coverLetter.getById.queryOptions({ input: { id: params.id } }),
	);

	const { undo, redo, pastStates, futureStates } = useTemporalStore((state) => ({
		undo: state.undo,
		redo: state.redo,
		pastStates: state.pastStates,
		futureStates: state.futureStates,
	}));

	const canUndo = pastStates.length > 1;
	const canRedo = futureStates.length > 0;

	useHotkeys("mod+z", () => undo(), { enabled: canUndo, preventDefault: true });
	useHotkeys(["mod+y", "mod+shift+z"], () => redo(), { enabled: canRedo, preventDefault: true });

	const publicUrl = useMemo(() => {
		if (!session?.user.username || !coverLetter?.slug) return "";
		return `${window.location.origin}/${session.user.username}/${coverLetter.slug}`;
	}, [session?.user.username, coverLetter?.slug]);

	const onCopyUrl = useCallback(async () => {
		await copyToClipboard(publicUrl);
		toast.success(t`A link to your cover letter has been copied to clipboard.`);
	}, [publicUrl, copyToClipboard]);

	const onDownloadTXT = useCallback(async () => {
		if (!coverLetter) return;
		const filename = generateFilename(coverLetter.title, "txt");
		const content = `${coverLetter.title}\n\n${coverLetter.recipient ? `Dear ${coverLetter.recipient},\n\n` : ""}${coverLetter.content}`;
		const blob = new Blob([content], { type: "text/plain" });
		downloadWithAnchor(blob, filename);
		toast.success(t`Cover letter downloaded as TXT.`);
	}, [coverLetter]);

	const onDownloadPDF = useCallback(async () => {
		if (!coverLetter) return;
		// TODO: Implement PDF export
		toast.info(t`PDF export coming soon.`);
	}, [coverLetter]);

	const dockItems = [
		{
			icon: ArrowUUpLeftIcon,
			label: t`Undo`,
			onClick: undo,
			disabled: !canUndo,
			shortcut: "⌘Z",
		},
		{
			icon: ArrowUUpRightIcon,
			label: t`Redo`,
			onClick: redo,
			disabled: !canRedo,
			shortcut: "⌘⇧Z",
		},
		{ type: "separator" as const },
		{
			icon: MagnifyingGlassMinusIcon,
			label: t`Zoom Out`,
			onClick: zoomOut,
			shortcut: "⌘-",
		},
		{
			icon: MagnifyingGlassPlusIcon,
			label: t`Zoom In`,
			onClick: zoomIn,
			shortcut: "⌘+",
		},
		{ type: "separator" as const },
		{
			icon: LinkSimpleIcon,
			label: t`Copy Public URL`,
			onClick: onCopyUrl,
		},
		{
			icon: FileTextIcon,
			label: t`Download TXT`,
			onClick: onDownloadTXT,
		},
		{
			icon: FilePdfIcon,
			label: t`Download PDF`,
			onClick: onDownloadPDF,
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 100 }}
			animate={{ opacity: 1, y: 0 }}
			className="fixed bottom-4 left-1/2 z-10 -translate-x-1/2"
		>
			<div className="flex items-center gap-1 rounded-full border bg-background/80 p-2 shadow-lg backdrop-blur-sm">
				{dockItems.map((item, index) => {
					if (item.type === "separator") {
						return <div key={index} className="mx-1 h-6 w-px bg-border" />;
					}

					const Icon = item.icon;
					return (
						<Tooltip key={index}>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className={cn("size-8", item.disabled && "opacity-50")}
									onClick={item.onClick}
									disabled={item.disabled}
								>
									<Icon className="size-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">
								<div className="flex items-center gap-2">
									<span>{item.label}</span>
									{item.shortcut && <kbd className="rounded bg-muted px-1 py-0.5 text-xs">{item.shortcut}</kbd>}
								</div>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</div>

			<div className="mt-2 flex justify-center gap-1">
				{zoomPresets.map((scale) => (
					<Button
						key={scale}
						variant="ghost"
						size="sm"
						className="h-6 px-2 text-xs"
						onClick={() => handleZoomPreset(scale)}
					>
						{Math.round(scale * 100)}%
					</Button>
				))}
			</div>
		</motion.div>
	);
}
