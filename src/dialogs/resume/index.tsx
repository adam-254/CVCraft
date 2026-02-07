import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CaretDownIcon, MagicWandIcon, PencilSimpleLineIcon, PlusIcon, TestTubeIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { ChipInput } from "@/components/input/chip-input";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { useFormBlocker } from "@/hooks/use-form-blocker";
import { authClient } from "@/integrations/auth/client";
import { orpc, type RouterInput } from "@/integrations/orpc/client";
import { generateId, generateRandomName, slugify } from "@/utils/string";
import { type DialogProps, useDialogStore } from "../store";

const formSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(64),
	slug: z.string().min(1).max(64).transform(slugify),
	tags: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateResumeDialog(_: DialogProps<"resume.create">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);

	const { mutate: createResume, isPending } = useMutation(orpc.resume.create.mutationOptions());

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			name: "",
			slug: "",
			tags: [],
		},
	});

	const name = useWatch({ control: form.control, name: "name" });

	useEffect(() => {
		form.setValue("slug", slugify(name), { shouldDirty: true });
	}, [form, name]);

	const { blockEvents } = useFormBlocker(form);

	const onSubmit = (data: FormValues) => {
		const toastId = toast.loading(t`Creating your resume...`);

		createResume(data, {
			onSuccess: () => {
				toast.success(t`Your resume has been created successfully.`, { id: toastId });
				closeDialog();
			},
			onError: (error) => {
				if (error.message === "RESUME_SLUG_ALREADY_EXISTS") {
					toast.error(t`A resume with this slug already exists.`, { id: toastId });
					return;
				}

				toast.error(error.message, { id: toastId });
			},
		});
	};

	const onCreateSampleResume = () => {
		const values = form.getValues();
		const randomName = generateRandomName();

		const data = {
			name: values.name || randomName,
			slug: values.slug || slugify(randomName),
			tags: values.tags,
			withSampleData: true,
		} satisfies RouterInput["resume"]["create"];

		const toastId = toast.loading(t`Creating your resume...`);

		createResume(data, {
			onSuccess: () => {
				toast.success(t`Your resume has been created successfully.`, { id: toastId });
				closeDialog();
			},
			onError: (error) => {
				toast.error(error.message, { id: toastId });
			},
		});
	};

	return (
		<DialogContent {...blockEvents} className="overflow-hidden sm:max-w-2xl">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-20 -left-20 size-64 animate-pulse rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-3xl" />
				<div className="absolute top-1/2 -right-20 size-64 animate-pulse rounded-full bg-gradient-to-br from-blue-500/30 to-transparent blur-3xl delay-1000" />
				<div className="absolute -bottom-20 left-1/2 size-64 animate-pulse rounded-full bg-gradient-to-br from-purple-500/30 to-transparent blur-3xl delay-500" />

				{/* Mesh Gradient Overlay */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
			</div>

			<DialogHeader className="relative space-y-4">
				<div className="flex items-center gap-3">
					<div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/40 via-primary/30 to-primary/20 shadow-2xl shadow-primary/30">
						{/* Shine effect */}
						<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/30 to-white/0" />
						<PlusIcon className="relative size-7 text-primary" weight="bold" />
						{/* Glow ring */}
						<div className="absolute inset-0 rounded-2xl ring-2 ring-primary/30" />
					</div>
					<div className="flex-1">
						<DialogTitle className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-2xl">
							<Trans>Create a new resume</Trans>
						</DialogTitle>
						<DialogDescription className="mt-1.5 text-base">
							<Trans>Start building your resume by giving it a name</Trans>
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-6">
					<div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background via-muted/10 to-background p-6 shadow-xl">
						{/* Decorative corner accents */}
						<div className="pointer-events-none absolute top-0 right-0 size-32 bg-gradient-to-br from-primary/10 to-transparent blur-2xl transition-all group-hover:scale-150" />
						<div className="pointer-events-none absolute bottom-0 left-0 size-32 bg-gradient-to-tr from-blue-500/10 to-transparent blur-2xl transition-all group-hover:scale-150" />

						<div className="relative">
							<ResumeForm />
						</div>
					</div>

					<DialogFooter className="relative gap-3 sm:gap-3">
						<ButtonGroup
							aria-label="Create Resume with Options"
							className="w-full gap-x-px sm:w-auto rtl:flex-row-reverse"
						>
							<Button
								type="submit"
								disabled={isPending}
								className="group relative flex-1 overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/90 shadow-primary/30 shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 sm:flex-none"
							>
								{/* Shine effect on hover */}
								<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
								<span className="relative">
									<Trans>Create</Trans>
								</span>
							</Button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										size="icon"
										disabled={isPending}
										className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/90 shadow-primary/30 shadow-xl transition-all hover:scale-105"
									>
										<CaretDownIcon />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									align="end"
									className="w-fit overflow-hidden border-border/50 bg-gradient-to-br from-background via-muted/10 to-background shadow-2xl"
								>
									{/* Background decoration */}
									<div className="pointer-events-none absolute top-0 right-0 size-24 bg-gradient-to-br from-blue-500/10 to-transparent blur-xl" />

									<DropdownMenuItem
										onSelect={onCreateSampleResume}
										className="relative gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-transparent"
									>
										<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 via-blue-500/20 to-blue-500/10 shadow-lg">
											<TestTubeIcon className="size-5 text-blue-500" weight="bold" />
										</div>
										<div className="flex-1">
											<div className="font-semibold">
												<Trans>Create a Sample Resume</Trans>
											</div>
											<div className="text-muted-foreground text-xs">
												<Trans>Pre-filled with example data</Trans>
											</div>
										</div>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</ButtonGroup>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}

export function UpdateResumeDialog({ data }: DialogProps<"resume.update">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);

	const { mutate: updateResume, isPending } = useMutation(orpc.resume.update.mutationOptions());

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			name: data.name,
			slug: data.slug,
			tags: data.tags,
		},
	});

	const name = useWatch({ control: form.control, name: "name" });

	useEffect(() => {
		if (!name) return;
		form.setValue("slug", slugify(name), { shouldDirty: true });
	}, [form, name]);

	const { blockEvents } = useFormBlocker(form);

	const onSubmit = (data: FormValues) => {
		const toastId = toast.loading(t`Updating your resume...`);

		updateResume(data, {
			onSuccess: () => {
				toast.success(t`Your resume has been updated successfully.`, { id: toastId });
				closeDialog();
			},
			onError: (error) => {
				if (error.message === "RESUME_SLUG_ALREADY_EXISTS") {
					toast.error(t`A resume with this slug already exists.`, { id: toastId });
					return;
				}

				toast.error(error.message, { id: toastId });
			},
		});
	};

	return (
		<DialogContent {...blockEvents}>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PencilSimpleLineIcon />
					<Trans>Update Resume</Trans>
				</DialogTitle>
				<DialogDescription>
					<Trans>Changed your mind? Rename your resume to something more descriptive.</Trans>
				</DialogDescription>
			</DialogHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<ResumeForm />

					<DialogFooter>
						<Button type="submit" disabled={isPending}>
							<Trans>Save Changes</Trans>
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}

