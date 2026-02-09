import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { TagIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCoverLetterBuilderStore } from "../../-store/cover-letter";

export function CoverLetterMetadata() {
	const coverLetter = useCoverLetterBuilderStore((state) => state.coverLetter);
	const updateCoverLetter = useCoverLetterBuilderStore((state) => state.updateCoverLetter);

	const [newTag, setNewTag] = useState("");

	const handleTitleChange = (value: string) => {
		updateCoverLetter((draft) => {
			draft.title = value;
		});
	};

	const handleRecipientChange = (value: string) => {
		updateCoverLetter((draft) => {
			draft.recipient = value;
		});
	};

	const handleAddTag = () => {
		if (!newTag.trim() || coverLetter.tags.includes(newTag.trim())) return;

		updateCoverLetter((draft) => {
			draft.tags = [...draft.tags, newTag.trim()];
		});
		setNewTag("");
	};

	const handleRemoveTag = (tagToRemove: string) => {
		updateCoverLetter((draft) => {
			draft.tags = draft.tags.filter((tag) => tag !== tagToRemove);
		});
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTag();
		}
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="title">
					<Trans>Title</Trans>
				</Label>
				<Input
					id="title"
					value={coverLetter.title}
					onChange={(e) => handleTitleChange(e.target.value)}
					placeholder={t`Cover Letter Title`}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="recipient">
					<Trans>Recipient</Trans>
				</Label>
				<Input
					id="recipient"
					value={coverLetter.recipient || ""}
					onChange={(e) => handleRecipientChange(e.target.value)}
					placeholder={t`Hiring Manager, John Doe, etc.`}
				/>
			</div>

			<div className="space-y-2">
				<Label>
					<Trans>Tags</Trans>
				</Label>
				<div className="flex flex-wrap gap-1">
					{coverLetter.tags.map((tag) => (
						<Badge key={tag} variant="secondary" className="gap-1">
							<TagIcon className="size-3" />
							{tag}
							<Button
								variant="ghost"
								size="sm"
								className="h-auto p-0 text-xs hover:bg-transparent"
								onClick={() => handleRemoveTag(tag)}
							>
								×
							</Button>
						</Badge>
					))}
				</div>
				<div className="flex gap-2">
					<Input
						value={newTag}
						onChange={(e) => setNewTag(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder={t`Add tag...`}
						className="flex-1"
					/>
					<Button onClick={handleAddTag} disabled={!newTag.trim()}>
						<Trans>Add</Trans>
					</Button>
				</div>
			</div>
		</div>
	);
}