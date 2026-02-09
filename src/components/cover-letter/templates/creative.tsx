import { CalendarIcon, UserIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

export function CreativeTemplate({ title, recipient, content, tags, className }: CoverLetterTemplateProps) {
	const formatContent = (text: string) => {
		return text.split("\n").map((line, index) => (
			<p key={index} className={line.trim() === "" ? "h-4" : "mb-4 leading-relaxed"}>
				{line || "\u00A0"}
			</p>
		));
	};

	return (
		<div className={cn("overflow-hidden bg-white shadow-2xl", className)}>
			{/* Creative header with geometric shapes */}
			<header className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 text-white">
				{/* Decorative shapes */}
				<div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white/10"></div>
				<div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-white/10"></div>

				<div className="relative z-10">
					<h1 className="mb-4 font-bold text-3xl">{title}</h1>
					<div className="flex items-center gap-6 text-sm text-white/90">
						<div className="flex items-center gap-2">
							<CalendarIcon className="size-4" />
							{new Date().toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</div>
						{recipient && (
							<div className="flex items-center gap-2">
								<UserIcon className="size-4" />
								{recipient}
							</div>
						)}
					</div>
				</div>
			</header>

			{/* Content with creative styling */}
			<main className="relative p-8">
				{/* Side accent */}
				<div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-purple-500 to-orange-400"></div>

				<div className="pl-6 text-base text-gray-700 leading-relaxed">{formatContent(content)}</div>
			</main>

			{/* Footer */}
			{tags.length > 0 && (
				<footer className="bg-gray-50 p-6">
					<div className="flex flex-wrap gap-2">
						{tags.map((tag) => (
							<span
								key={tag}
								className="rounded-full border border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 font-medium text-purple-800 text-xs"
							>
								{tag}
							</span>
						))}
					</div>
				</footer>
			)}
		</div>
	);
}
