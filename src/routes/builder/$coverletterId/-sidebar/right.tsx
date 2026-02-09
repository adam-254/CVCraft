import { Trans } from "@lingui/react/macro";
import { GearIcon, PaletteIcon } from "@phosphor-icons/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CoverLetterSettings } from "./right/settings";
import { CoverLetterStyles } from "./right/styles";

export function BuilderSidebarRight() {
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
