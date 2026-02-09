import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { FloppyDiskIcon, PaperPlaneIcon } from "@phosphor-icons/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/integrations/orpc/client";

export const Route = createFileRoute("/cover-letter/$id/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { id } = Route.useParams();
	const { data: coverLetter } = useSuspenseQuery(orpc.coverLetter.getById.queryOptions({ input: { id } }));

	const [title, setTitle] = useState(coverLetter.title);
	const [recipient, setRecipient] = useState(coverLetter.recipient || "");
	const [content, setContent] = useState(coverLetter.content);

	const { mutate: updateCoverLetter } = useMutation(orpc.coverLetter.update.mutationOptions());

	// Auto-save with debounce
	const debouncedSave = useDebounceCallback((data: { title: string; recipient: string; content: string }) => {
		updateCoverLetter(
			{
				id,
				title: data.title,
				recipient: data.recipient,
				content: data.content,
			},
			{
				onSuccess: () => {
					// Silent success - auto-save
				},
				onError: (error) => {
					toast.error(t`Failed to save changes: ${error.message}`);
				},
			},
		);
	}, 1000);

	useEffect(() => {
		if (title !== coverLetter.title || recipient !== coverLetter.recipient || content !== coverLetter.content) {
			debouncedSave({ title, recipient, content });
		}
	}, [title, recipient, content, coverLetter, debouncedSave]);

	return (
		<div className="flex h-screen flex-col bg-background">
			{/* Header */}
			<header className="border-b bg-background px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" onClick={() => navigate({ to: "/dashboard/cover-letters" })}>
							← <Trans>Back</Trans>
						</Button>
						<div className="flex items-center gap-2">
							<FloppyDiskIcon className="size-4 text-muted-foreground" />
							<span className="text-muted-foreground text-sm">
								<Trans>Auto-saving...</Trans>
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button 
							variant="default" 
							size="sm" 
							onClick={() => navigate({ to: `/builder/${id}` })}
						>
							<Trans>Open in Builder</Trans>
						</Button>
						<Button variant="outline" size="sm">
							<PaperPlaneIcon className="size-4" />
							<Trans>Export</Trans>
						</Button>
					</div>
				</div>
			</header>

			{/* Editor */}
			<div className="flex-1 overflow-auto bg-background">
				<div className="mx-auto max-w-4xl space-y-6 p-8">
					{/* Title */}
					<div className="space-y-2">
						<Label htmlFor="title">
							<Trans>Title</Trans>
						</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Software Engineer Cover Letter"
							className="font-bold text-2xl"
						/>
					</div>

					{/* Recipient */}
					<div className="space-y-2">
						<Label htmlFor="recipient">
							<Trans>Recipient</Trans>
						</Label>
						<Input
							id="recipient"
							value={recipient}
							onChange={(e) => setRecipient(e.target.value)}
							placeholder="Hiring Manager, Company Name"
						/>
					</div>

					{/* Content */}
					<div className="space-y-2">
						<Label htmlFor="content">
							<Trans>Content</Trans>
						</Label>
						<Textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Write your cover letter here..."
							className="min-h-[500px] font-serif text-base leading-relaxed"
						/>
					</div>

					{/* Character Count */}
					<div className="text-right text-muted-foreground text-sm">
						{content.length} <Trans>characters</Trans>
					</div>
				</div>
			</div>
		</div>
	);
}
