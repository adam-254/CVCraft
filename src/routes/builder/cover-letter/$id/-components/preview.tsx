import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CaretLeftIcon, CaretRightIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import {
	AcademicTemplate,
	ArtisticTemplate,
	ClassicTemplate,
	CorporateTemplate,
	CreativeTemplate,
	ElegantTemplate,
	ExecutiveTemplate,
	MinimalTemplate,
	ModernTemplate,
	ProfessionalTemplate,
	StartupTemplate,
	TechTemplate,
} from "@/components/cover-letter/templates";
import { Button } from "@/components/ui/button";
import { useCoverLetterBuilderStore } from "../-store/cover-letter";

export function CoverLetterPreview() {
	const coverLetter = useCoverLetterBuilderStore((state) => state.coverLetter);
	const selectedTemplate = useCoverLetterBuilderStore((state) => state.selectedTemplate);
	const currentPageIndex = useCoverLetterBuilderStore((state) => state.currentPageIndex);
	const setCurrentPageIndex = useCoverLetterBuilderStore((state) => state.setCurrentPageIndex);
	const addPage = useCoverLetterBuilderStore((state) => state.addPage);
	const deletePage = useCoverLetterBuilderStore((state) => state.deletePage);

	const getTemplateComponent = (template: string) => {
		switch (template) {
			case "professional":
				return ProfessionalTemplate;
			case "modern":
				return ModernTemplate;
			case "elegant":
				return ElegantTemplate;
			case "creative":
				return CreativeTemplate;
			case "minimal":
				return MinimalTemplate;
			case "classic":
				return ClassicTemplate;
			case "executive":
				return ExecutiveTemplate;
			case "tech":
				return TechTemplate;
			case "artistic":
				return ArtisticTemplate;
			case "corporate":
				return CorporateTemplate;
			case "startup":
				return StartupTemplate;
			case "academic":
				return AcademicTemplate;
			default:
				return ProfessionalTemplate;
		}
	};

	const TemplateComponent = getTemplateComponent(selectedTemplate);

	const pages = coverLetter?.pages || [{ id: "1", content: "" }];
	const currentPage = pages[currentPageIndex] || pages[0];
	const totalPages = pages.length;

	if (!coverLetter?.content && !coverLetter?.title && !currentPage?.content) {
		return (
			<div className="flex h-full items-center justify-center p-8">
				<div className="text-center text-gray-400">
					<p className="font-medium text-lg">
						<Trans>Start writing your cover letter</Trans>
					</p>
					<p className="text-sm">
						<Trans>Use the editor on the left to add content</Trans>
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col items-center justify-center gap-4 p-8">
			{/* Page Navigation */}
			<div className="flex items-center gap-4 rounded-lg bg-white px-4 py-2 shadow-md">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
					disabled={currentPageIndex === 0}
				>
					<CaretLeftIcon className="size-4" />
				</Button>

				<span className="font-medium text-sm">
					<Trans>Page {currentPageIndex + 1} of {totalPages}</Trans>
				</span>

				<Button
					variant="ghost"
					size="sm"
					onClick={() => setCurrentPageIndex(Math.min(totalPages - 1, currentPageIndex + 1))}
					disabled={currentPageIndex === totalPages - 1}
				>
					<CaretRightIcon className="size-4" />
				</Button>

				<div className="mx-2 h-6 w-px bg-gray-300" />

				<Button variant="ghost" size="sm" onClick={addPage} title={t`Add new page`}>
					<PlusIcon className="size-4" />
					<span className="ml-1 text-xs">
						<Trans>Add Page</Trans>
					</span>
				</Button>

				{totalPages > 1 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => deletePage(currentPageIndex)}
						title={t`Delete current page`}
						className="text-red-600 hover:text-red-700"
					>
						<TrashIcon className="size-4" />
					</Button>
				)}
			</div>

			{/* Page Preview */}
			<div
				id="cover-letter-preview"
				className="w-full max-w-2xl"
				style={{
					aspectRatio: "8.5 / 11",
					minHeight: "11in",
					fontFamily: "Inter, sans-serif",
					fontSize: "14px",
					lineHeight: "1.5",
				}}
			>
				<TemplateComponent
					title={coverLetter.title || t`Untitled Cover Letter`}
					recipient={coverLetter.recipient || undefined}
					content={currentPage.content || coverLetter.content || ""}
					tags={coverLetter.tags}
					senderName={coverLetter.senderName || undefined}
					senderAddress={coverLetter.senderAddress || undefined}
					senderCity={coverLetter.senderCity || undefined}
					senderPhone={coverLetter.senderPhone || undefined}
					senderEmail={coverLetter.senderEmail || undefined}
					companyName={coverLetter.companyName || undefined}
					companyAddress={coverLetter.companyAddress || undefined}
					companyCity={coverLetter.companyCity || undefined}
					hiringManager={coverLetter.hiringManager || undefined}
					position={coverLetter.position || undefined}
					className="h-full"
				/>
			</div>
		</div>
	);
}
