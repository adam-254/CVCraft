import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Minimal Template - Simple and clean design focusing on content
 */
export function MinimalTemplate({ title, recipient, content, className }: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("bg-white p-16 shadow-sm", className)}>
			{/* Minimal Header */}
			<div className="mb-12">
				<h1 className="mb-1 font-light text-2xl text-gray-900 tracking-tight">{title}</h1>
				<p className="text-gray-500 text-xs uppercase tracking-widest">{today}</p>
			</div>

			{/* Recipient */}
			{recipient && (
				<div className="mb-8">
					<p className="text-gray-900">{recipient}</p>
				</div>
			)}

			{/* Content */}
			<div className="mb-12 space-y-6 text-gray-700 text-sm leading-loose">
				{content.split("\n\n").map((paragraph, index) => (
					<p key={index}>{paragraph}</p>
				))}
			</div>

			{/* Signature */}
			<div className="mt-16">
				<div className="h-px w-24 bg-gray-300" />
			</div>
		</div>
	);
}
