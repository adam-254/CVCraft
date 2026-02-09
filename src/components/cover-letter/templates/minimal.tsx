import { CalendarIcon, UserIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

export function MinimalTemplate({ title, recipient, content, tags, className }: CoverLetterTemplateProps) {
	const formatContent = (text: string) => {
		return text.split("\n").map((line, index) => (
			<p key={index} className={line.trim() === "" ? "h-6" : "mb-6 leading-relaxed"}>
				{line || "\u00A0"}
			</p>
		));
	};

	return (
		<div className={cn("mx-auto max-w-2xl bg-white p-12", className)}>
			{/* Minimal header */}
			<header className="mb-12">
				<h1 className="mb-6 font-light text-2xl text-gray-900">{title}</h1>
				<div className="flex items-center gap-8 font-light text-gray-500 text-sm">
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
			<main className="mb-12">
				<div className="font-light text-base text-gray-700 leading-relaxed">{formatContent(content)}</div>
			</main>

			{/* Minimal footer */}
			{tags.length > 0 && (
				<footer>
					<div className="flex flex-wrap gap-3">
						{tags.map((tag) => (
							<span key={tag} className="border-gray-300 border-b pb-1 font-light text-gray-500 text-xs">
								{tag}
							</span>
						))}
					</div>
				</footer>
			)}
		</div>
	);
}
