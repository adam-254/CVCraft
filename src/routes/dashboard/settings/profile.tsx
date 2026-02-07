import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CheckIcon, UserCircleIcon, WarningIcon } from "@phosphor-icons/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { match } from "ts-pattern";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/integrations/auth/client";

export const Route = createFileRoute("/dashboard/settings/profile")({
	component: RouteComponent,
});

const formSchema = z.object({
	name: z.string().trim().min(1).max(64),
	username: z
		.string()
		.trim()
		.min(1)
		.max(64)
		.regex(/^[a-z0-9._-]+$/, {
			message: "Username can only contain lowercase letters, numbers, dots, hyphens and underscores.",
		}),
	email: z.email().trim(),
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
	const router = useRouter();
	const { session } = Route.useRouteContext();

	const defaultValues = useMemo(() => {
		return {
			name: session.user.name,
			username: session.user.username,
			email: session.user.email,
		};
	}, [session.user]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const onCancel = () => {
		form.reset(defaultValues);
	};

	const onSubmit = async (data: FormValues) => {
		const { error } = await authClient.updateUser({
			name: data.name,
			username: data.username,
			displayUsername: data.username,
		});

		if (error) {
			toast.error(error.message);
			return;
		}

		toast.success(t`Your profile has been updated successfully.`);
		form.reset({ name: data.name, username: data.username, email: session.user.email });
		router.invalidate();

		if (data.email !== session.user.email) {
			const { error } = await authClient.changeEmail({
				newEmail: data.email,
				callbackURL: "/dashboard/settings/profile",
			});

			if (error) {
				toast.error(error.message);
				return;
			}

			toast.success(
				t`A confirmation link has been sent to your current email address. Please check your inbox to confirm the change.`,
			);
			form.reset({ name: data.name, username: data.username, email: session.user.email });
			router.invalidate();
		}
	};

	const handleResendVerificationEmail = async () => {
		const toastId = toast.loading(t`Resending verification email...`);

		const { error } = await authClient.sendVerificationEmail({
			email: session.user.email,
			callbackURL: "/dashboard/settings/profile",
		});

		if (error) {
			toast.error(error.message, { id: toastId });
			return;
		}

		toast.success(
			t`A new verification link has been sent to your email address. Please check your inbox to verify your account.`,
			{ id: toastId },
		);
		router.invalidate();
	};

	return (
		<div className="relative mx-auto w-full max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-0 -left-32 size-64 animate-pulse rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
				<div className="absolute top-32 -right-32 size-96 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl delay-1000" />
			</div>

			{/* Header Section */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="relative space-y-3 text-center"
			>
				<div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-lg">
					<UserCircleIcon className="size-8 text-primary" weight="duotone" />
				</div>
				<div>
					<h1 className="font-bold text-3xl tracking-tight">
						<Trans>My Profile</Trans>
					</h1>
					<p className="mt-2 text-muted-foreground">
						<Trans>Manage your personal information and account settings</Trans>
					</p>
				</div>
			</motion.div>

			<Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

			<Form {...form}>
				<motion.form
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="relative mx-auto max-w-2xl space-y-6"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					{/* Form Card Container */}
					<div className="space-y-6 rounded-2xl border-2 border-border/50 bg-gradient-to-br from-card via-card to-muted/10 p-8 shadow-xl backdrop-blur-sm">
						<div className="space-y-1 border-border/30 border-b pb-4">
							<h2 className="font-semibold text-lg">
								<Trans>Personal Information</Trans>
							</h2>
							<p className="text-muted-foreground text-sm">
								<Trans>Update your account details below</Trans>
							</p>
						</div>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 font-semibold text-sm">
										<div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
											<UserCircleIcon className="size-3.5 text-primary" weight="bold" />
										</div>
										<Trans>Full Name</Trans>
									</FormLabel>
									<FormControl>
										<Input
											min={3}
											max={64}
											autoComplete="name"
											placeholder="John Doe"
											className="h-12 rounded-xl border-2 border-border/50 bg-background/50 px-4 transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 font-semibold text-sm">
										<div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 shadow-sm">
											<span className="font-bold text-blue-600 text-xs">@</span>
										</div>
										<Trans>Username</Trans>
									</FormLabel>
									<FormControl>
										<Input
											min={3}
											max={64}
											autoComplete="username"
											placeholder="john.doe"
											className="h-12 rounded-xl border-2 border-border/50 bg-background/50 px-4 lowercase transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 font-semibold text-sm">
										<div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10 shadow-sm">
											<svg className="size-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
												/>
											</svg>
										</div>
										<Trans>Email Address</Trans>
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											autoComplete="email"
											placeholder="john.doe@example.com"
											className="h-12 rounded-xl border-2 border-border/50 bg-background/50 px-4 lowercase transition-all focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10"
											{...field}
										/>
									</FormControl>
									<FormMessage />
									{match(session.user.emailVerified)
										.with(true, () => (
											<div className="flex items-center gap-3 rounded-xl border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-green-500/5 px-4 py-3 shadow-sm">
												<div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/30 to-green-500/20 shadow-sm">
													<CheckIcon className="size-3.5 text-green-600" weight="bold" />
												</div>
												<p className="font-medium text-green-700 text-sm">
													<Trans>Email verified</Trans>
												</p>
											</div>
										))
										.with(false, () => (
											<div className="flex items-center gap-3 rounded-xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5 px-4 py-3 shadow-sm">
												<div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-500/20 shadow-sm">
													<WarningIcon className="size-3.5 text-amber-600" weight="bold" />
												</div>
												<div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
													<p className="font-medium text-amber-700 text-sm">
														<Trans>Email not verified</Trans>
													</p>
													<span className="hidden text-amber-500/50 sm:inline">•</span>
													<Button
														variant="link"
														className="h-auto w-fit p-0 font-semibold text-amber-700 text-sm underline-offset-2 hover:text-amber-800"
														onClick={handleResendVerificationEmail}
													>
														<Trans>Resend verification</Trans>
													</Button>
												</div>
											</div>
										))
										.exhaustive()}
								</FormItem>
							)}
						/>
					</div>

					<AnimatePresence>
						{form.formState.isDirty && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								className="flex flex-col items-stretch justify-end gap-3 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-muted/30 to-muted/10 p-6 shadow-lg sm:flex-row sm:items-center"
							>
								<div className="flex-1">
									<p className="font-semibold text-sm">
										<Trans>Unsaved Changes</Trans>
									</p>
									<p className="text-muted-foreground text-xs">
										<Trans>You have unsaved changes. Save or cancel to continue.</Trans>
									</p>
								</div>
								<div className="flex gap-3">
									<Button
										type="reset"
										variant="outline"
										onClick={onCancel}
										className="flex-1 border-2 border-border/50 transition-all hover:border-border hover:bg-muted/50 sm:flex-none"
									>
										<Trans>Cancel</Trans>
									</Button>

									<Button
										type="submit"
										className="flex-1 bg-gradient-to-r from-primary to-primary/90 font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30 hover:shadow-xl sm:flex-none"
									>
										<Trans>Save Changes</Trans>
									</Button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.form>
			</Form>
		</div>
	);
}
