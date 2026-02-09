import { Trans } from "@lingui/react/macro";
import { GearIcon, PaletteIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCoverLetterBuilderStore } from "../-store/cover-letter";
import { CoverLetterStyles } from "./right/styles";
import { CoverLetterTemplates } from "./right/templates";

// Inline settings component to avoid import issues
function CoverLetterSettings() {
	return (
		<div className="space-y-4">
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

export function BuilderSidebarRight() {
	const selectedTemplate = useCoverLetterBuilderStore((state) => state.selectedTemplate);
	const setSelectedTemplate = useCoverLetterBuilderStore((state) => state.setSelectedTemplate);

	return (
		<div className="flex h-full flex-col">
			<div className="border-b p-4">
				<h2 className="font-semibold">
					<Trans>Customization</Trans>
				</h2>
				<p className="text-muted-foreground text-sm">
					<Trans>Customize the appearance and settings</Trans>
				</p>
			</div>

			<ScrollArea className="flex-1">
				<div className="space-y-6 p-4">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<SquaresFourIcon className="size-4" />
							<h3 className="font-medium">
								<Trans>Templates</Trans>
							</h3>
						</div>
						<CoverLetterTemplates selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} />
					</div>

					<Separator />

					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<PaletteIcon className="size-4" />
							<h3 className="font-medium">
								<Trans>Styles</Trans>
							</h3>
						</div>
						<CoverLetterStyles />
					</div>

					<Separator />

					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<GearIcon className="size-4" />
							<h3 className="font-medium">
								<Trans>Settings</Trans>
							</h3>
						</div>
						<CoverLetterSettings />
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}