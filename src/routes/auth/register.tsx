import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useToggle } from "usehooks-ts";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { simpleAuthClient } from "@/integrations/auth/simple-client";
import { SocialAuth } from "./-components/social-auth";

export const Route = createFileRoute("/auth/register")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session) throw redirect({ to: "/dashboard", replace: true });
		if (context.flags.disableSignups) throw redirect({ to: "/auth/login", replace: true });
		return { session: null };
	},
});

const formSchema = z.object({
	name: z.string().min(3).max(64),
	username: z
		.string()
		.min(3)
		.max(64)
		.trim()
		.toLowerCase()
		.regex(/^[a-z0-9._-]+$/, {
			message: "Username can only contain lowercase letters, numbers, dots, hyphens and underscores.",
		}),
	email: z.email().toLowerCase(),
	password: z.string().min(6).max(64),
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
	const router = useRouter();
	const [submitted, setSubmitted] = useState(false);
	const [showPassword, toggleShowPassword] = useToggle(false);
	const { flags } = Route.useRouteContext();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const toastId = toast.loading(t`Signing up...`);

		try {
			await simpleAuthClient.signUp({
				name: data.name,
				email: data.email,
				password: data.password,
				username: data.username,
			});

			// Wait a bit to ensure cookie is set before invalidating
			await new Promise(resolve => setTimeout(resolve, 100));
			
			await router.invalidate();
			setSubmitted(true);
			toast.success(t`Account created successfully!`, { id: toastId });
		} catch (error: any) {
			// Enhanced error messages for better user experience
			let errorMessage = error.message;

			if (error.message.includes("email") || error.message.includes("already exists")) {
				errorMessage = t`This email is already registered. Please login or use a different email.`;
				form.setError("email", { message: t`This email is already registered` });
			} else if (error.message.includes("username")) {
				errorMessage = t`This username is already taken. Please choose a different username.`;
				form.setError("username", { message: t`This username is already taken` });
			}

			toast.error(errorMessage, { id: toastId });
		}
	};

	if (submitted) return <PostSignupScreen />;

	return (
		<>
			<div className="space-y-3 text-center">
				<div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-lg">
					<svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
						/>
					</svg>
				</div>

				<h1 className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text font-bold text-2xl text-transparent tracking-tight">
					<Trans>Create Account</Trans>
				</h1>
				<p className="text-muted-foreground text-xs">
					<Trans>Join CVCraft and start building your resume</Trans>
				</p>

				<div className="text-muted-foreground text-xs">
					<Trans>
						Already have an account?{" "}
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

			{!flags.disableEmailAuth && (
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 font-semibold text-xs">
										<div className="flex size-4 items-center justify-center rounded-md bg-primary/10">
											<svg className="size-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
										</div>
										<Trans>Name</Trans>
									</FormLabel>
									<FormControl>
										<Input
											min={3}
											max={64}
											autoComplete="name"
											placeholder="John Doe"
											className="h-10 rounded-xl border-2 pl-4 transition-all focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
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
									<FormLabel className="flex items-center gap-2 font-semibold text-xs">
										<div className="flex size-4 items-center justify-center rounded-md bg-primary/10">
											<svg className="size-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
												/>
											</svg>
										</div>
										<Trans>Username</Trans>
									</FormLabel>
									<FormControl>
										<Input
											min={3}
											max={64}
											autoComplete="username"
											placeholder="john.doe"
											className="h-10 rounded-xl border-2 pl-4 lowercase transition-all focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
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
									<FormLabel className="flex items-center gap-2 font-semibold text-xs">
										<div className="flex size-4 items-center justify-center rounded-md bg-primary/10">
											<svg className="size-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
											className="h-10 rounded-xl border-2 pl-4 lowercase transition-all focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 font-semibold text-xs">
										<div className="flex size-4 items-center justify-center rounded-md bg-primary/10">
											<svg className="size-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
												/>
											</svg>
										</div>
										<Trans>Password</Trans>
									</FormLabel>
									<div className="flex items-center gap-x-2">
										<FormControl>
											<Input
												min={6}
												max={64}
												type={showPassword ? "text" : "password"}
												autoComplete="new-password"
												className="h-10 rounded-xl border-2 pl-4 transition-all focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
												{...field}
											/>
										</FormControl>

										<Button
											type="button"
											size="icon"
											variant="ghost"
											onClick={toggleShowPassword}
											className="size-10 rounded-xl transition-colors hover:bg-secondary/80"
										>
											{showPassword ? <EyeIcon className="size-4" /> : <EyeSlashIcon className="size-4" />}
										</Button>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="h-11 w-full rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
						>
							<Trans>Sign up</Trans>
						</Button>
					</form>
				</Form>
			)}

			<SocialAuth />
		</>
	);
}

function PostSignupScreen() {
	return (
		<>
			<div className="space-y-1 text-center">
				<h1 className="font-bold text-2xl tracking-tight">
					<Trans>You've got mail!</Trans>
				</h1>
				<p className="text-muted-foreground">
					<Trans>Check your email for a link to verify your account.</Trans>
				</p>
			</div>

			<Alert>
				<AlertTitle>
					<Trans>This step is optional, but recommended.</Trans>
				</AlertTitle>
				<AlertDescription>
					<Trans>Verifying your email is required when resetting your password.</Trans>
				</AlertDescription>
			</Alert>

			<Button asChild>
				<Link to="/dashboard">
					<Trans>Continue</Trans> <ArrowRightIcon />
				</Link>
			</Button>
		</>
	);
}
