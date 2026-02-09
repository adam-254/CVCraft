import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { DownloadSimpleIcon, FileIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useFormBlocker } from "@/hooks/use-form-blocker";
import { useAIStore } from "@/integrations/ai/store";
import { JSONResumeImporter } from "@/integrations/import/json-resume";
import { ReactiveResumeJSONImporter } from "@/integrations/import/reactive-resume-json";
import { ReactiveResumeV4JSONImporter } from "@/integrations/import/reactive-resume-v4-json";
import { client, orpc } from "@/integrations/orpc/client";
import type { ResumeData } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { type DialogProps, useDialogStore } from "../store";

const formSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("") }),
	z.object({
		type: z.literal("pdf"),
		file: z.instanceof(File).refine((file) => file.type === "application/pdf", { message: "File must be a PDF" }),
	}),
	z.object({
		type: z.literal("docx"),
		file: z
			.instanceof(File)
			.refine(
				(file) =>
					file.type === "application/msword" ||
					file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				{ message: "File must be a Microsoft Word document" },
			),
	}),
	z.object({
		type: z.literal("reactive-resume-json"),
		file: z
			.instanceof(File)
			.refine((file) => file.type === "application/json", { message: "File must be a JSON file" }),
	}),
	z.object({
		type: z.literal("reactive-resume-v4-json"),
		file: z
			.instanceof(File)
			.refine((file) => file.type === "application/json", { message: "File must be a JSON file" }),
	}),
	z.object({
		type: z.literal("json-resume-json"),
		file: z
			.instanceof(File)
			.refine((file) => file.type === "application/json", { message: "File must be a JSON file" }),
	}),
]);

type FormValues = z.infer<typeof formSchema>;

