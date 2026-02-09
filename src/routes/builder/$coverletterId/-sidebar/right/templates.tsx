import { Trans } from "@lingui/react/macro";
import { CheckIcon } from "@phosphor-icons/react";
import { coverLetterTemplates } from "@/components/cover-letter/templates";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/style";

interface CoverLetterTemplatesProps {
	selectedTemplate: string;
	onTemplateChange: (template: string) => void;
}

export function CoverLetterTemplates({ selectedTemplate, onTemplateChange }: CoverLetterTemplatesProps) {
	return (
		<div className="space-y-4">
			<Label>
				<Trans>Templates</Trans>
			</Label>

			<ScrollArea className="h-96">
				<div className="grid gap-3">
					{coverLetterTemplates.map((template) => (
						<div
							key={template.id}
							className={cn(
								"relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md",
								selectedTemplate === template.id
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50",
							)}
							onClick={() => onTemplateChange(template.id)}
						>
							{/* Selection indicator */}
							{selectedTemplate === template.id && (
								<div className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
									<CheckIcon className="size-3" />
								</div>
							)}

							{/* Template preview */}
							<div className="mb-3">
								<div
									className={cn(
										"h-24 w-full rounded border bg-linear-to-br",
										template.id === "professional" && "from-gray-100 to-gray-200",
										template.id === "modern" && "from-blue-100 to-purple-200",
										template.id === "elegant" && "from-amber-50 to-amber-100",
										template.id === "creative" && "from-purple-100 to-orange-100",
										template.id === "minimal" && "from-gray-50 to-white",
										template.id === "classic" && "from-gray-100 to-gray-50",
									)}
								>
									{/* Mini preview content */}
									<div className="flex h-full flex-col justify-between p-2 text-xs">
										<div
											className={cn(
												"font-bold",
												template.id === "elegant" && "font-serif",
												template.id === "classic" && "text-center font-serif",
											)}
										>
											{template.name}
										</div>
										<div className="space-y-1">
											<div className="h-1 rounded bg-current opacity-30"></div>
											<div className="h-1 w-3/4 rounded bg-current opacity-20"></div>
											<div className="h-1 w-1/2 rounded bg-current opacity-20"></div>
										</div>
									</div>
								</div>
							</div>

							{/* Template info */}
							<div>
								<h3 className="mb-1 font-medium text-sm">{template.name}</h3>
								<p className="text-muted-foreground text-xs leading-relaxed">{template.description}</p>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>

			<div className="border-t pt-2">
				<Button
					variant="outline"
					size="sm"
					className="w-full"
					onClick={() => {
						// TODO: Implement template customization
					}}
				>
					<Trans>Customize Template</Trans>
				</Button>
			</div>
		</div>
	);
}
