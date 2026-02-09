import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { PlusIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { DialogProps } from "@/dialogs/store";
import { useDialogStore } from "@/dialogs/store";
import { useFormBlocker } from "@/hooks/use-form-blocker";
import { orpc } from "@/integrations/orpc/client";

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCoverLetterDialog({ data }: DialogProps<"cover-letter.create">) {
	const navigate = useNavigate();
	const closeDialog = useDialogStore((state) => state.closeDialog);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: data?.title || "",
		},
	});

	const { mutate: createCoverLetter, isPending } = useMutation(orpc.coverLetter.create.mutationOptions());

	const onSubmit = (formData: FormValues) => {
		const toastId = toast.loading(t`Creating your cover letter...`);

		createCoverLetter(
			{
				title: formData.title,
				content: "",
			},
			{
				onSuccess: (coverLetter) => {
					toast.success(t`Your cover letter has been created successfully.`, { id: toastId });
					closeDialog();

					// Navigate to the cover letter builder
					navigate({ to: "/builder/cover-letter/$id", params: { id: coverLetter.id } });
				},
				onError: (error) => {
					toast.error(t`Failed to create cover letter`, { id: toastId });
					console.error(error);
				},
			},
		);
	};

	const { blockEvents, requestClose } = useFormBlocker(form);

	return (
		<DialogContent {...blockEvents}>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PlusIcon />
					<Trans>Create a new cover letter</Trans>
				</DialogTitle>
				<DialogDescription>
					<Trans>Give your cover letter a title to get started</Trans>
				</DialogDescription>
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<Trans>Title</Trans>
								</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Software Engineer Cover Letter" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<DialogFooter>
						<Button variant="ghost" onClick={requestClose} disabled={isPending}>
							<Trans>Cancel</Trans>
						</Button>

						<Button type="submit" disabled={isPending}>
							<Trans>Create</Trans>
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}
