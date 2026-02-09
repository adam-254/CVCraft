import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useCoverLetterBuilderStore } from "../-store/cover-letter";

export function WordCount() {
	const coverLetter = useCoverLetterBuilderStore((state) => state.coverLetter);

	const stats = useMemo(() => {
		if (!coverLetter) return { characters: 0, words: 0, lines: 0, pages: 0 };

		// Count across all pages
		const pages = coverLetter.pages || [];
		let totalContent = "";
		
		for (const page of pages) {
			totalContent += page.content + "\n";
		}

		// Fallback to content field if pages are empty
		if (!totalContent.trim() && coverLetter.content) {
			totalContent = coverLetter.content;
		}

		const characters = totalContent.length;
		const words = totalContent.trim() ? totalContent.trim().split(/\s+/).length : 0;
		const lines = totalContent.split("\n").length;
		const pageCount = pages.length;

		return { characters, words, lines, pages: pageCount };
	}, [coverLetter]);

	const getReadabilityLevel = (wordCount: number) => {
		if (wordCount < 200) return { level: t`Too Short`, color: "text-orange-500" };
		if (wordCount < 300) return { level: t`Good`, color: "text-green-500" };
		if (wordCount < 400) return { level: t`Optimal`, color: "text-blue-500" };
		if (wordCount < 500) return { level: t`Long`, color: "text-yellow-500" };
		return { level: t`Too Long`, color: "text-red-500" };
	};

	const readability = getReadabilityLevel(stats.words);

	return (
		<motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} className="fixed right-4 bottom-4 z-10">
			<div className="rounded-lg border bg-background/80 p-3 shadow-lg backdrop-blur-sm">
				<div className="space-y-1 text-sm">
					<div className="flex items-center justify-between gap-4">
						<span className="text-muted-foreground">
							<Trans>Pages:</Trans>
						</span>
						<span className="font-mono">{stats.pages}</span>
					</div>
					<div className="flex items-center justify-between gap-4">
						<span className="text-muted-foreground">
							<Trans>Words:</Trans>
						</span>
						<span className="font-mono">{stats.words.toLocaleString()}</span>
					</div>
					<div className="flex items-center justify-between gap-4">
						<span className="text-muted-foreground">
							<Trans>Characters:</Trans>
						</span>
						<span className="font-mono">{stats.characters.toLocaleString()}</span>
					</div>
					<div className="flex items-center justify-between gap-4">
						<span className="text-muted-foreground">
							<Trans>Lines:</Trans>
						</span>
						<span className="font-mono">{stats.lines.toLocaleString()}</span>
					</div>
					<div className="border-t pt-1">
						<div className="flex items-center justify-between gap-4">
							<span className="text-muted-foreground">
								<Trans>Length:</Trans>
							</span>
							<span className={`font-medium ${readability.color}`}>{readability.level}</span>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
