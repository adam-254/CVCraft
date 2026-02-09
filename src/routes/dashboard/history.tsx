import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { ClockCounterClockwiseIcon, GridFourIcon, ListIcon, SortAscendingIcon, TagIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, stripSearchParams, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useMemo } from "react";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import { MultipleCombobox } from "@/components/ui/multiple-combobox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orpc } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { GridView } from "./resumes/-components/grid-view";
import { ListView } from "./resumes/-components/list-view";
import { CoverLetterGridView } from "./cover-letters/-components/cover-letter-grid-view";
import { CoverLetterListView } from "./cover-letters/-components/cover-letter-list-view";

type SortOption = "lastUpdatedAt" | "createdAt" | "name";

const searchSchema = z.object({
	tags: z.array(z.string()).default([]),
	sort: z.enum(["lastUpdatedAt", "createdAt", "name"]).default("lastUpdatedAt"),
	view: z.enum(["grid", "list"]).default("grid"),
});

export const Route = createFileRoute("/dashboard/history")({
	component: RouteComponent,
	validateSearch: zodValidator(searchSchema),
	search: {
		middlewares: [stripSearchParams({ tags: [], sort: "lastUpdatedAt", view: "grid" })],
	},
});

function RouteComponent() {
	const { i18n } = useLingui();
	const { tags, sort, view } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const { data: allTags } = useQuery(orpc.resume.tags.list.queryOptions());
	// Fetch resumes sorted by last updated for history view
	const { data: allResumes } = useQuery(
		orpc.resume.list.queryOptions({ input: { tags, sort: "lastUpdatedAt" } }),
	);
	
	// Fetch cover letters
	const { data: allCoverLetters } = useQuery(orpc.coverLetter.list.queryOptions());

	// Filter to show only recently updated resumes (last 30 days)
	const resumes = useMemo(() => {
		if (!allResumes) return [];
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		return allResumes.filter((resume) => new Date(resume.updatedAt) >= thirtyDaysAgo);
	}, [allResumes]);
	
	// Filter to show only recently updated cover letters (last 30 days)
	const coverLetters = useMemo(() => {
		if (!allCoverLetters) return [];
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		return allCoverLetters.filter((letter) => new Date(letter.updatedAt) >= thirtyDaysAgo);
	}, [allCoverLetters]);

	const tagOptions = useMemo(() => {
		if (!allTags) return [];
		return allTags.map((tag) => ({ value: tag, label: tag }));
	}, [allTags]);

	const sortOptions = useMemo(() => {
		return [
			{ value: "lastUpdatedAt", label: i18n.t("Last Updated") },
			{ value: "createdAt", label: i18n.t("Created") },
			{ value: "name", label: i18n.t("Name") },
		];
	}, [i18n]);

	const onViewChange = (value: string) => {
		navigate({ search: { tags, sort, view: value as "grid" | "list" } });
	};

	const resumeCount = resumes?.length ?? 0;
	const coverLetterCount = coverLetters?.length ?? 0;
	const totalRecentCount = resumeCount + coverLetterCount;
	const totalCount = (allResumes?.length ?? 0) + (allCoverLetters?.length ?? 0);

	return (
		<div className="relative space-y-6">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-0 -left-32 size-64 animate-pulse rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-3xl" />
				<div className="absolute top-32 -right-32 size-96 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl delay-1000" />
			</div>

			{/* Centered Header Section */}
			<div className="relative">
				<div className="mx-auto max-w-3xl space-y-4 text-center">
					<div className="inline-flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent px-6 py-3 shadow-lg shadow-purple-500/10">
						<div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-500/10">
							<ClockCounterClockwiseIcon className="size-5 text-purple-500" weight="bold" />
						</div>
						<h1 className="font-bold text-2xl">
							<Trans>History</Trans>
						</h1>
						{totalRecentCount > 0 && (
							<div className="rounded-full border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-purple-500/10 px-3 py-1 font-semibold text-purple-600 text-sm">
								{totalRecentCount}
							</div>
						)}
					</div>
					<p className="text-base text-muted-foreground">
						<Trans>Recently updated resumes and cover letters from the last 30 days</Trans>
						{totalCount > totalRecentCount && (
							<span className="ml-2 text-muted-foreground/70 text-xs">
								({totalRecentCount} of {totalCount} items)
							</span>
						)}
					</p>
				</div>

				<Separator className="mt-8 bg-gradient-to-r from-transparent via-border to-transparent" />
			</div>

			<div className="relative flex flex-wrap items-center gap-3">
				<Combobox
					value={sort}
					options={sortOptions}
					onValueChange={(value) => {
						if (!value) return;
						navigate({ search: { tags, sort: value as SortOption, view } });
					}}
					buttonProps={{
						title: t`Sort by`,
						variant: "outline",
						className:
							"gap-2 border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/40 transition-all",
						children: (_, option) => (
							<>
								<div className="flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-primary/10">
									<SortAscendingIcon className="size-3" />
								</div>
								{option?.label}
							</>
						),
					}}
				/>

				<MultipleCombobox
					value={tags}
					options={tagOptions}
					onValueChange={(value) => {
						navigate({ search: { tags: value, sort, view } });
					}}
					buttonProps={{
						variant: "outline",
						title: t`Filter by`,
						className: cn(
							"gap-2 border-blue-500/20 bg-background/50 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-blue-500/5",
							{ hidden: tagOptions.length === 0 },
						),
						children: (_, options) => (
							<>
								<div className="flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-blue-500/10">
									<TagIcon className="size-3" />
								</div>
								{options.map((option) => (
									<Badge key={option.value} variant="outline" className="border-blue-500/30 bg-blue-500/10">
										{option.label}
									</Badge>
								))}
							</>
						),
					}}
				/>

				<Tabs className="ltr:ms-auto rtl:me-auto" value={view} onValueChange={onViewChange}>
					<TabsList className="border border-border/50 bg-background/50 backdrop-blur-sm">
						<TabsTrigger
							value="grid"
							className="gap-2 rounded-r-none data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-primary/10"
						>
							<GridFourIcon className="size-4" />
							<Trans>Grid</Trans>
						</TabsTrigger>

						<TabsTrigger
							value="list"
							className="gap-2 rounded-l-none data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-primary/10"
						>
							<ListIcon className="size-4" />
							<Trans>List</Trans>
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="relative">
				{view === "list" ? (
					<div className="space-y-6">
						{resumeCount > 0 && (
							<div>
								<h3 className="mb-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">
									<Trans>Resumes</Trans> ({resumeCount})
								</h3>
								<ListView resumes={resumes ?? []} showCreateCards={false} />
							</div>
						)}
						{coverLetterCount > 0 && (
							<div>
								<h3 className="mb-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">
									<Trans>Cover Letters</Trans> ({coverLetterCount})
								</h3>
								<CoverLetterListView coverLetters={coverLetters ?? []} />
							</div>
						)}
					</div>
				) : (
					<div className="space-y-6">
						{resumeCount > 0 && (
							<div>
								<h3 className="mb-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">
									<Trans>Resumes</Trans> ({resumeCount})
								</h3>
								<GridView resumes={resumes ?? []} showCreateCards={false} />
							</div>
						)}
						{coverLetterCount > 0 && (
							<div>
								<h3 className="mb-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">
									<Trans>Cover Letters</Trans> ({coverLetterCount})
								</h3>
								<CoverLetterGridView coverLetters={coverLetters ?? []} />
							</div>
						)}
					</div>
				)}
			</div>

			{totalRecentCount === 0 && (
				<div className="flex min-h-[400px] items-center justify-center">
					<div className="text-center">
						<div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20">
							<ClockCounterClockwiseIcon className="size-10 text-muted-foreground" />
						</div>
						<h3 className="mb-2 font-semibold text-lg">
							<Trans>No recent activity</Trans>
						</h3>
						<p className="text-muted-foreground text-sm">
							{totalCount > 0 ? (
								<Trans>No resumes or cover letters updated in the last 30 days</Trans>
							) : (
								<Trans>Create your first resume or cover letter to see it here</Trans>
							)}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
