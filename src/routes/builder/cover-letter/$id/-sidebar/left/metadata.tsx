import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { BuildingsIcon, TagIcon, UserIcon } from "@phosphor-icons/react";
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
		<div className="space-y-6">
			{/* Basic Information */}
			<div className="space-y-4">
				<h3 className="font-semibold text-gray-900 text-sm">
					<Trans>Basic Information</Trans>
				</h3>
				<div className="space-y-2">
					<Label htmlFor="title">
						<Trans>Title</Trans>
					</Label>
					<Input
						id="title"
						value={coverLetter.title}
						onChange={(e) => handleTitleChange(e.target.value)}
						placeholder={t`Cover Letter Title`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
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
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
			</div>

			{/* Sender Information */}
			<div className="space-y-4 border-t pt-4">
				<div className="flex items-center gap-2">
					<UserIcon className="size-4 text-blue-600" />
					<h3 className="font-semibold text-gray-900 text-sm">
						<Trans>Your Information</Trans>
					</h3>
				</div>
				<div className="space-y-2">
					<Label htmlFor="senderName">
						<Trans>Full Name</Trans>
					</Label>
					<Input
						id="senderName"
						value={coverLetter.senderName || ""}
						onChange={(e) =>
							updateCoverLetter((draft) => {
								draft.senderName = e.target.value;
							})
						}
						placeholder={t`Your Full Name`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="senderEmail">
						<Trans>Email</Trans>
					</Label>
					<Input
						id="senderEmail"
						type="email"
						value={coverLetter.senderEmail || ""}
						onChange={(e) =>
							updateCoverLetter((draft) => {
								draft.senderEmail = e.target.value;
							})
						}
						placeholder={t`your.email@example.com`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="senderPhone">
						<Trans>Phone</Trans>
					</Label>
					<Input
						id="senderPhone"
						type="tel"
						value={coverLetter.senderPhone || ""}
						onChange={(e) =>
							updateCoverLetter((draft) => {
								draft.senderPhone = e.target.value;
							})
						}
						placeholder={t`(555) 123-4567`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="senderAddress">
						<Trans>Address</Trans>
					</Label>
					<Input
						id="senderAddress"
						value={coverLetter.senderAddress || ""}
						onChange={(e) =>
							updateCoverLetter((draft) => {
								draft.senderAddress = e.target.value;
							})
						}
						placeholder={t`123 Main Street`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="senderCity">
						<Trans>City, State ZIP</Trans>
					</Label>
					<Input
						id="senderCity"
						value={coverLetter.senderCity || ""}
						onChange={(e) =>
							updateCoverLetter((draft) => {
								draft.senderCity = e.target.value;
							})
						}
						placeholder={t`New York, NY 10001`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
			</div>

			{/* Company Information */}
			<div className="space-y-4 border-t pt-4">
				<div className="flex items-center gap-2">
					<BuildingsIcon className="size-4 text-blue-600" />
					<h3 className="font-semibold text-gray-900 text-sm">
						<Trans>Company Information</Trans>
					</h3>
				</div>
				<div className="space-y-2">
					<Label htmlFor="companyName">
						<Trans>Company Name</Trans>
					</Label>
					<Input
						id="companyName"
						value={coverLetter.companyName || ""}
						onChange={(e) =>
							updateCoverLetter((draft) => {
								draft.companyName = e.target.value;
							})
						}
						placeholder={t`Target Company Inc.`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="position">
						<Trans>Position</Trans>
					</Label>
					<Input
						id="position"
						value={coverLetter.position || ""}
						onChange={(e) =>
							updateCoverLetter((draft) => {
								draft.position = e.target.value;
							})
						}
						placeholder={t`Software Engineer`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="hiringManager">
						<Trans>Hiring Manager</Trans>
					</Label>
					<Input
						id="hiringManager"
						value={coverLetter.hiringManager || ""}
						onChange={(e) =>
							updateCoverLetter((draft) => {
								draft.hiringManager = e.target.value;
							})
						}
						placeholder={t`John Smith`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="companyAddress">
						<Trans>Company Address</Trans>
					</Label>
					<Input
						id="companyAddress"
						value={coverLetter.companyAddress || ""}
						onChange={(e) =>
							updateCoverLetter((draft) => {
								draft.companyAddress = e.target.value;
							})
						}
						placeholder={t`456 Corporate Blvd`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="companyCity">
						<Trans>Company City, State ZIP</Trans>
					</Label>
					<Input
						id="companyCity"
						value={coverLetter.companyCity || ""}
						onChange={(e) =>
							updateCoverLetter((draft) => {
								draft.companyCity = e.target.value;
							})
						}
						placeholder={t`San Francisco, CA 94102`}
						className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
			</div>

			{/* Tags */}
			<div className="space-y-4 border-t pt-4">
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
						className="flex-1 border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
					/>
					<Button onClick={handleAddTag} disabled={!newTag.trim()}>
						<Trans>Add</Trans>
					</Button>
				</div>
			</div>
		</div>
	);
}
