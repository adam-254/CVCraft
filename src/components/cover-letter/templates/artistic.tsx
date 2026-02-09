import { PaintBrushIcon, PaletteIcon, SparkleIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Artistic Template - Creative and expressive design for artists and designers
 */
export function ArtisticTemplate({
	title,
	content,
	className,
	senderName = "Your Name",
	senderEmail = "artist@email.com",
	companyName = "Creative Studio",
}: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div
			className={cn(
				"relative overflow-hidden bg-gradient-to-br from-rose-50 via-violet-50 to-cyan-50 p-12 shadow-lg",
				className,
			)}
		>
			{/* Artistic Background Elements */}
			<div className="absolute top-0 left-0 size-96 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 opacity-10 blur-3xl" />
			<div className="absolute top-1/2 right-0 size-96 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 opacity-10 blur-3xl" />
			<div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 opacity-10 blur-3xl" />

			<div className="relative">
				{/* Watercolor-style Header */}
				<div className="mb-8">
					<div className="mb-6 flex items-center gap-4">
						<div className="flex gap-2">
							<div className="size-16 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 opacity-60 blur-sm" />
							<div className="mt-4 -ml-8 size-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 opacity-60 blur-sm" />
							<div className="mt-2 -ml-6 size-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 opacity-60 blur-sm" />
						</div>
					</div>
					<h1 className="mb-3 bg-gradient-to-r from-rose-600 via-violet-600 to-cyan-600 bg-clip-text font-bold text-5xl text-transparent">
						{senderName}
					</h1>
					<div className="flex items-center gap-3 text-gray-700">
						<PaletteIcon className="size-5 text-violet-500" weight="duotone" />
						<span className="font-medium">{senderEmail}</span>
						<span className="text-gray-400">•</span>
						<PaintBrushIcon className="size-5 text-rose-500" weight="duotone" />
						<span>Creative Professional</span>
					</div>
				</div>

				{/* Content Card with Artistic Border */}
				<div className="relative rounded-2xl bg-white/80 p-10 shadow-xl backdrop-blur-sm">
					{/* Decorative Corner Elements */}
					<div className="absolute top-0 left-0 size-20 rounded-tl-2xl border-rose-400 border-t-4 border-l-4" />
					<div className="absolute top-0 right-0 size-20 rounded-tr-2xl border-violet-400 border-t-4 border-r-4" />
					<div className="absolute bottom-0 left-0 size-20 rounded-bl-2xl border-cyan-400 border-b-4 border-l-4" />
					<div className="absolute right-0 bottom-0 size-20 rounded-br-2xl border-orange-400 border-r-4 border-b-4" />

					<div className="relative">
						{/* Date and Company */}
						<div className="mb-8 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<SparkleIcon className="size-5 text-violet-500" weight="duotone" />
								<span className="font-medium text-gray-700 text-sm">{today}</span>
							</div>
							<div className="text-right">
								<p className="font-bold text-gray-900">{companyName}</p>
							</div>
						</div>

						{/* Content with Artistic Styling */}
						<div className="mb-8 space-y-5 text-gray-700 leading-relaxed">
							{content.split("\n\n").map((paragraph, index) => (
								<p
									key={index}
									className="relative pl-6 before:absolute before:top-2 before:left-0 before:size-2 before:rounded-full before:bg-gradient-to-br before:from-rose-400 before:to-violet-400"
								>
									{paragraph}
								</p>
							))}
						</div>

						{/* Artistic Signature */}
						<div className="mt-12">
							<p className="mb-4 font-medium text-gray-900">With creative passion,</p>
							<div className="flex items-center gap-3">
								<div className="h-px w-32 bg-gradient-to-r from-rose-400 via-violet-400 to-cyan-400" />
								<div className="flex gap-1">
									<div className="size-2 rounded-full bg-rose-400" />
									<div className="size-2 rounded-full bg-violet-400" />
									<div className="size-2 rounded-full bg-cyan-400" />
								</div>
							</div>
							<p className="mt-3 font-bold text-gray-900">{senderName}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
