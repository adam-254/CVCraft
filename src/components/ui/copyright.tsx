import { Trans } from "@lingui/react/macro";
import { cn } from "@/utils/style";

type Props = React.ComponentProps<"div">;

export function Copyright({ className, ...props }: Props) {
	return (
		<div className={cn("text-muted-foreground/80 text-xs leading-relaxed", className)} {...props}>
			<p className="font-medium text-foreground">
				<Trans>Made by Vincent Adam</Trans>
			</p>

			<p className="mt-1 text-[0.65rem] opacity-60">CVCraft v{__APP_VERSION__}</p>
		</div>
	);
}
