import { Trans } from "@lingui/react/macro";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function CoverLetterStyles() {
	const fontFamilies = [
		{ value: "inter", label: "Inter" },
		{ value: "roboto", label: "Roboto" },
		{ value: "open-sans", label: "Open Sans" },
		{ value: "lato", label: "Lato" },
		{ value: "source-sans", label: "Source Sans Pro" },
		{ value: "times", label: "Times New Roman" },
		{ value: "georgia", label: "Georgia" },
		{ value: "arial", label: "Arial" },
	];

	const colorSchemes = [
		{ name: "Professional", primary: "#1f2937", secondary: "#6b7280" },
		{ name: "Modern", primary: "#0f172a", secondary: "#475569" },
		{ name: "Elegant", primary: "#374151", secondary: "#9ca3af" },
		{ name: "Creative", primary: "#7c3aed", secondary: "#a78bfa" },
		{ name: "Warm", primary: "#dc2626", secondary: "#f87171" },
		{ name: "Cool", primary: "#0891b2", secondary: "#67e8f9" },
	];

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label>
					<Trans>Font Family</Trans>
				</Label>
				<select
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					defaultValue="inter"
				>
					{fontFamilies.map((font) => (
						<option key={font.value} value={font.value}>
							{font.label}
						</option>
					))}
				</select>
			</div>

			<div className="space-y-2">
				<Label>
					<Trans>Font Size</Trans>
				</Label>
				<div className="px-2">
					<Slider defaultValue={[14]} min={10} max={20} step={1} />
				</div>
				<div className="flex justify-between text-muted-foreground text-xs">
					<span>10px</span>
					<span>20px</span>
				</div>
			</div>

			<div className="space-y-2">
				<Label>
					<Trans>Line Height</Trans>
				</Label>
				<div className="px-2">
					<Slider defaultValue={[1.5]} min={1} max={2.5} step={0.1} />
				</div>
				<div className="flex justify-between text-muted-foreground text-xs">
					<span>1.0</span>
					<span>2.5</span>
				</div>
			</div>

			<div className="space-y-2">
				<Label>
					<Trans>Color Scheme</Trans>
				</Label>
				<div className="grid grid-cols-2 gap-2">
					{colorSchemes.map((scheme) => (
						<Button key={scheme.name} variant="outline" className="h-auto flex-col gap-2 p-3">
							<div className="flex gap-1">
								<div className="h-3 w-3 rounded-full" style={{ backgroundColor: scheme.primary }} />
								<div className="h-3 w-3 rounded-full" style={{ backgroundColor: scheme.secondary }} />
							</div>
							<span className="text-xs">{scheme.name}</span>
						</Button>
					))}
				</div>
			</div>

			<div className="space-y-2">
				<Label>
					<Trans>Page Margins</Trans>
				</Label>
				<div className="px-2">
					<Slider defaultValue={[1]} min={0.5} max={2} step={0.1} />
				</div>
				<div className="flex justify-between text-muted-foreground text-xs">
					<span>0.5in</span>
					<span>2.0in</span>
				</div>
			</div>
		</div>
	);
}
