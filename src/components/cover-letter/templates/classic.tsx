import { CalendarIcon, UserIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

export function ClassicTemplate({ title, recipient, content, tags, className }: CoverLetterTemplateProps) {
	const formatContent = (text: string) => {
		return text.split("\n").map((line, index) => (
			<p key={index} className={line.trim() === "" ? "h-5" : "mb-5 leading-normal"}>
				{line || "\u00A0"}
			</p>
		));
	};

	return (
		<div className={cn("border border-gray-300 bg-white p-12 shadow-sm", className)}>
			{/* Classic header */}
			<header className="mb-10 border-gray-400 border-b pb-6 text-center">
				<h1 className="mb-4 font-bold font-serif text-2xl text-gray-900 uppercase tracking-wide">{title}</h1>
				<div className="flex items-center justify-center gap-6 text-gray-600 text-sm">
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
			<main className="mb-10">
				<div className="font-serif text-base text-gray-800 leading-normal">{formatContent(content)}</div>
			</main>

			{/* Classic footer */}
			{tags.length > 0 && (
				<footer className="border-gray-400 border-t pt-6">
					<div className="text-center">
						<div className="inline-flex flex-wrap gap-4">
							{tags.map((tag) => (
								<span key={tag} className="font-serif text-gray-600 text-sm italic">
									{tag}
								</span>
							))}
						</div>
					</div>
				</footer>
			)}
		</div>
	);
}