export function DuplicateResumeDialog({ data }: DialogProps<"resume.duplicate">) {
	const navigate = useNavigate();
	const closeDialog = useDialogStore((state) => state.closeDialog);

	const { mutate: duplicateResume, isPending } = useMutation(orpc.resume.duplicate.mutationOptions());

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			name: `${data.name} (Copy)`,
			slug: `${data.slug}-copy`,
			tags: data.tags,
		},
	});

	const name = useWatch({ control: form.control, name: "name" });

	useEffect(() => {
		if (!name) return;
		form.setValue("slug", slugify(name), { shouldDirty: true });
	}, [form, name]);

	const { blockEvents } = useFormBlocker(form);

	const onSubmit = (values: FormValues) => {
		const toastId = toast.loading(t`Duplicating your resume...`);

		duplicateResume(values, {
			onSuccess: async (id) => {
				toast.success(t`Your resume has been duplicated successfully.`, { id: toastId });
				closeDialog();

				if (data.shouldRedirect) {
					navigate({ to: `/builder/$resumeId`, params: { resumeId: id } });
				}
			},
			onError: (error) => {
				toast.error(error.message, { id: toastId });
			},
		});
	};

	return (
		<DialogContent {...blockEvents}>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PencilSimpleLineIcon />
					<Trans>Duplicate Resume</Trans>
				</DialogTitle>
				<DialogDescription>
					<Trans>Duplicate your resume to create a new one, just like the original.</Trans>
				</DialogDescription>
			</DialogHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<ResumeForm />

					<DialogFooter>
						<Button type="submit" disabled={isPending}>
							<Trans>Duplicate</Trans>
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}

