import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { DotsThreeIcon, DownloadSimpleIcon, PlusIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/dialogs/store";
import type { RouterOutput } from "@/integrations/orpc/client";
import { ResumeDropdownMenu } from "./menus/dropdown-menu";

type Resume = RouterOutput["resume"]["list"][number];

type Props = {
	resumes: Resume[];
	showCreateCards?: boolean;
};

export function ListView({ resumes, showCreateCards = true }: Props) {
	const { openDialog } = useDialogStore();

	const handleCreateResume = () => {
		openDialog("resume.create", undefined);
	};

	const handleImportResume = () => {
		openDialog("resume.import", undefined);
	};

	return (
		<div className="flex flex-col gap-y-2">
			{showCreateCards && (
				<>
					<motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
						<Button
							size="lg"
							variant="outline"
							tapScale={0.99}
							className="group h-16 w-full justify-start gap-4 border-primary/20 bg-gradient-to-r from-background via-background to-primary/5 text-start transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
							onClick={handleCreateResume}
						>
							<div className="flex size-10 items-center justify-center rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10 transition-all group-hover:scale-110 group-hover:border-primary/50">
								<PlusIcon className="size-5 text-primary" weight="bold" />
							</div>

							<div className="flex flex-1 flex-col gap-1">
								<div className="font-semibold">
									<Trans>Create a new resume</Trans>
								</div>
								<p className="text-muted-foreground text-xs">
									<Trans>Start building your resume from scratch</Trans>
								</p>
							</div>
						</Button>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						transition={{ delay: 0.05 }}
					>
						<Button
							size="lg"
							variant="outline"
							tapScale={0.99}
							className="group h-16 w-full justify-start gap-4 border-blue-500/20 bg-gradient-to-r from-background via-background to-blue-500/5 text-start transition-all hover:border-blue-500/40 hover:shadow-blue-500/10 hover:shadow-lg"
							onClick={handleImportResume}
						>
							<div className="flex size-10 items-center justify-center rounded-xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-blue-500/10 transition-all group-hover:scale-110 group-hover:border-blue-500/50">
								<DownloadSimpleIcon className="size-5 text-blue-500" weight="bold" />
							</div>

							<div className="flex flex-1 flex-col gap-1">
								<div className="font-semibold">
									<Trans>Import an existing resume</Trans>
								</div>
								<p className="text-muted-foreground text-xs">
									<Trans>Continue where you left off</Trans>
								</p>
							</div>
						</Button>
					</motion.div>
				</>
			)}

			<AnimatePresence>
				{resumes?.map((resume, index) => (
					<motion.div
						layout
						key={resume.id}
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, x: -50, filter: "blur(12px)" }}
						transition={{ delay: showCreateCards ? (index + 2) * 0.05 : index * 0.05 }}
					>
						<ResumeListItem resume={resume} />
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}

function ResumeListItem({ resume }: { resume: Resume }) {
	const { i18n } = useLingui();

	const updatedAt = useMemo(() => {
		return Intl.DateTimeFormat(i18n.locale, { dateStyle: "long", timeStyle: "short" }).format(resume.updatedAt);
	}, [i18n.locale, resume.updatedAt]);

	return (
		<div className="flex items-center gap-x-2">
			<Button
				asChild
				size="lg"
				variant="outline"
				tapScale={0.99}
				className="group h-16 w-full flex-1 justify-start gap-4 border-border/50 bg-gradient-to-r from-background via-background to-muted/20 text-start transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
			>
				<Link to="/builder/$resumeId" params={{ resumeId: resume.id }}>
					<div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 transition-all group-hover:scale-110">
						<div className="size-2 rounded-full bg-primary" />
					</div>

					<div className="flex min-w-0 flex-1 flex-col gap-1">
						<div className="truncate font-semibold">{resume.name}</div>
						<p className="truncate text-muted-foreground text-xs">
							<Trans>Last updated on {updatedAt}</Trans>
						</p>
					</div>

					{resume.tags && resume.tags.length > 0 && (
						<div className="hidden items-center gap-1.5 lg:flex">
							{resume.tags.slice(0, 3).map((tag) => (
								<Badge key={tag} variant="outline" className="border-primary/20 bg-primary/10 text-xs">
									{tag}
								</Badge>
							))}
							{resume.tags.length > 3 && (
								<Badge variant="outline" className="border-muted-foreground/20 bg-muted/50 text-xs">
									+{resume.tags.length - 3}
								</Badge>
							)}
						</div>
					)}
				</Link>
			</Button>

			<ResumeDropdownMenu resume={resume} align="end">
				<Button
					size="icon"
					variant="outline"
					className="size-16 border-border/50 transition-all hover:border-primary/40 hover:bg-primary/5"
				>
					<DotsThreeIcon className="size-5" />
				</Button>
			</ResumeDropdownMenu>
		</div>
	);
}
