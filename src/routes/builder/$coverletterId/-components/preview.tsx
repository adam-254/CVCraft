import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CalendarIcon, UserIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { useCoverLetterBuilderStore } from "../-store/cover-letter";

export function CoverLetterPreview() {
	const coverLetter = useCoverLetterBuilderStore((state) => state.coverLetter);

	const formatContent = (content: string) => {
		return content
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*(.*?)\*/g, "<em>$1</em>")
			.replace(/__(.*?)__/g, "<u>$1</u>")
			.split("\n")
			.map((line, index) => (
				<p key={index} className={line.trim() === "" ? "h-4" : ""}>
					<span dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />
				</p>
			));
	};

	return (
		<div className="flex h-full items-center justify-center p-8">
			<Card
				id="cover-letter-preview"
				className="w-full max-w-2xl bg-white p-12 shadow-2xl"
				style={{
					aspectRatio: "8.5 / 11",
					minHeight: "11in",
					fontFamily: "Inter, sans-serif",
					fontSize: "14px",
					lineHeight: "1.5",
				}}
			>
				<div className="space-y-6">
					{/* Header */}
					<div className="border-b pb-4">
						<h1 className="font-bold text-2xl text-gray-900">{coverLetter.title || t`Untitled Cover Letter`}</h1>
						<div className="mt-2 flex items-center gap-4 text-gray-600 text-sm">
							<div className="flex items-center gap-1">
								<CalendarIcon className="size-4" />
								{format(new Date(), "MMMM d, yyyy")}
							</div>
							{coverLetter.recipient && (
								<div className="flex items-center gap-1">
									<UserIcon className="size-4" />
									{coverLetter.recipient}
								</div>
							)}
						</div>
					</div>

					{/* Content */}
					<div className="prose prose-gray max-w-none">
						{coverLetter.content ? (
							<div className="space-y-4 text-gray-800">{formatContent(coverLetter.content)}</div>
						) : (
							<div className="flex h-64 items-center justify-center text-gray-400">
								<div className="text-center">
									<p className="font-medium text-lg">
										<Trans>Start writing your cover letter</Trans>
									</p>
									<p className="text-sm">
										<Trans>Use the editor on the left to add content</Trans>
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Footer */}
					{coverLetter.tags.length > 0 && (
						<div className="border-t pt-4">
							<div className="flex flex-wrap gap-2">
								{coverLetter.tags.map((tag) => (
									<span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 text-xs">
										{tag}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}
