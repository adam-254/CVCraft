import { cn } from "@/utils/style";

type Props = React.ComponentProps<"img"> & {
	variant?: "logo" | "icon";
};

export function BrandIcon({ variant = "logo", className, ...props }: Props) {
	// Use the same CVCraft logo for both light and dark modes, and for both logo and icon variants
	return (
		<img
			src="/logo/CVCraft_logo.png"
			alt="CVCraft"
			className={cn("size-12", className)}
			{...props}
		/>
	);
}
