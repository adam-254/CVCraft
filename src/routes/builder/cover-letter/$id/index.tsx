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

export const Route = createFileRoute("/builder/cover-letter/$id/")({
	component: RouteComponent,
});

function RouteComponent() {
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