import { TagIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/style";

type BaseCardProps = {
	title: string;
	description: string;
	tags?: string[];
	children: ReactNode;
	className?: string;
};

export function BaseCard({ title, description, tags, children, className }: BaseCardProps) {
	return (
		<div
			className={cn(
				"group relative flex h-[320px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background via-muted/5 to-background shadow-lg transition-all duration-300",
				"hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/10 hover:shadow-xl",
				className,
			)}
		>
			{/* Preview Area */}
			<div className="relative h-[200px] overflow-hidden border-border/30 border-b">{children}</div>

			{/* Info Section */}
			<div className="flex flex-1 flex-col justify-between p-4">
				<div className="space-y-1">
					<h3 className="truncate font-semibold text-base leading-tight">{title}</h3>
					<p className="truncate text-muted-foreground text-xs">{description}</p>
				</div>

				{/* Tags */}
				{tags && tags.length > 0 && (
					<div className="flex flex-wrap items-center gap-1.5 pt-2">
						<div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-primary/10">
							<TagIcon className="size-3 text-primary" />
						</div>
						{tags.slice(0, 2).map((tag) => (
							<Badge key={tag} variant="outline" className="border-primary/20 bg-primary/10 text-xs">
								{tag}
							</Badge>
						))}
						{tags.length > 2 && (
							<Badge variant="outline" className="border-muted-foreground/20 bg-muted/50 text-xs">
								+{tags.length - 2}
							</Badge>
						)}
					</div>
				)}
			</div>

			{/* Hover Glow Effect */}
			<div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-2 ring-primary/20 transition-opacity duration-300 group-hover:opacity-100" />
		</div>
	);
}
