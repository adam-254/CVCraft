import { Trans } from "@lingui/react/macro";
import { EnvelopeSimpleIcon, PlusIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDialogStore } from "@/dialogs/store";
import { orpc } from "@/integrations/orpc/client";
import { CoverLetterGridView } from "./-components/cover-letter-grid-view";

export const Route = createFileRoute("/dashboard/cover-letters/list")({
	component: RouteComponent,
});

function RouteComponent() {
	const { openDialog } = useDialogStore();
	const { data: coverLetters } = useQuery(orpc.coverLetter.list.queryOptions());

	const handleCreate = () => {
		openDialog("cover-letter.create", {});
	};

	const coverLetterCount = coverLetters?.length ?? 0;

	return (
		<div className="relative space-y-6">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-0 -left-32 size-64 animate-pulse rounded-full bg-gradient-to-br from-green-500/20 to-transparent blur-3xl" />
				<div className="absolute top-32 -right-32 size-96 animate-pulse rounded-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-3xl delay-1000" />
			</div>

			{/* Header */}
			<div className="relative">
				<div className="flex items-center justify-between">
					<div className="inline-flex items-center gap-3 rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent px-6 py-3 shadow-lg shadow-green-500/10">
						<div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/30 to-green-500/10">
							<EnvelopeSimpleIcon className="size-5 text-green-500" weight="bold" />
						</div>
						<h1 className="font-bold text-2xl">
							<Trans>Cover Letters</Trans>
						</h1>
						{coverLetterCount > 0 && (
							<div className="rounded-full border border-green-500/30 bg-gradient-to-br from-green-500/20 to-green-500/10 px-3 py-1 font-semibold text-green-600 text-sm">
								{coverLetterCount}
							</div>
						)}
					</div>

					<Button onClick={handleCreate} className="gap-2">
						<PlusIcon className="size-4" weight="bold" />
						<Trans>New Cover Letter</Trans>
					</Button>
				</div>

				<Separator className="mt-8 bg-gradient-to-r from-transparent via-border to-transparent" />
			</div>

			{/* Cover Letters Grid */}
			<div className="relative">
				{coverLetterCount === 0 ? (
					<div className="flex min-h-[400px] items-center justify-center">
						<div className="text-center">
							<div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20">
								<EnvelopeSimpleIcon className="size-10 text-muted-foreground" />
							</div>
							<h3 className="mb-2 font-semibold text-lg">
								<Trans>No cover letters yet</Trans>
							</h3>
							<p className="mb-4 text-muted-foreground text-sm">
								<Trans>Create your first cover letter to get started</Trans>
							</p>
							<Button onClick={handleCreate}>
								<PlusIcon className="size-4" />
								<Trans>Create Cover Letter</Trans>
							</Button>
						</div>
					</div>
				) : (
					<CoverLetterGridView coverLetters={coverLetters ?? []} />
				)}
			</div>
		</div>
	);
}
