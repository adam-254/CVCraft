import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { QuestionIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ShortcutsDialog() {
	const [open, setOpen] = useState(false);

	useHotkeys("mod+/", () => setOpen(true), { preventDefault: true });

	const shortcuts = [
		{
			category: t`General`,
			items: [
				{ keys: ["⌘", "S"], description: t`Save (auto-save notification)` },
				{ keys: ["⌘", "/"], description: t`Show keyboard shortcuts` },
				{ keys: ["Esc"], description: t`Close dialogs` },
			],
		},
		{
			category: t`Editing`,
			items: [
				{ keys: ["⌘", "Z"], description: t`Undo` },
				{ keys: ["⌘", "⇧", "Z"], description: t`Redo` },
				{ keys: ["⌘", "Y"], description: t`Redo (alternative)` },
				{ keys: ["⌘", "A"], description: t`Select all` },
			],
		},
		{
			category: t`Pages`,
			items: [
				{ keys: ["⌘", "←"], description: t`Previous page` },
				{ keys: ["⌘", "→"], description: t`Next page` },
				{ keys: ["⌘", "⇧", "N"], description: t`Add new page` },
			],
		},
		{
			category: t`View`,
			items: [
				{ keys: ["⌘", "+"], description: t`Zoom in` },
				{ keys: ["⌘", "-"], description: t`Zoom out` },
				{ keys: ["⌘", "0"], description: t`Reset zoom` },
			],
		},
		{
			category: t`Navigation`,
			items: [
				{ keys: ["Tab"], description: t`Next field` },
				{ keys: ["⇧", "Tab"], description: t`Previous field` },
			],
		},
	];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="fixed bottom-4 left-4 z-10 size-10 rounded-full border bg-background/80 shadow-lg backdrop-blur-sm"
						>
							<QuestionIcon className="size-4" />
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent side="right">
					<Trans>Keyboard Shortcuts</Trans>
				</TooltipContent>
			</Tooltip>

			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						<Trans>Keyboard Shortcuts</Trans>
					</DialogTitle>
					<DialogDescription>
						<Trans>Use these keyboard shortcuts to work more efficiently.</Trans>
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 md:grid-cols-2">
					{shortcuts.map((section) => (
						<div key={section.category} className="space-y-3">
							<h3 className="font-medium text-foreground">{section.category}</h3>
							<div className="space-y-2">
								{section.items.map((item, index) => (
									<div key={index} className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">{item.description}</span>
										<div className="flex items-center gap-1">
											{item.keys.map((key, keyIndex) => (
												<kbd key={keyIndex} className="rounded bg-muted px-2 py-1 font-mono text-xs">
													{key}
												</kbd>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
