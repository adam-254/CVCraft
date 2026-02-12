import { t } from "@lingui/core/macro";
import {
	ArrowUUpLeftIcon,
	ArrowUUpRightIcon,
	CubeFocusIcon,
	FileJsIcon,
	FilePdfIcon,
	FloppyDisk as FloppyDiskIcon,
	type Icon,
	LinkSimpleIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
	PlusIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useControls } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { useResumeStore, useTemporalStore } from "@/components/resume/store/resume";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { authClient } from "@/integrations/auth/client";
import { orpc } from "@/integrations/orpc/client";
import { downloadFromUrl, downloadWithAnchor, generateFilename } from "@/utils/file";
import { cn } from "@/utils/style";

export function BuilderDock() {
	const { data: session } = authClient.useSession();
	const params = useParams({ from: "/builder/$resumeId" });

	const [_, copyToClipboard] = useCopyToClipboard();
	const [isSaving, setIsSaving] = useState(false);
	const { zoomIn, zoomOut, centerView, zoomToElement } = useControls();

	const zoomPresets = [0.5, 0.75, 1, 1.5];

	const handleZoomPreset = useCallback(
		(scale: number) => {
			zoomToElement("resume-preview", scale, 300);
		},
		[zoomToElement],
	);

	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const { data: resume } = useQuery(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } }));

	// Check if document is saved
	const { data: documentStatus, refetch: refetchDocumentStatus } = useQuery({
		...orpc.resume.getDocumentUrl.queryOptions({ input: { id: params.resumeId } }),
		enabled: !!params.resumeId,
	});

	const isDocumentSaved = !!documentStatus?.url;

	const { mutate: saveDocument } = useMutation(orpc.resume.saveDocument.mutationOptions());

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

	const onSaveDocument = useCallback(async () => {
		if (!resume?.id) return;

		setIsSaving(true);
		const toastId = toast.loading(t`Saving your resume document...`);

		try {
			// Capture the rendered HTML
			const resumeElement = document.querySelector(".resume-preview-container");
			if (!resumeElement) {
				throw new Error("Resume preview not found");
			}

			// Clone the element to modify it without affecting the display
			const clonedElement = resumeElement.cloneNode(true) as HTMLElement;

			// Remove the gap styling for saved version
			clonedElement.style.gap = "0";
			clonedElement.style.padding = "0";
			clonedElement.style.margin = "0";

			// Get all styles
			const styles = Array.from(document.styleSheets)
				.map((sheet) => {
					try {
						return Array.from(sheet.cssRules)
							.map((rule) => rule.cssText)
							.join("\n");
					} catch {
						return "";
					}
				})
				.join("\n");

			const htmlContent = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${resume.name} - Resume</title>
	<style>
		${styles}
		
		/* Override builder styles for print-ready document */
		body {
			margin: 0;
			padding: 0;
			background: white;
		}
		
		.resume-preview-container {
			display: flex !important;
			flex-direction: column !important;
			gap: 0 !important;
			padding: 0 !important;
			margin: 0 !important;
			align-items: center !important;
		}
		
		/* Each page should be separate */
		.resume-preview-container > div {
			page-break-after: always;
			break-after: page;
			margin: 0 !important;
		}
		
		.resume-preview-container > div:last-child {
			page-break-after: auto;
			break-after: auto;
		}
		
		@media print {
			/* Hide browser default headers and footers */
			@page {
				margin: 0;
				size: auto;
			}
			
			.resume-preview-container {
				gap: 0 !important;
			}
			
			* {
				box-shadow: none !important;
			}
		}
	</style>
</head>
<body>
	${clonedElement.outerHTML}
</body>
</html>`;

			// Save to storage
			saveDocument(
				{ id: resume.id, htmlContent },
				{
					onSuccess: () => {
						toast.success(t`Resume document saved successfully!`, { id: toastId });
						refetchDocumentStatus();
					},
					onError: () => {
						toast.error(t`Failed to save document. Please try again.`, { id: toastId });
					},
				},
			);
		} catch (error) {
			console.error("Save error:", error);
			toast.error(t`Failed to save document. Please try again.`, { id: toastId });
		} finally {
			setIsSaving(false);
		}
	}, [resume, saveDocument, refetchDocumentStatus]);

	const { mutateAsync: printResumeAsPDF } = useMutation(orpc.printer.printResumeAsPDF.mutationOptions());

	const onDownloadPDF = useCallback(async () => {
		if (!resume?.id || !resume?.name) return;

		const toastId = toast.loading(t`Generating your PDF...`);

		try {
			// Generate filename
			const filename = `${resume.name.replace(/[^a-z0-9]/gi, "_")}.pdf`;

			try {
				// Try server-side PDF generation first
				const { url } = await printResumeAsPDF({ id: resume.id });
				downloadFromUrl(url, filename);
			} catch (serverError) {
				// Fallback to client-side PDF generation if server fails
				console.warn("Server-side PDF generation failed, falling back to client-side:", serverError);
				
				const resumeElement = document.querySelector(".resume-preview-container") as HTMLElement;
				if (!resumeElement) {
					throw new Error("Resume preview not found");
				}

				// Use client-side PDF generation as fallback
				const { downloadPDF } = await import("@/utils/pdf-client");
				await downloadPDF(resumeElement, filename);
			}

			toast.success(t`PDF downloaded successfully!`, { id: toastId });
		} catch (error) {
			console.error("PDF generation error:", error);
			toast.error(t`Failed to generate PDF. Please try again.`, { id: toastId });
		}
	}, [resume?.id, resume?.name, printResumeAsPDF]);

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
				<DockIcon
					icon={FloppyDiskIcon}
					title={isDocumentSaved ? t`Document Saved` : t`Save Document`}
					onClick={() => onSaveDocument()}
					disabled={isSaving}
					iconClassName={isDocumentSaved ? "text-green-500" : ""}
				/>
				<div className="mx-1 h-8 w-px bg-border" />
				<DockIcon icon={PlusIcon} title={t`Add Page`} onClick={() => onAddPage()} />
				<div className="mx-1 h-8 w-px bg-border" />
				<DockIcon icon={LinkSimpleIcon} title={t`Copy URL`} onClick={() => onCopyUrl()} />
				<DockIcon icon={FileJsIcon} title={t`Download JSON`} onClick={() => onDownloadJSON()} />
				<DockIcon
					title={t`Download PDF`}
					onClick={() => onDownloadPDF()}
					icon={FilePdfIcon}
				/>
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
