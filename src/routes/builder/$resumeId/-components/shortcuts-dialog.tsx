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

	useHotkeys("?", () => setOpen((prev) => !prev), { preventDefault: true });

	const shortcuts = [
		{
			category: t`General`,
			items: [
				{ keys: ["Ctrl", "S"], description: t`Save (Auto-save is enabled)` },
				{ keys: ["?"], description: t`Show keyboard shortcuts` },
				{ keys: ["Esc"], description: t`Close dialogs` },
			],
		},
		{
			category: t`Editing`,
			items: [
				{ keys: ["Ctrl", "Z"], description: t`Undo` },
				{ keys: ["Ctrl", "Y"], description: t`Redo` },
				{ keys: ["Ctrl", "Shift", "Z"], description: t`Redo (alternative)` },
			],
		},
		{
			category: t`View`,
			items: [
				{ keys: ["+"], description: t`Zoom in` },
				{ keys: ["-"], description: t`Zoom out` },
				{ keys: ["0"], description: t`Reset zoom` },
			],
		},
		{
			category: t`Navigation`,
			items: [
				{ keys: ["Tab"], description: t`Navigate between fields` },
				{ keys: ["Shift", "Tab"], description: t`Navigate backwards` },
			],
		},
	];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							className="fixed bottom-4 left-4 size-10 rounded-full bg-popover opacity-70 shadow-xl hover:opacity-100"
						>
							<QuestionIcon className="size-5" />
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent side="right" align="center">
					<Trans>Keyboard Shortcuts (?)</Trans>
				</TooltipContent>
			</Tooltip>

			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						<Trans>Keyboard Shortcuts</Trans>
					</DialogTitle>
					<DialogDescription>
						<Trans>Use these keyboard shortcuts to work faster and more efficiently.</Trans>
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					{shortcuts.map((section) => (
						<div key={section.category} className="space-y-3">
							<h3 className="font-semibold text-sm">{section.category}</h3>
							<div className="space-y-2">
								{section.items.map((shortcut, index) => (
									<div
										key={index}
										className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-2"
									>
										<span className="text-sm">{shortcut.description}</span>
										<div className="flex gap-1">
											{shortcut.keys.map((key, keyIndex) => (
												<kbd
													key={keyIndex}
													className="rounded border bg-background px-2 py-1 font-mono font-semibold text-xs shadow-sm"
												>
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

				<div className="flex items-center justify-between border-t pt-4 text-muted-foreground text-xs">
					<span>
						<Trans>Press ? to toggle this dialog</Trans>
					</span>
					<span>
						<Trans>Press Esc to close</Trans>
					</span>
				</div>
			</DialogContent>
		</Dialog>
	);
}
