import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Modern Template - Contemporary design with gradient header and clean typography
 */
export function ModernTemplate({ title, recipient, content, className }: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("bg-white shadow-sm", className)}>
			{/* Gradient Header */}
			<div className="bg-gradient-to-r from-purple-600 to-blue-500 p-12 text-white">
				<h1 className="mb-2 font-bold text-4xl">{title}</h1>
				<p className="text-purple-100 text-sm">{today}</p>
			</div>

			<div className="p-12">
				{/* Recipient */}
				{recipient && (
					<div className="mb-6">
						<p className="font-semibold text-gray-900 text-lg">Dear {recipient},</p>
					</div>
				)}

				{/* Content */}
				<div className="mb-8 space-y-4 text-gray-700 leading-relaxed">
					{content.split("\n\n").map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				{/* Signature */}
				<div className="mt-12">
					<p className="font-semibold text-gray-900">Best regards,</p>
					<div className="mt-8 h-1 w-48 rounded bg-gradient-to-r from-purple-600 to-blue-500" />
				</div>
			</div>
		</div>
	);
}
