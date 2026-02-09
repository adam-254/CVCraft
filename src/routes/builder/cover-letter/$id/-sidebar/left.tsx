import { Trans } from "@lingui/react/macro";
import { PencilIcon, UserIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { CoverLetterEditor } from "./left/editor";
import { CoverLetterMetadata } from "./left/metadata";

export function BuilderSidebarLeft() {
	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="flex-shrink-0 border-b p-4">
				<h2 className="font-semibold">
					<Trans>Cover Letter Editor</Trans>
				</h2>
				<p className="text-muted-foreground text-sm">
					<Trans>Edit your cover letter content and metadata</Trans>
				</p>
			</div>

			<div className="flex-1 overflow-y-auto">
				<div className="space-y-6 p-4">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<UserIcon className="size-4" />
							<h3 className="font-medium">
								<Trans>Metadata</Trans>
							</h3>
						</div>
						<CoverLetterMetadata />
					</div>

					<Separator />

					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<PencilIcon className="size-4" />
							<h3 className="font-medium">
								<Trans>Content</Trans>
							</h3>
						</div>
						<CoverLetterEditor />
					</div>
				</div>
			</div>
		</div>
	);
}
