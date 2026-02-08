import { Trans } from "@lingui/react/macro";
import { EnvelopeSimpleIcon, FileTextIcon, PlusIcon, SparkleIcon } from "@phosphor-icons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { useDialogStore } from "@/dialogs/store";

export const Route = createFileRoute("/dashboard/cover-letters/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { openDialog } = useDialogStore();

	const handleCreateCoverLetter = () => {
		openDialog("cover-letter.create", {});
	};

	const handleViewCoverLetters = () => {
		navigate({ to: "/dashboard/cover-letters/list" });
	};

	return (
		<div className="relative flex min-h-[calc(100vh-8rem)] flex-col">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-0 -left-32 size-96 animate-pulse rounded-full bg-linear-to-br from-green-500/20 to-transparent blur-3xl" />
				<div className="absolute top-32 -right-32 size-96 animate-pulse rounded-full bg-linear-to-br from-emerald-500/20 to-transparent blur-3xl delay-1000" />
				<div className="absolute top-64 left-1/2 size-80 animate-pulse rounded-full bg-linear-to-br from-teal-500/15 to-transparent blur-3xl delay-500" />
			</div>

			{/* Centered Header Section */}
			<div className="relative">
				<div className="mx-auto max-w-3xl space-y-4 text-center">
					<div className="inline-flex items-center gap-3 rounded-2xl border border-green-500/20 bg-linear-to-r from-green-500/10 via-green-500/5 to-transparent px-6 py-3 shadow-green-500/10 shadow-lg">
						<div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-green-500/30 to-green-500/10">
							<EnvelopeSimpleIcon className="size-5 text-green-600" weight="bold" />
						</div>
						<h1 className="font-bold text-2xl">
							<Trans>Create Cover Letter</Trans>
						</h1>
					</div>
					<p className="text-base text-muted-foreground">
						<Trans>Create professional cover letters to complement your resumes</Trans>
					</p>
				</div>

				<Separator className="mt-8 bg-linear-to-r from-transparent via-border to-transparent" />
			</div>

			{/* Main Content - Centered */}
			<div className="relative flex flex-1 items-center justify-center py-12">
				<div className="w-full max-w-4xl space-y-8">
					{/* Hero Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-center"
					>
						<div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-3xl bg-linear-to-br from-green-500/20 via-green-500/15 to-green-500/10 shadow-2xl shadow-green-500/20">
							<SparkleIcon className="size-12 text-green-600" weight="duotone" />
						</div>
						<h1 className="mb-4 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text font-bold text-4xl text-transparent">
							<Trans>What would you like to create?</Trans>
						</h1>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
							<Trans>Choose how you want to start building your cover letter</Trans>
						</p>
					</motion.div>

					{/* Action Cards */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="grid gap-6 md:grid-cols-2"
					>
						{/* Create New Cover Letter Card */}
						<button
							onClick={handleCreateCoverLetter}
							className="group relative overflow-hidden rounded-3xl border-2 border-border/50 bg-linear-to-br from-background via-background to-green-500/5 p-8 text-left shadow-xl transition-all hover:scale-[1.02] hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20"
						>
							{/* Decorative gradient overlay */}
							<div className="absolute top-0 right-0 size-40 rounded-full bg-linear-to-br from-green-500/20 to-transparent blur-3xl transition-all group-hover:scale-150" />

			{/* Shine effect */}
							<div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

							<div className="relative space-y-4">
								<div className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-500/30 via-green-500/20 to-green-500/10 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-green-500/30 group-hover:shadow-xl">
									<PlusIcon className="size-8 text-green-600" weight="bold" />
								</div>

								<div>
									<h3 className="mb-2 font-bold text-2xl">
										<Trans>Create from Scratch</Trans>
									</h3>
									<p className="text-muted-foreground text-sm">
										<Trans>Start with a blank canvas and build your cover letter step by step</Trans>
									</p>
								</div>

								<div className="flex items-center gap-2 font-medium text-green-600 text-sm">
									<Trans>Get Started</Trans>
									<motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
										→
									</motion.div>
								</div>
							</div>
						</button>

						{/* View All Cover Letters Card */}
						<button
							onClick={handleViewCoverLetters}
							className="group relative overflow-hidden rounded-3xl border-2 border-border/50 bg-linear-to-br from-background via-background to-emerald-500/5 p-8 text-left shadow-xl transition-all hover:scale-[1.02] hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20"
						>
							{/* Decorative gradient overlay */}
							<div className="absolute top-0 right-0 size-40 rounded-full bg-linear-to-br from-emerald-500/20 to-transparent blur-3xl transition-all group-hover:scale-150" />

							{/* Shine effect */}
							<div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

							<div className="relative space-y-4">
								<div className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500/30 via-emerald-500/20 to-emerald-500/10 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-emerald-500/30 group-hover:shadow-xl">
									<FileTextIcon className="size-8 text-emerald-600" weight="bold" />
								</div>

								<div>
									<h3 className="mb-2 font-bold text-2xl">
										<Trans>View All Cover Letters</Trans>
									</h3>
									<p className="text-muted-foreground text-sm">
										<Trans>Browse and manage your existing cover letters</Trans>
									</p>
								</div>

								<div className="flex items-center gap-2 font-medium text-emerald-600 text-sm">
									<Trans>View All</Trans>
									<motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
										→
									</motion.div>
								</div>
							</div>
						</button>
					</motion.div>

					{/* Quick Tips */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="rounded-2xl border border-border/30 bg-linear-to-br from-muted/30 to-muted/10 p-6"
					>
						<div className="flex items-start gap-4">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-green-500/20 to-green-500/10">
								<span className="text-xl">💡</span>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold">
									<Trans>Quick Tips</Trans>
								</h4>
								<ul className="space-y-1 text-muted-foreground text-sm">
									<li className="flex items-start gap-2">
										<span className="text-green-600">•</span>
										<Trans>Personalize each cover letter for the specific job</Trans>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-green-600">•</span>
										<Trans>Your work is automatically saved as you type</Trans>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-green-600">•</span>
										<Trans>Use AI to help generate compelling content</Trans>
									</li>
								</ul>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
