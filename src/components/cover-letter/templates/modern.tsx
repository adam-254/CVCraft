import { CalendarIcon, UserIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

export function ModernTemplate({ title, recipient, content, tags, className }: CoverLetterTemplateProps) {
	const formatContent = (text: string) => {
		return text.split("\n").map((line, index) => (
			<p key={index} className={line.trim() === "" ? "h-4" : "mb-4 leading-relaxed"}>
				{line || "\u00A0"}
			</p>
		));
	};

	return (
		<div className={cn("bg-white shadow-xl", className)}>
			{/* Header with gradient */}
			<header className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
				<h1 className="mb-3 font-light text-3xl">{title}</h1>
				<div className="flex items-center gap-6 text-blue-100 text-sm">
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
			</header>

			{/* Content */}
			<main className="p-8">
				<div className="text-base text-gray-700 leading-relaxed">{formatContent(content)}</div>
			</main>

			{/* Footer */}
			{tags.length > 0 && (
				<footer className="bg-gray-50 p-6">
					<div className="flex flex-wrap gap-2">
						{tags.map((tag) => (
							<span key={tag} className="rounded-lg bg-blue-100 px-3 py-1 font-medium text-blue-800 text-xs">
								{tag}
							</span>
						))}
					</div>
				</footer>
			)}
		</div>
	);
}
