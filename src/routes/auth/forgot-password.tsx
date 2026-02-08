import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { simpleAuthClient } from "@/integrations/auth/simple-client";

export const Route = createFileRoute("/auth/forgot-password")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.flags.disableEmailAuth) throw redirect({ to: "/auth/login", replace: true });
	},
});

const formSchema = z.object({
	email: z.email(),
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const toastId = toast.loading(t`Sending password reset email...`);

		try {
			await simpleAuthClient.forgotPassword(data.email);
			setSubmitted(true);
			toast.success(t`Password reset email sent!`, { id: toastId });
		} catch (error: any) {
			toast.error(error.message || t`Failed to send reset email`, { id: toastId });
		}
	};

	if (submitted) return <PostForgotPasswordScreen />;

	return (
		<>
			<div className="space-y-3 text-center">
				<div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-lg">
					<svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
						/>
					</svg>
				</div>

				<h1 className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text font-bold text-2xl text-transparent tracking-tight">
					<Trans>Forgot Password?</Trans>
				</h1>
				<p className="text-muted-foreground text-sm">
					<Trans>No worries, we'll send you reset instructions</Trans>
				</p>

				<div className="text-muted-foreground text-xs">
					<Trans>
						Remember your password?{" "}
						<Button
							asChild
							variant="link"
							className="h-auto gap-1 px-1! py-0 font-semibold text-primary text-xs hover:underline"
						>
							<Link to="/auth/login">
								Sign in now <ArrowRightIcon className="size-3" />
							</Link>
						</Button>
					</Trans>
				</div>
			</div>

			<Form {...form}>
				<form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2 font-semibold text-sm">
									<div className="flex size-5 items-center justify-center rounded-md bg-primary/10">
										<svg className="size-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
										className="h-11 rounded-xl border-2 pl-4 lowercase transition-all focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="h-12 w-full rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
					>
						<Trans>Send Reset Link</Trans>
					</Button>
				</form>
			</Form>
		</>
	);
}

function PostForgotPasswordScreen() {
	return (
		<>
			<div className="space-y-4 text-center">
				<div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 via-green-500/10 to-green-500/5 shadow-lg">
					<svg
						className="size-8 text-green-600 dark:text-green-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				</div>

				<h1 className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text font-bold text-2xl text-transparent tracking-tight">
					<Trans>Check Your Email</Trans>
				</h1>
				<p className="text-muted-foreground text-sm leading-relaxed">
					<Trans>
						We've sent a password reset link to your email address. Click the link in the email to reset your password.
					</Trans>
				</p>
			</div>

			<div className="space-y-3">
				<Button
					asChild
					className="h-11 w-full rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
				>
					<a href="mailto:">
						<Trans>Open Email Client</Trans>
					</a>
				</Button>

				<Button
					asChild
					variant="outline"
					className="h-11 w-full rounded-xl border-2 font-semibold hover:bg-secondary/80"
				>
					<Link to="/auth/login">
						<Trans>Back to Login</Trans>
					</Link>
				</Button>
			</div>
		</>
	);
}
