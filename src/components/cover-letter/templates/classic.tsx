import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Classic Template - Traditional formal letter design with serif typography
 */
export function ClassicTemplate({ title, recipient, content, className }: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("bg-white p-12 shadow-sm", className)}>
			{/* Classic Header */}
			<div className="mb-12 border-gray-800 border-b-2 pb-4 text-center">
				<h1 className="mb-2 font-bold font-serif text-3xl text-gray-900 uppercase tracking-wide">{title}</h1>
				<p className="font-serif text-gray-600 text-sm">{today}</p>
			</div>

			{/* Recipient */}
			{recipient && (
				<div className="mb-8">
					<p className="font-serif text-gray-900">Dear {recipient}:</p>
				</div>
			)}

			{/* Content */}
			<div className="mb-10 space-y-5 text-justify font-serif text-gray-800 leading-relaxed">
				{content.split("\n\n").map((paragraph, index) => (
					<p key={index} className="indent-8">
						{paragraph}
					</p>
				))}
			</div>

			{/* Signature */}
			<div className="mt-16">
				<p className="font-serif text-gray-900">Respectfully yours,</p>
				<div className="mt-12 space-y-1">
					<div className="h-px w-48 bg-gray-800" />
					<p className="font-serif text-gray-600 text-sm">Signature</p>
				</div>
			</div>
		</div>
	);
}
