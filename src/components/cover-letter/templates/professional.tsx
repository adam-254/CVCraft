import { CalendarIcon, UserIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

export function ProfessionalTemplate({ title, recipient, content, tags, className }: CoverLetterTemplateProps) {
	const formatContent = (text: string) => {
		return text.split("\n").map((line, index) => (
			<p key={index} className={line.trim() === "" ? "h-4" : "mb-4 leading-relaxed"}>
				{line || "\u00A0"}
			</p>
		));
	};

	return (
		<div className={cn("bg-white p-12 shadow-lg", className)}>
			{/* Header */}
			<header className="mb-8 border-gray-900 border-b-2 pb-6">
				<h1 className="mb-4 font-bold text-3xl text-gray-900">{title}</h1>
				<div className="flex items-center gap-6 text-gray-600 text-sm">
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
			<main className="prose prose-gray max-w-none">
				<div className="text-base text-gray-800 leading-relaxed">{formatContent(content)}</div>
			</main>

			{/* Footer */}
			{tags.length > 0 && (
				<footer className="mt-8 border-gray-200 border-t pt-6">
					<div className="flex flex-wrap gap-2">
						{tags.map((tag) => (
							<span key={tag} className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700 text-xs">
								{tag}
							</span>
						))}
					</div>
				</footer>
			)}
		</div>
	);
}
