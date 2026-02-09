import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Professional Template - Clean and formal design with subtle header accent
 */
export function ProfessionalTemplate({ title, recipient, content, className }: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("bg-white p-12 shadow-sm", className)}>
			{/* Header with subtle accent */}
			<div className="mb-8 border-blue-600 border-l-4 pl-6">
				<h1 className="mb-2 font-bold text-3xl text-gray-900">{title}</h1>
				<p className="text-gray-600 text-sm">{today}</p>
			</div>

			{/* Recipient */}
			{recipient && (
				<div className="mb-6">
					<p className="font-medium text-gray-900">Dear {recipient},</p>
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
				<p className="font-medium text-gray-900">Sincerely,</p>
				<div className="mt-8 h-px w-48 bg-gray-300" />
			</div>
		</div>
	);
}
