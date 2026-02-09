import { CalendarIcon, UserIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

export function ElegantTemplate({ title, recipient, content, tags, className }: CoverLetterTemplateProps) {
	const formatContent = (text: string) => {
		return text.split("\n").map((line, index) => (
			<p key={index} className={line.trim() === "" ? "h-4" : "mb-6 leading-loose"}>
				{line || "\u00A0"}
			</p>
		));
	};

	return (
		<div className={cn("border border-gray-200 bg-white shadow-lg", className)}>
			{/* Decorative top border */}
			<div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

			{/* Header */}
			<header className="p-10 pb-8">
				<h1 className="mb-4 text-center font-serif text-4xl text-gray-800">{title}</h1>
				<div className="flex items-center justify-center gap-8 text-gray-500 text-sm">
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

			{/* Decorative divider */}
			<div className="mb-8 flex justify-center">
				<div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
			</div>

			{/* Content */}
			<main className="px-10 pb-8">
				<div className="font-serif text-base text-gray-700 leading-loose">{formatContent(content)}</div>
			</main>

			{/* Footer */}
			{tags.length > 0 && (
				<footer className="border-gray-100 border-t p-8">
					<div className="flex flex-wrap justify-center gap-3">
						{tags.map((tag) => (
							<span
								key={tag}
								className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 font-medium text-amber-800 text-xs"
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
