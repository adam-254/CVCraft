import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { CircleNotchIcon, LockSimpleIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { match, P } from "ts-pattern";
import { orpc, type RouterOutput } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { ResumeContextMenu } from "../menus/context-menu";
import { BaseCard } from "./base-card";

type ResumeCardProps = {
	resume: RouterOutput["resume"]["list"][number];
};

export function ResumeCard({ resume }: ResumeCardProps) {
	const { i18n } = useLingui();

	const { data: screenshotData, isLoading } = useQuery(
		orpc.printer.getResumeScreenshot.queryOptions({ input: { id: resume.id } }),
	);

	const updatedAt = useMemo(() => {
		return Intl.DateTimeFormat(i18n.locale, { dateStyle: "long", timeStyle: "short" }).format(resume.updatedAt);
	}, [i18n.locale, resume.updatedAt]);

	return (
		<ResumeContextMenu resume={resume}>
			<Link to="/builder/$resumeId" params={{ resumeId: resume.id }} className="cursor-default">
				<BaseCard title={resume.name} description={t`Last updated on ${updatedAt}`} tags={resume.tags}>
					{match({ isLoading, imageSrc: screenshotData?.url })
						.with({ isLoading: true }, () => (
							<div className="flex size-full items-center justify-center bg-gradient-to-br from-muted/50 to-muted/20">
								<div className="flex flex-col items-center gap-3">
									<CircleNotchIcon weight="bold" className="size-12 animate-spin text-primary" />
									<p className="text-muted-foreground text-xs">Loading preview...</p>
								</div>
							</div>
						))
						.with({ imageSrc: P.string }, ({ imageSrc }) => (
							<>
								<img
									src={imageSrc}
									alt={resume.name}
									className={cn(
										"size-full object-cover transition-all duration-300 group-hover:scale-105",
										resume.isLocked && "blur-sm",
									)}
								/>
								{/* Gradient overlay for better text readability */}
								<div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
							</>
						))
						.otherwise(() => (
							<div className="flex size-full items-center justify-center bg-gradient-to-br from-muted/50 to-muted/20">
								<p className="text-muted-foreground text-sm">No preview available</p>
							</div>
						))}

					<ResumeLockOverlay isLocked={resume.isLocked} />
				</BaseCard>
			</Link>
		</ResumeContextMenu>
	);
}

function ResumeLockOverlay({ isLocked }: { isLocked: boolean }) {
	return (
		<AnimatePresence>
			{isLocked && (
				<motion.div
					key="resume-lock-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm"
				>
					<div className="flex size-24 items-center justify-center rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-amber-500/10 shadow-xl">
						<LockSimpleIcon weight="bold" className="size-12 text-amber-500" />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
