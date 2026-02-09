import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
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
import { useCoverLetterBuilderStore } from "../-store/cover-letter";

export function CoverLetterPreview() {
	const coverLetter = useCoverLetterBuilderStore((state) => state.coverLetter);
	const selectedTemplate = useCoverLetterBuilderStore((state) => state.selectedTemplate);

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

	if (!coverLetter.content && !coverLetter.title) {
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
		<div className="flex h-full items-center justify-center p-8">
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
					content={coverLetter.content || ""}
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
