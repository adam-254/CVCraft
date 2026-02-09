import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RouterOutput } from "@/integrations/orpc/client";

type CoverLetter = RouterOutput["coverLetter"]["list"][number];

type Props = {
	coverLetters: CoverLetter[];
};

export function CoverLetterListView({ coverLetters }: Props) {
	return (
		<div className="flex flex-col gap-y-2">
			<AnimatePresence>
				{coverLetters?.map((coverLetter, index) => (
					<motion.div
						layout
						key={coverLetter.id}
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, x: -50, filter: "blur(12px)" }}
						transition={{ delay: index * 0.05 }}
					>
						<CoverLetterListItem coverLetter={coverLetter} />
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}

function CoverLetterListItem({ coverLetter }: { coverLetter: CoverLetter }) {
	const { i18n } = useLingui();

	const updatedAt = useMemo(() => {
		return Intl.DateTimeFormat(i18n.locale, { dateStyle: "long", timeStyle: "short" }).format(
			coverLetter.updatedAt,
		);
	}, [i18n.locale, coverLetter.updatedAt]);

	return (
		<Button
			asChild
			size="lg"
			variant="outline"
			tapScale={0.99}
			className="group h-16 w-full justify-start gap-4 border-border/50 bg-gradient-to-r from-background via-background to-muted/20 text-start transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
		>
			<Link to="/cover-letter/$id" params={{ id: coverLetter.id }}>
				<div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 transition-all group-hover:scale-110">
					<div className="size-2 rounded-full bg-primary" />
				</div>

				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<div className="truncate font-semibold">{coverLetter.title}</div>
					<p className="truncate text-muted-foreground text-xs">
						<Trans>Last updated on {updatedAt}</Trans>
					</p>
				</div>

				{coverLetter.tags && coverLetter.tags.length > 0 && (
					<div className="hidden items-center gap-1.5 lg:flex">
						{coverLetter.tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant="outline" className="border-primary/20 bg-primary/10 text-xs">
								{tag}
							</Badge>
						))}
						{coverLetter.tags.length > 3 && (
							<Badge variant="outline" className="border-muted-foreground/20 bg-muted/50 text-xs">
								+{coverLetter.tags.length - 3}
							</Badge>
						)}
					</div>
				)}
			</Link>
		</Button>
	);
}
