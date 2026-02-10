import { t } from "@lingui/core/macro";
import {
	ArrowUUpLeftIcon,
	ArrowUUpRightIcon,
	CubeFocusIcon,
	FileJsIcon,
	FilePdfIcon,
	type Icon,
	LinkSimpleIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
	PlusIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useControls } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { useResumeStore, useTemporalStore } from "@/components/resume/store/resume";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { authClient } from "@/integrations/auth/client";
import { orpc } from "@/integrations/orpc/client";
import { downloadWithAnchor, generateFilename } from "@/utils/file";
import { cn } from "@/utils/style";

export function BuilderDock() {
	const { data: session } = authClient.useSession();
	const params = useParams({ from: "/builder/$resumeId" });

	const [_, copyToClipboard] = useCopyToClipboard();
	const { zoomIn, zoomOut, centerView, zoomToElement } = useControls();

	const zoomPresets = [0.5, 0.75, 1, 1.5, 2];

	const handleZoomPreset = useCallback(
		(scale: number) => {
			zoomToElement("resume-preview", scale, 300);
		},
		[zoomToElement],
	);

	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const { data: resume } = useQuery(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } }));

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
		if (!session?.user.username || !resume?.slug) return "";
		return `${window.location.origin}/${session.user.username}/${resume.slug}`;
	}, [session?.user.username, resume?.slug]);

	const onCopyUrl = useCallback(async () => {
		await copyToClipboard(publicUrl);
		toast.success(t`A link to your resume has been copied to clipboard.`);
	}, [publicUrl, copyToClipboard]);

	const onDownloadJSON = useCallback(async () => {
		if (!resume?.data) return;
		const filename = generateFilename(resume.data.basics.name, "json");
		const jsonString = JSON.stringify(resume.data, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });

		downloadWithAnchor(blob, filename);
	}, [resume?.data]);

	const onDownloadPDF = useCallback(async () => {
		if (!resume?.id) return;

		const filename = generateFilename(resume.data.basics.name, "pdf");
		const toastId = toast.loading(t`Preparing your PDF...`);

		try {
			// Open the resume in a new window for printing
			const printUrl = `${window.location.origin}/printer/${resume.id}`;
			const printWindow = window.open(printUrl, "_blank");

			if (!printWindow) {
				toast.error(t`Please allow popups to download PDF`);
				return;
			}

			// Wait for the window to load, then trigger print
			printWindow.addEventListener("load", () => {
				setTimeout(() => {
					printWindow.print();
					toast.success(t`PDF download initiated. Use your browser's print dialog to save as PDF.`);
				}, 1000);
			});
		} catch (error) {
			toast.error(t`There was a problem preparing the PDF, please try again.`);
		} finally {
			toast.dismiss(toastId);
		}
	}, [resume?.id, resume?.data.basics.name]);

	const onAddPage = useCallback(() => {
		updateResumeData((draft) => {
			draft.metadata.layout.pages.push({
				fullWidth: true,
				main: [],
				sidebar: [],
			});
		});
		toast.success(t`A new page has been added to your resume.`);
	}, [updateResumeData]);

	return (
		<div className="fixed inset-x-0 bottom-4 flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 0.8, y: 0 }}
				whileHover={{ opacity: 1 }}
				transition={{ duration: 0.2 }}
				className="flex items-center rounded-r-full rounded-l-full bg-popover px-2 shadow-xl"
			>
				<DockIcon
					disabled={!canUndo}
					onClick={() => undo()}
					icon={ArrowUUpLeftIcon}
					title={t({
						context: "'Ctrl' may be replaced with the locale-specific equivalent (e.g. 'Strg' for QWERTZ layouts).",
						message: "Undo (Ctrl+Z)",
					})}
				/>
				<DockIcon
					disabled={!canRedo}
					onClick={() => redo()}
					icon={ArrowUUpRightIcon}
					title={t({
						context: "'Ctrl' may be replaced with the locale-specific equivalent (e.g. 'Strg' for QWERTZ layouts).",
						message: "Redo (Ctrl+Y)",
					})}
				/>
				<div className="mx-1 h-8 w-px bg-border" />
				<DockIcon icon={MagnifyingGlassPlusIcon} title={t`Zoom in`} onClick={() => zoomIn(0.1)} />
				<DockIcon icon={MagnifyingGlassMinusIcon} title={t`Zoom out`} onClick={() => zoomOut(0.1)} />
				<DockIcon icon={CubeFocusIcon} title={t`Center view`} onClick={() => centerView()} />
				<div className="mx-1 h-8 w-px bg-border" />
				{/* Zoom Presets */}
				{zoomPresets.map((scale) => (
					<Tooltip key={scale}>
						<TooltipTrigger asChild>
							<Button size="sm" variant="ghost" onClick={() => handleZoomPreset(scale)} className="h-8 px-2 text-xs">
								{Math.round(scale * 100)}%
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top" align="center" className="font-medium">
							{t`Zoom to ${Math.round(scale * 100)}%`}
						</TooltipContent>
					</Tooltip>
				))}
				<div className="mx-1 h-8 w-px bg-border" />
				<DockIcon icon={PlusIcon} title={t`Add Page`} onClick={() => onAddPage()} />
				<div className="mx-1 h-8 w-px bg-border" />
				<DockIcon icon={LinkSimpleIcon} title={t`Copy URL`} onClick={() => onCopyUrl()} />
				<DockIcon icon={FileJsIcon} title={t`Download JSON`} onClick={() => onDownloadJSON()} />
				<DockIcon title={t`Download PDF`} onClick={() => onDownloadPDF()} icon={FilePdfIcon} />
			</motion.div>
		</div>
	);
}

type DockIconProps = {
	title: string;
	icon: Icon;
	disabled?: boolean;
	onClick: () => void;
	iconClassName?: string;
};

function DockIcon({ icon: Icon, title, disabled, onClick, iconClassName }: DockIconProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button size="icon" variant="ghost" disabled={disabled} onClick={onClick}>
					<Icon className={cn("size-4", iconClassName)} />
				</Button>
			</TooltipTrigger>
			<TooltipContent side="top" align="center" className="font-medium">
				{title}
			</TooltipContent>
		</Tooltip>
	);
}
