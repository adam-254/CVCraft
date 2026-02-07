import { CometCard } from "@/components/animation/comet-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/style";

type BaseCardProps = React.ComponentProps<"div"> & {
	title: string;
	description: string;
	tags?: string[];
	className?: string;
	children?: React.ReactNode;
};

export function BaseCard({ title, description, tags, className, children, ...props }: BaseCardProps) {
	return (
		<CometCard translateDepth={3} rotateDepth={6}>
			<div
				{...props}
				className={cn(
					"group relative flex aspect-page size-full cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-2xl",
					className,
				)}
			>
				{/* Gradient overlay on hover */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				{/* Shine effect */}
				<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

				{children}

				<div className="absolute inset-x-0 bottom-0 flex w-full flex-col justify-end space-y-1 bg-gradient-to-t from-background/95 via-background/80 to-transparent px-4 py-4 backdrop-blur-md">
					<h3 className="truncate font-semibold text-foreground tracking-tight">{title}</h3>
					<p className="truncate text-muted-foreground text-xs">{description}</p>

					<div className={cn("mt-2 hidden flex-wrap items-center gap-1.5", tags && tags.length > 0 && "flex")}>
						{tags?.map((tag) => (
							<Badge key={tag} variant="secondary" className="border border-primary/20 bg-primary/10 text-xs">
								{tag}
							</Badge>
						))}
					</div>
				</div>
			</div>
		</CometCard>
	);
}