export function ImportResumeDialog(_: DialogProps<"resume.import">) {
	const { enabled: isAIEnabled, provider, model, apiKey, baseURL } = useAIStore();
	const closeDialog = useDialogStore((state) => state.closeDialog);

	const prevTypeRef = useRef<string>("");
	const inputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { mutateAsync: importResume } = useMutation(orpc.resume.import.mutationOptions());

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: "",
		},
	});

	const type = useWatch({ control: form.control, name: "type" });

	useEffect(() => {
		if (prevTypeRef.current === type) return;
		prevTypeRef.current = type;
		form.resetField("file");
	}, [form.resetField, type]);

	const onSelectFile = () => {
		if (!inputRef.current) return;
		inputRef.current.click();
	};

	const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		form.setValue("file", file, { shouldDirty: true });
	};

	const { blockEvents } = useFormBlocker(form);

	const onSubmit = async (values: FormValues) => {
		if (values.type === "") return;

		setIsLoading(true);

		const toastId = toast.loading(t`Importing your resume...`, {
			description: t`This may take a few minutes, depending on the response of the AI provider. Please do not close the window or refresh the page.`,
		});

		try {
			let data: ResumeData | undefined;

			if (values.type === "json-resume-json") {
				const json = await values.file.text();
				const importer = new JSONResumeImporter();
				data = importer.parse(json);
			}

			if (values.type === "reactive-resume-json") {
				const json = await values.file.text();
				const importer = new ReactiveResumeJSONImporter();
				data = importer.parse(json);
			}

			if (values.type === "reactive-resume-v4-json") {
				const json = await values.file.text();
				const importer = new ReactiveResumeV4JSONImporter();
				data = importer.parse(json);
			}

			if (values.type === "pdf") {
				if (!isAIEnabled)
					throw new Error(t`This feature requires AI Integration to be enabled. Please enable it in the settings.`);

				const arrayBuffer = await values.file.arrayBuffer();
				const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

				data = await client.ai.parsePdf({
					provider,
					model,
					apiKey,
					baseURL,
					file: { name: values.file.name, data: base64 },
				});
			}

			if (values.type === "docx") {
				if (!isAIEnabled)
					throw new Error(t`This feature requires AI Integration to be enabled. Please enable it in the settings.`);

				const arrayBuffer = await values.file.arrayBuffer();
				const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
				const mediaType =
					values.file.type === "application/msword"
						? ("application/msword" as const)
						: ("application/vnd.openxmlformats-officedocument.wordprocessingml.document" as const);

				data = await client.ai.parseDocx({
					provider,
					model,
					apiKey,
					baseURL,
					mediaType,
					file: { name: values.file.name, data: base64 },
				});
			}

			if (!data) throw new Error("No data was returned from the AI provider.");

			await importResume({ data });
			toast.success(t`Your resume has been imported successfully.`, { id: toastId, description: null });
			closeDialog();
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message, { id: toastId, description: null });
			} else {
				toast.error(t`An unknown error occurred while importing your resume.`, { id: toastId, description: null });
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DialogContent {...blockEvents} className="overflow-hidden sm:max-w-2xl">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-20 -left-20 size-64 animate-pulse rounded-full bg-gradient-to-br from-blue-500/30 to-transparent blur-3xl" />
				<div className="absolute top-1/2 -right-20 size-64 animate-pulse rounded-full bg-gradient-to-br from-purple-500/30 to-transparent blur-3xl delay-1000" />
				<div className="absolute -bottom-20 left-1/2 size-64 animate-pulse rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-3xl delay-500" />

				{/* Mesh Gradient Overlay */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
			</div>

			<DialogHeader className="relative space-y-4">
				<div className="flex items-center gap-3">
					<div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/40 via-blue-500/30 to-blue-500/20 shadow-2xl shadow-blue-500/30">
						{/* Shine effect */}
						<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 transition-opacity hover:opacity-100" />
						<DownloadSimpleIcon size={28} weight="duotone" className="relative z-10 text-blue-600 dark:text-blue-400" />
						{/* Glow ring */}
						<div className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur-lg" />
					</div>

					<DialogTitle className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text font-bold text-2xl text-transparent">
						<Trans>Import an existing resume</Trans>
					</DialogTitle>
				</div>

				<DialogDescription className="text-base">
					<Trans>
						Continue where you left off by importing an existing resume you created using CVCraft or any another
						resume builder. Supported formats include PDF, Microsoft Word, as well as JSON files from CVCraft.
					</Trans>
				</DialogDescription>
			</DialogHeader>

			{/* Form Container */}
			<div className="relative">
				{/* Decorative corner accents */}
				<div className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl" />
				<div className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-2xl" />

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="relative space-y-6 rounded-2xl bg-gradient-to-br from-card/80 via-card/50 to-card/30 p-6 shadow-2xl ring-1 ring-border/50 backdrop-blur-sm"
					>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-x-2 font-semibold text-sm">
										{/* Icon Badge */}
										<div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/30 to-blue-500/10 shadow-lg">
											<DownloadSimpleIcon size={14} weight="bold" className="text-blue-600 dark:text-blue-400" />
										</div>
										<Trans>Type</Trans>
									</FormLabel>
									<FormControl>
										<Combobox
											clearable={false}
											value={field.value}
											onValueChange={field.onChange}
											options={[
												{ value: "reactive-resume-json", label: "CVCraft (JSON)" },
												{ value: "reactive-resume-v4-json", label: "CVCraft v4 (JSON)" },
												{ value: "json-resume-json", label: "JSON Resume" },
												{
													value: "pdf",
													label: (
														<div className="flex items-center gap-x-2">
															PDF <Badge className="bg-gradient-to-r from-primary to-primary/80">{t`AI`}</Badge>
														</div>
													),
												},
												{
													value: "docx",
													label: (
														<div className="flex items-center gap-x-2">
															Microsoft Word{" "}
															<Badge className="bg-gradient-to-r from-primary to-primary/80">{t`AI`}</Badge>
														</div>
													),
												},
											]}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							key={type}
							control={form.control}
							name="file"
							render={({ field }) => (
								<FormItem className={cn(!type && "hidden")}>
									<FormLabel className="flex items-center gap-x-2 font-semibold text-sm">
										{/* Icon Badge */}
										<div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/30 to-purple-500/10 shadow-lg">
											<UploadSimpleIcon size={14} weight="bold" className="text-purple-600 dark:text-purple-400" />
										</div>
										<Trans>File</Trans>
									</FormLabel>
									<FormControl>
										<div>
											<Input type="file" className="hidden" ref={inputRef} onChange={onUploadFile} />

											<Button
												type="button"
												variant="outline"
												className="group relative h-auto w-full flex-col gap-y-3 overflow-hidden border-2 border-dashed bg-gradient-to-br from-muted/50 to-muted/20 py-12 font-normal shadow-lg transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-primary/20"
												onClick={onSelectFile}
											>
												{/* Background Gradient on Hover */}
												<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

												{field.value ? (
													<>
														<div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/30 to-green-500/10 shadow-lg ring-1 ring-green-500/30">
															<FileIcon weight="duotone" size={32} className="text-green-600 dark:text-green-400" />
														</div>
														<p className="relative font-medium text-sm">{field.value.name}</p>
													</>
												) : (
													<>
														<div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 shadow-lg ring-1 ring-purple-500/30 transition-transform group-hover:scale-110">
															<UploadSimpleIcon
																weight="duotone"
																size={32}
																className="text-purple-600 dark:text-purple-400"
															/>
														</div>
														<p className="relative font-medium text-sm">
															<Trans>Click here to select a file to import</Trans>
														</p>
													</>
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="submit"
								disabled={!type || isLoading}
								className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-500/25 shadow-lg transition-all hover:scale-105 hover:shadow-blue-500/30 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-blue-500/20"
							>
								{/* Shine Animation */}
								<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

								{isLoading ? <Spinner /> : null}
								{isLoading ? t`Importing...` : t`Import`}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</div>
		</DialogContent>
	);
}
