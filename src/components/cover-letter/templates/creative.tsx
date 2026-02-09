import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Creative Template - Bold and colorful design for creative industries
 */
export function CreativeTemplate({ title, recipient, content, className }: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("relative bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 p-12 shadow-sm", className)}>
			{/* Decorative circles */}
			<div className="absolute top-0 right-0 size-32 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 opacity-20 blur-3xl" />
			<div className="absolute bottom-0 left-0 size-40 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-20 blur-3xl" />

			<div className="relative">
				{/* Creative Header */}
				<div className="mb-8">
					<div className="mb-4 inline-block rounded-full bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 px-6 py-2">
						<p className="font-bold text-sm text-white uppercase tracking-wider">{today}</p>
					</div>
					<h1 className="mb-2 bg-gradient-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text font-bold text-5xl text-transparent">{title}</h1>
					<div className="flex gap-2">
						<div className="h-1 w-16 rounded bg-orange-500" />
						<div className="h-1 w-12 rounded bg-purple-500" />
						<div className="h-1 w-8 rounded bg-pink-500" />
					</div>
				</div>

				{/* Recipient */}
				{recipient && (
					<div className="mb-6">
						<p className="font-bold text-gray-900 text-lg">Hey {recipient}!</p>
					</div>
				)}

				{/* Content */}
				<div className="mb-8 space-y-4 text-gray-700 leading-relaxed">
					{content.split("\n\n").map((paragraph, index) => (
						<p key={index} className="rounded-lg bg-white/60 p-4 backdrop-blur-sm">
							{paragraph}
						</p>
					))}
				</div>

				{/* Signature */}
				<div className="mt-12">
					<p className="font-bold text-gray-900">Cheers,</p>
					<div className="mt-6 flex items-center gap-2">
						<div className="size-3 rounded-full bg-orange-500" />
						<div className="size-3 rounded-full bg-purple-500" />
						<div className="size-3 rounded-full bg-pink-500" />
					</div>
				</div>
			</div>
		</div>
	);
}
