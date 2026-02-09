import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Elegant Template - Sophisticated design with serif fonts and decorative elements
 */
export function ElegantTemplate({ title, recipient, content, className }: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("bg-amber-50 p-12 shadow-sm", className)}>
			{/* Decorative Header */}
			<div className="mb-8 text-center">
				<div className="mb-4 flex items-center justify-center gap-4">
					<div className="h-px w-16 bg-amber-600" />
					<div className="size-2 rotate-45 bg-amber-600" />
					<div className="h-px w-16 bg-amber-600" />
				</div>
				<h1 className="mb-2 font-bold font-serif text-4xl text-amber-900">{title}</h1>
				<p className="font-serif text-amber-700 text-sm italic">{today}</p>
				<div className="mt-4 flex items-center justify-center gap-4">
					<div className="h-px w-16 bg-amber-600" />
					<div className="size-2 rotate-45 bg-amber-600" />
					<div className="h-px w-16 bg-amber-600" />
				</div>
			</div>

			<div className="bg-white p-10 shadow-md">
				{/* Recipient */}
				{recipient && (
					<div className="mb-6">
						<p className="font-medium font-serif text-amber-900">Dear {recipient},</p>
					</div>
				)}

				{/* Content */}
				<div className="mb-8 space-y-4 font-serif text-gray-700 leading-relaxed">
					{content.split("\n\n").map((paragraph, index) => (
						<p
							key={index}
							className="first-letter:float-left first-letter:mr-2 first-letter:font-bold first-letter:text-5xl first-letter:text-amber-900 first-letter:leading-none"
						>
							{paragraph}
						</p>
					))}
				</div>

				{/* Signature */}
				<div className="mt-12">
					<p className="font-medium font-serif text-amber-900">With warm regards,</p>
					<div className="mt-8 flex items-center gap-2">
						<div className="h-px w-32 bg-amber-600" />
						<div className="size-1.5 rotate-45 bg-amber-600" />
					</div>
				</div>
			</div>
		</div>
	);
}
