import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useToggle } from "usehooks-ts";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { simpleAuthClient } from "@/integrations/auth/simple-client";
import { SocialAuth } from "./-components/social-auth";

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session) throw redirect({ to: "/dashboard", replace: true });
		return { session: null };
	},
});

const formSchema = z.object({
	identifier: z.string().trim().toLowerCase(),
	password: z.string().trim().min(6).max(64),
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
	const router = useRouter();
	const navigate = useNavigate();
	const [showPassword, toggleShowPassword] = useToggle(false);
	const { flags } = Route.useRouteContext();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const toastId = toast.loading(t`Signing in...`);

		try {
			await simpleAuthClient.signIn({
				identifier: data.identifier,
				password: data.password,
			});

			router.invalidate();
			toast.success(t`Welcome back!`, { id: toastId });
			navigate({ to: "/dashboard", replace: true });
		} catch (error: any) {
			// Enhanced error messages for better user experience
			let errorMessage = error.message;
			
			if (error.message.includes("Invalid") || error.message.includes("credentials")) {
				errorMessage = t`Invalid email/username or password. Please check your credentials and try again.`;
			} else if (error.message.includes("not found") || error.message.includes("does not exist")) {
				errorMessage = t`No account found with these credentials. Please sign up first.`;
			} else if (error.message.includes("password")) {
				errorMessage = t`Incorrect password. Please try again or reset your password.`;
			}
			
			toast.error(errorMessage, { id: toastId });
			form.setError("password", { message: t`Invalid credentials` });
		}
	};

	return (
		<>
			<div className="space-y-4 text-center">
				<div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-lg">
					<svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
						/>
					</svg>
				</div>

				<h1 className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text font-bold text-3xl text-transparent tracking-tight">
					<Trans>Welcome Back</Trans>
				</h1>
				<p className="text-muted-foreground text-sm">
					<Trans>Sign in to continue to CVCraft</Trans>
				</p>

				{!flags.disableSignups && (
					<div className="text-muted-foreground text-sm">
						<Trans>
							Don't have an account?{" "}
							<Button
								asChild
								variant="link"
								className="h-auto gap-1.5 px-1! py-0 font-semibold text-primary hover:underline"
							>
								<Link to="/auth/register">
									Create one now <ArrowRightIcon className="size-3" />
								</Link>
							</Button>
						</Trans>
					</div>
				)}
			</div>

			{!flags.disableEmailAuth && (
				<Form {...form}>
					<form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="identifier"
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
											autoComplete="email"
											placeholder="john.doe@example.com"
											className="h-11 rounded-xl border-2 pl-4 lowercase transition-all focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
											{...field}
										/>
									</FormControl>
									<FormMessage />
									<FormDescription className="text-xs">
										<Trans>You can also use your username to login.</Trans>
									</FormDescription>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center justify-between">
										<FormLabel className="flex items-center gap-2 font-semibold text-sm">
											<div className="flex size-5 items-center justify-center rounded-md bg-primary/10">
												<svg className="size-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

										<Button
											asChild
											tabIndex={-1}
											variant="link"
											className="h-auto p-0 font-semibold text-primary text-xs leading-none hover:underline"
										>
											<Link to="/auth/forgot-password">
												<Trans>Forgot Password?</Trans>
											</Link>
										</Button>
									</div>
									<div className="flex items-center gap-x-2">
										<FormControl>
											<Input
												min={6}
												max={64}
												type={showPassword ? "text" : "password"}
												autoComplete="current-password"
												className="h-11 rounded-xl border-2 pl-4 transition-all focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
												{...field}
											/>
										</FormControl>

										<Button
											type="button"
											size="icon"
											variant="ghost"
											onClick={toggleShowPassword}
											className="size-11 rounded-xl transition-colors hover:bg-secondary/80"
										>
											{showPassword ? <EyeIcon className="size-5" /> : <EyeSlashIcon className="size-5" />}
										</Button>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="h-12 w-full rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
						>
							<Trans>Sign in</Trans>
						</Button>
					</form>
				</Form>
			)}

			<SocialAuth />
		</>
	);
}
