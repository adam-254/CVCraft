import { t } from "@lingui/core/macro";
import { FloppyDiskIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import { BuilderDock } from "./-components/dock";
import { CoverLetterPreview } from "./-components/preview";
import { ShortcutsDialog } from "./-components/shortcuts-dialog";
import { WordCount } from "./-components/word-count";
import { useCoverLetterBuilderStore } from "./-store/cover-letter";

export const Route = createFileRoute("/builder/cover-letter/$id/")({
	component: RouteComponent,
});

function RouteComponent() {
	const currentPageIndex = useCoverLetterBuilderStore((state) => state.currentPageIndex);
	const setCurrentPageIndex = useCoverLetterBuilderStore((state) => state.setCurrentPageIndex);
	const addPage = useCoverLetterBuilderStore((state) => state.addPage);
	const coverLetter = useCoverLetterBuilderStore((state) => state.coverLetter);

	const totalPages = coverLetter?.pages?.length || 1;

	useHotkeys(
		["ctrl+s", "meta+s"],
		() => {
			toast.info(t`Your changes are saved automatically.`, {
				id: "auto-save",
				icon: <FloppyDiskIcon />,
			});
		},
		{ preventDefault: true, enableOnFormTags: true },
	);

	// Page navigation shortcuts
	useHotkeys(
		["ctrl+left", "meta+left"],
		() => {
			if (currentPageIndex > 0) {
				setCurrentPageIndex(currentPageIndex - 1);
				toast.success(t`Switched to page ${currentPageIndex}`, { id: "page-nav" });
			}
		},
		{ preventDefault: true },
		[currentPageIndex],
	);

	useHotkeys(
		["ctrl+right", "meta+right"],
		() => {
			if (currentPageIndex < totalPages - 1) {
				setCurrentPageIndex(currentPageIndex + 1);
				toast.success(t`Switched to page ${currentPageIndex + 2}`, { id: "page-nav" });
			}
		},
		{ preventDefault: true },
		[currentPageIndex, totalPages],
	);

	useHotkeys(
		["ctrl+shift+n", "meta+shift+n"],
		() => {
			addPage();
			toast.success(t`New page added`, { id: "add-page" });
		},
		{ preventDefault: true },
	);

	return (
		<div className="relative h-full bg-gray-50">
			<TransformWrapper centerOnInit limitToBounds={false} minScale={0.3} initialScale={0.8} maxScale={6}>
				<TransformComponent wrapperClass="h-full! w-full!">
					<CoverLetterPreview />
				</TransformComponent>

				<BuilderDock />
				<WordCount />
				<ShortcutsDialog />
			</TransformWrapper>
		</div>
	);
}