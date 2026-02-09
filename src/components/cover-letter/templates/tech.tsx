import { CodeIcon, EnvelopeIcon, GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Tech Template - Modern design for tech industry with code-inspired elements
 */
export function TechTemplate({
	title,
	content,
	className,
	senderName = "Your Name",
	senderEmail = "dev@email.com",
	companyName = "Tech Company",
	position = "Software Engineer",
}: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("bg-slate-950 p-12 font-mono shadow-lg", className)}>
				{/* Terminal-style Header */}
				<div className="mb-6 rounded-t-lg bg-slate-900 p-4">
					<div className="mb-3 flex items-center gap-2">
						<div className="size-3 rounded-full bg-red-500" />
						<div className="size-3 rounded-full bg-yellow-500" />
						<div className="size-3 rounded-full bg-green-500" />
						<span className="ml-4 text-slate-400 text-sm">cover-letter.md</span>
					</div>
					<div className="border-slate-800 border-t pt-3">
						<p className="text-emerald-400 text-sm">
							<span className="text-slate-500">$</span> cat cover-letter.md
						</p>
					</div>
				</div>

				{/* Content Area */}
				<div className="rounded-b-lg bg-slate-900 p-8 text-slate-300">
					{/* Header Info */}
					<div className="mb-8 border-emerald-500 border-l-4 pl-4">
						<h1 className="mb-2 font-bold text-2xl text-emerald-400"># {senderName}</h1>
						<p className="mb-1 text-slate-400 text-sm">## {position}</p>
						<div className="flex gap-4 text-xs">
							<span className="flex items-center gap-1">
								<EnvelopeIcon className="size-3" />
								{senderEmail}
							</span>
							<span className="flex items-center gap-1">
								<GithubLogoIcon className="size-3" />
								github.com/username
							</span>
							<span className="flex items-center gap-1">
								<LinkedinLogoIcon className="size-3" />
								linkedin.com/in/username
							</span>
						</div>
					</div>

					{/* Date and Company */}
					<div className="mb-6 rounded bg-slate-800/50 p-4">
						<p className="mb-2 text-emerald-400 text-sm">
							<span className="text-slate-500">const</span> date = <span className="text-amber-400">"{today}"</span>;
						</p>
						<p className="text-emerald-400 text-sm">
							<span className="text-slate-500">const</span> company ={" "}
							<span className="text-amber-400">"{companyName}"</span>;
						</p>
					</div>

					{/* Content */}
					<div className="mb-8 space-y-4 leading-relaxed">
						<p className="text-slate-500 text-sm">{"// Cover Letter Content"}</p>
						{content.split("\n\n").map((paragraph, index) => (
							<p key={index} className="text-slate-300">
								{paragraph}
							</p>
						))}
					</div>

					{/* Signature */}
					<div className="mt-8 rounded bg-slate-800/50 p-4">
						<p className="text-emerald-400 text-sm">
							<span className="text-slate-500">return</span>{" "}
							<span className="text-amber-400">"Best regards, {senderName}"</span>;
						</p>
					</div>

					{/* Footer */}
					<div className="mt-6 flex items-center gap-2 text-slate-600 text-xs">
						<CodeIcon className="size-4" />
						<span>Crafted with passion for technology</span>
					</div>
				</div>
		</div>
	);
}
