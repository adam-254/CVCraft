import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { PlusIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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

	const { mutateAsync, isPending } = orpc.coverLetter.create.useMutation();

	const onSubmit = async (formData: FormValues) => {
		try {
			const coverLetter = await mutateAsync({
				title: formData.title,
				content: "",
			});

			toast.success("Cover letter created successfully");
			closeDialog();

			// Navigate to the cover letter editor
			navigate({ to: "/cover-letter/$id", params: { id: coverLetter.id } });
		} catch (error) {
			toast.error("Failed to create cover letter");
			console.error(error);
		}
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