function ResumeForm() {
	const form = useFormContext<FormValues>();
	const { data: session } = authClient.useSession();

	const slugPrefix = useMemo(() => {
		return `${window.location.origin}/${session?.user.username ?? ""}/`;
	}, [session]);

	const onGenerateName = () => {
		form.setValue("name", generateRandomName(), { shouldDirty: true });
	};

	return (
		<div className="space-y-6">
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="flex items-center gap-2 font-semibold text-sm">
							<div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-primary/10">
								<PencilSimpleLineIcon className="size-3.5 text-primary" weight="bold" />
							</div>
							<Trans>Name</Trans>
						</FormLabel>
						<div className="flex items-center gap-x-2">
							<FormControl>
								<Input
									min={1}
									max={64}
									className="h-11 border-border/50 bg-background/50 transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
									placeholder="e.g., Software Engineer Resume"
									{...field}
								/>
							</FormControl>

							<Button
								size="icon"
								variant="outline"
								title={t`Generate a random name`}
								onClick={onGenerateName}
								className="size-11 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent transition-all hover:scale-105 hover:border-primary/50 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20"
							>
								<MagicWandIcon weight="bold" />
							</Button>
						</div>
						<FormMessage />
						<FormDescription className="text-xs">
							<Trans>Tip: You can name the resume referring to the position you are applying for</Trans>
						</FormDescription>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="slug"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="flex items-center gap-2 font-semibold text-sm">
							<div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-blue-500/10">
								<span className="font-bold text-blue-500 text-xs">#</span>
							</div>
							<Trans>Slug</Trans>
						</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupAddon align="inline-start" className="hidden border-border/50 bg-muted/50 sm:flex">
									<InputGroupText className="text-muted-foreground text-xs">{slugPrefix}</InputGroupText>
								</InputGroupAddon>
								<InputGroupInput
									min={1}
									max={64}
									className="h-11 border-border/50 bg-background/50 ps-0! transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
									{...field}
								/>
							</InputGroup>
						</FormControl>
						<FormMessage />
						<FormDescription className="text-xs">
							<Trans>This is a URL-friendly name for your resume</Trans>
						</FormDescription>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="tags"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="flex items-center gap-2 font-semibold text-sm">
							<div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-purple-500/10">
								<span className="font-bold text-purple-500 text-xs">🏷️</span>
							</div>
							<Trans>Tags</Trans>
						</FormLabel>
						<FormControl>
							<ChipInput
								{...field}
								className="min-h-11 border-border/50 bg-background/50 transition-all focus-within:border-purple-500/50 focus-within:ring-4 focus-within:ring-purple-500/10"
							/>
						</FormControl>
						<FormMessage />
						<FormDescription className="text-xs">
							<Trans>Tags can be used to categorize your resume by keywords</Trans>
						</FormDescription>
					</FormItem>
				)}
			/>
		</div>
	);
}
