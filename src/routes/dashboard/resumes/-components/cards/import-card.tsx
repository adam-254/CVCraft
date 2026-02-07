import { t } from "@lingui/core/macro";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { useDialogStore } from "@/dialogs/store";
import { BaseCard } from "./base-card";

export function ImportResumeCard() {
	const { openDialog } = useDialogStore();

	return (
		<BaseCard
			title={t`Import an existing resume`}
			description={t`Continue where you left off`}
			onClick={() => openDialog("resume.import", undefined)}
		>
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/10">
				{/* Icon badge */}
				<div className="flex size-20 items-center justify-center rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-blue-500/10 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/50 group-hover:shadow-blue-500/20">
					<DownloadSimpleIcon weight="bold" className="size-10 text-blue-500" />
				</div>

				{/* Decorative circles */}
				<div className="absolute top-12 left-12 size-3 animate-pulse rounded-full bg-blue-500/20" />
				<div className="absolute top-20 right-8 size-2 animate-pulse rounded-full bg-blue-500/30 delay-300" />
				<div className="absolute right-12 bottom-24 size-2.5 animate-pulse rounded-full bg-blue-500/25 delay-700" />
			</div>
		</BaseCard>
	);
}
