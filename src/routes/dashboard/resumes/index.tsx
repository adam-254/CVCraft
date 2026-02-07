import { Trans } from "@lingui/react/macro";
import { DownloadSimpleIcon, PlusIcon, ReadCvLogoIcon, SparkleIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { useDialogStore } from "@/dialogs/store";

export const Route = createFileRoute("/dashboard/resumes/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { openDialog } = useDialogStore();

	const handleCreateResume = () => {
		openDialog("resume.create", undefined);
	};

	const handleImportResume = () => {
		openDialog("resume.import", undefined);
	};

	return (
		<div className="relative flex min-h-[calc(100vh-8rem)] flex-col">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-0 -left-32 size-96 animate-pulse rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
				<div className="absolute top-32 -right-32 size-96 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl delay-1000" />
				<div className="absolute top-64 left-1/2 size-80 animate-pulse rounded-full bg-gradient-to-br from-purple-500/15 to-transparent blur-3xl delay-500" />
			</div>

			{/* Centered Header Section */}
			<div className="relative">
				<div className="mx-auto max-w-3xl space-y-4 text-center">
					<div className="inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-3 shadow-lg shadow-primary/10">
						<div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10">
							<ReadCvLogoIcon className="size-5 text-primary" weight="bold" />
						</div>
						<h1 className="font-bold text-2xl">
							<Trans>Create Resume</Trans>
						</h1>
					</div>
					<p className="text-base text-muted-foreground">
						<Trans>Start building your professional resume in minutes</Trans>
					</p>
				</div>

				<Separator className="mt-8 bg-gradient-to-r from-transparent via-border to-transparent" />
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
						<div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 shadow-2xl shadow-primary/20">
							<SparkleIcon className="size-12 text-primary" weight="duotone" />
						</div>
						<h1 className="mb-4 bg-gradient-to-r from-primary via-primary to-blue-500 bg-clip-text font-bold text-4xl text-transparent">
							<Trans>What would you like to create?</Trans>
						</h1>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
							<Trans>Choose how you want to start building your resume</Trans>
						</p>
					</motion.div>

					{/* Action Cards */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="grid gap-6 md:grid-cols-2"
					>
						{/* Create New Resume Card */}
						<button
							onClick={handleCreateResume}
							className="group relative overflow-hidden rounded-3xl border-2 border-border/50 bg-gradient-to-br from-background via-background to-primary/5 p-8 text-left shadow-xl transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
						>
							{/* Decorative gradient overlay */}
							<div className="absolute top-0 right-0 size-40 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl transition-all group-hover:scale-150" />

							{/* Shine effect */}
							<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

							<div className="relative space-y-4">
								<div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-primary/30 group-hover:shadow-xl">
									<PlusIcon className="size-8 text-primary" weight="bold" />
								</div>

								<div>
									<h3 className="mb-2 font-bold text-2xl">
										<Trans>Create from Scratch</Trans>
									</h3>
									<p className="text-muted-foreground text-sm">
										<Trans>
											Start with a blank canvas and build your resume step by step with our intuitive editor
										</Trans>
									</p>
								</div>

								<div className="flex items-center gap-2 font-medium text-primary text-sm">
									<Trans>Get Started</Trans>
									<motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
										→
									</motion.div>
								</div>
							</div>
						</button>

						{/* Import Resume Card */}
						<button
							onClick={handleImportResume}
							className="group relative overflow-hidden rounded-3xl border-2 border-border/50 bg-gradient-to-br from-background via-background to-blue-500/5 p-8 text-left shadow-xl transition-all hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20"
						>
							{/* Decorative gradient overlay */}
							<div className="absolute top-0 right-0 size-40 rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl transition-all group-hover:scale-150" />

							{/* Shine effect */}
							<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

							<div className="relative space-y-4">
								<div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 via-blue-500/20 to-blue-500/10 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-blue-500/30 group-hover:shadow-xl">
									<DownloadSimpleIcon className="size-8 text-blue-500" weight="bold" />
								</div>

								<div>
									<h3 className="mb-2 font-bold text-2xl">
										<Trans>Import Existing Resume</Trans>
									</h3>
									<p className="text-muted-foreground text-sm">
										<Trans>Upload your existing resume and continue editing with our powerful tools</Trans>
									</p>
								</div>

								<div className="flex items-center gap-2 font-medium text-blue-500 text-sm">
									<Trans>Import Now</Trans>
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
						className="rounded-2xl border border-border/30 bg-gradient-to-br from-muted/30 to-muted/10 p-6"
					>
						<div className="flex items-start gap-4">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
								<span className="text-xl">💡</span>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold">
									<Trans>Quick Tips</Trans>
								</h4>
								<ul className="space-y-1 text-muted-foreground text-sm">
									<li className="flex items-start gap-2">
										<span className="text-primary">•</span>
										<Trans>Choose from multiple professional templates</Trans>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary">•</span>
										<Trans>Your work is automatically saved as you type</Trans>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary">•</span>
										<Trans>View all your resumes in the History page</Trans>
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
