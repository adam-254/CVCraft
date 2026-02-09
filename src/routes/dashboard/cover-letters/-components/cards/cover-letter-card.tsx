import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { EnvelopeIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import type { RouterOutput } from "@/integrations/orpc/client";
import { BaseCard } from "./base-card";

type CoverLetterCardProps = {
	coverLetter: RouterOutput["coverLetter"]["list"][number];
};

export function CoverLetterCard({ coverLetter }: CoverLetterCardProps) {
	const { i18n } = useLingui();

	const updatedAt = useMemo(() => {
		return Intl.DateTimeFormat(i18n.locale, { dateStyle: "long", timeStyle: "short" }).format(coverLetter.updatedAt);
	}, [i18n.locale, coverLetter.updatedAt]);

	return (
		<Link to="/builder/$coverletterId" params={{ coverletterId: coverLetter.id }} className="cursor-default">
			<BaseCard title={coverLetter.title} description={t`Last updated on ${updatedAt}`} tags={coverLetter.tags}>
				<CoverLetterPreview coverLetter={coverLetter} />
			</BaseCard>
		</Link>
	);
}

function CoverLetterPreview({ coverLetter }: CoverLetterCardProps) {
	// For now, show a styled preview with the content
	// In the future, this could be replaced with an actual rendered preview
	return (
		<div className="relative size-full overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background p-6">
			{/* Paper-like background */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

			<div className="relative space-y-4">
				{/* Header section */}
				<div className="flex items-start gap-3 border-border/30 border-b pb-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
						<EnvelopeIcon className="size-5 text-primary" weight="duotone" />
					</div>
					<div className="min-w-0 flex-1">
						<h4 className="truncate font-semibold text-sm">{coverLetter.title}</h4>
						{coverLetter.recipient && (
							<p className="truncate text-muted-foreground text-xs">To: {coverLetter.recipient}</p>
						)}
					</div>
				</div>

				{/* Content preview */}
				<div className="space-y-2">
					{coverLetter.content ? (
						<div className="line-clamp-6 text-muted-foreground text-xs leading-relaxed">{coverLetter.content}</div>
					) : (
						<div className="flex items-center justify-center py-8">
							<p className="text-muted-foreground text-xs italic">No content yet</p>
						</div>
					)}
				</div>
			</div>

			{/* Gradient overlay for fade effect */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/80 to-transparent" />
		</div>
	);
}
