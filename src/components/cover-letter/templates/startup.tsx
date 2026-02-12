import { LightningIcon, RocketLaunchIcon, TrendUpIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Startup Template - Dynamic and energetic design for startup culture
 */
export function StartupTemplate({
	content,
	className,
	senderName = "Your Name",
	senderEmail = "innovator@email.com",
	senderPhone = "(555) 123-4567",
	companyName = "Startup Inc",
	position = "Role Title",
	hiringManager = "Team",
}: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-12 shadow-lg", className)}>
			{/* Dynamic Header with Gradient */}
			<div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-xl">
				{/* Animated Background Elements */}
				<div className="absolute top-0 right-0 size-40 rounded-full bg-white opacity-10 blur-2xl" />
				<div className="absolute bottom-0 left-0 size-32 rounded-full bg-white opacity-10 blur-2xl" />

				<div className="relative">
					<div className="mb-4 flex items-center gap-3">
						<RocketLaunchIcon className="size-8 text-white" weight="duotone" />
						<div className="h-8 w-1 bg-white/30" />
						<LightningIcon className="size-6 text-yellow-300" weight="duotone" />
					</div>
					<h1 className="mb-3 font-bold text-4xl text-white">{senderName}</h1>
					<p className="mb-4 text-lg text-white/90">Passionate about {position}</p>
					<div className="flex flex-wrap gap-4 text-sm text-white/80">
						<span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">{senderEmail}</span>
						<span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">{senderPhone}</span>
					</div>
				</div>
			</div>

			{/* Content Card */}
			<div className="rounded-b-3xl bg-white p-10 shadow-xl">
				{/* Date and Company with Modern Layout */}
				<div className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
					<div>
						<p className="mb-1 font-semibold text-indigo-600 text-xs uppercase tracking-wider">Date</p>
						<p className="font-medium text-gray-900">{today}</p>
					</div>
					<div className="text-right">
						<div className="mb-2 flex items-center justify-end gap-2">
							<TrendUpIcon className="size-5 text-purple-600" weight="duotone" />
							<p className="font-bold text-gray-900 text-lg">{companyName}</p>
						</div>
						<p className="font-medium text-purple-600">{position}</p>
					</div>
				</div>

				{/* Casual but Professional Greeting */}
				<div className="mb-6">
					<p className="font-semibold text-gray-900 text-lg">Hey {hiringManager} 👋</p>
				</div>

				{/* Content with Modern Styling */}
				<div className="mb-8 space-y-4 text-gray-700 leading-relaxed">
					{content.split("\n\n").map((paragraph, index) => (
						<p
							key={index}
							className="relative border-transparent border-l-4 pl-4 transition-colors hover:border-indigo-300"
						>
							{paragraph}
						</p>
					))}
				</div>

				{/* Energetic Closing */}
				<div className="mt-12">
					<p className="font-semibold text-gray-900">Let's build something amazing together! 🚀</p>
					<div className="mt-6 flex items-center gap-4">
						<div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
						<div className="flex gap-1">
							<div className="size-2 rounded-full bg-indigo-600" />
							<div className="size-2 rounded-full bg-purple-600" />
							<div className="size-2 rounded-full bg-pink-600" />
						</div>
					</div>
					<p className="mt-4 font-bold text-gray-900 text-lg">{senderName}</p>
				</div>

				{/* Footer with Startup Vibe */}
				<div className="mt-10 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 text-center">
					<p className="font-medium text-gray-600 text-sm">Ready to disrupt, innovate, and make an impact</p>
				</div>
			</div>
		</div>
	);
}
