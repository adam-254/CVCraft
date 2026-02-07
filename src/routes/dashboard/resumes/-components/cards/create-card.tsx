import { t } from "@lingui/core/macro";
import { PlusIcon } from "@phosphor-icons/react";
import { useDialogStore } from "@/dialogs/store";
import { BaseCard } from "./base-card";

export function CreateResumeCard() {
	const { openDialog } = useDialogStore();

	return (
		<BaseCard
			title={t`Create a new resume`}
			description={t`Start building your resume from scratch`}
			onClick={() => openDialog("resume.create", undefined)}
		>
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
				{/* Icon badge */}
				<div className="flex size-20 items-center justify-center rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-primary/20">
					<PlusIcon weight="bold" className="size-10 text-primary" />
				</div>

				{/* Decorative circles */}
				<div className="absolute top-8 left-8 size-3 animate-pulse rounded-full bg-primary/20" />
				<div className="absolute top-16 right-12 size-2 animate-pulse rounded-full bg-primary/30 delay-300" />
				<div className="absolute right-8 bottom-24 size-2.5 animate-pulse rounded-full bg-primary/25 delay-700" />
			</div>
		</BaseCard>
	);
}
