import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCoverLetterBuilderStore } from "../../-store/cover-letter";

export function CoverLetterEditor() {
	const coverLetter = useCoverLetterBuilderStore((state) => state.coverLetter);
	const currentPageIndex = useCoverLetterBuilderStore((state) => state.currentPageIndex);
	const updatePageContent = useCoverLetterBuilderStore((state) => state.updatePageContent);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const pages = coverLetter?.pages || [{ id: "1", content: "" }];
	const currentPage = pages[currentPageIndex] || pages[0];

	const handleContentChange = (value: string) => {
		updatePageContent(currentPageIndex, value);
	};

	const insertFormatting = useCallback(
		(prefix: string, suffix: string = prefix) => {
			if (!textareaRef.current) return;

			const textarea = textareaRef.current;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const selectedText = textarea.value.substring(start, end);

			const newText =
				textarea.value.substring(0, start) + prefix + selectedText + suffix + textarea.value.substring(end);

			handleContentChange(newText);

			// Restore cursor position
			setTimeout(() => {
				if (textareaRef.current) {
					const newCursorPos = selectedText
						? start + prefix.length + selectedText.length + suffix.length
						: start + prefix.length;
					textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
					textareaRef.current.focus();
				}
			}, 0);
		},
		[handleContentChange],
	);

	const formatBold = () => insertFormatting("**");
	const formatItalic = () => insertFormatting("*");
	const formatUnderline = () => insertFormatting("__");

	const insertTemplate = (template: string) => {
		const currentContent = currentPage.content;
		const newContent = currentContent ? `${currentContent}\n\n${template}` : template;
		handleContentChange(newContent);
	};

	const templates = [
		{
			name: t`Opening Paragraph`,
			content: t`Dear [Recipient],\n\nI am writing to express my strong interest in the [Position] role at [Company]. With my background in [Field/Industry], I am excited about the opportunity to contribute to your team.`,
		},
		{
			name: t`Experience Paragraph`,
			content: t`In my previous role as [Previous Position] at [Previous Company], I successfully [Achievement/Responsibility]. This experience has equipped me with [Relevant Skills] that directly align with the requirements of this position.`,
		},
		{
			name: t`Closing Paragraph`,
			content: t`I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to [Company]'s continued success. Thank you for considering my application. I look forward to hearing from you.\n\nSincerely,\n[Your Name]`,
		},
	];

	return (
		<div className="space-y-4">
			{/* Page Indicator */}
			<div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
				<p className="font-medium text-blue-900 text-sm">
					<Trans>Editing Page {currentPageIndex + 1} of {pages.length}</Trans>
				</p>
			</div>

			<div className="flex items-center justify-between">
				<Label htmlFor="content">
					<Trans>Content</Trans>
				</Label>
				<div className="flex gap-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="sm" onClick={formatBold}>
								<strong className="text-xs">B</strong>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<Trans>Bold</Trans>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="sm" onClick={formatItalic}>
								<em className="text-xs">I</em>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<Trans>Italic</Trans>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="sm" onClick={formatUnderline}>
								<u className="text-xs">U</u>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<Trans>Underline</Trans>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>

			<Textarea
				ref={textareaRef}
				id="content"
				value={currentPage.content}
				onChange={(e) => handleContentChange(e.target.value)}
				placeholder={t`Write your cover letter content here...`}
				className="min-h-[400px] resize-none border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
			/>

			<div className="space-y-2">
				<Label>
					<Trans>Quick Templates</Trans>
				</Label>
				<div className="grid gap-2">
					{templates.map((template) => (
						<Button
							key={template.name}
							variant="outline"
							size="sm"
							onClick={() => insertTemplate(template.content)}
							className="justify-start text-left"
						>
							{template.name}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
}
