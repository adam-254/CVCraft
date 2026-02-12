import { t } from "@lingui/core/macro";
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
import { useCoverLetterStore } from "@/stores/cover-letter";

export function CoverLetterPreview() {
	const coverLetter = useCoverLetterStore((state) => state.coverLetter);

	if (!coverLetter) return null;

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

	const TemplateComponent = getTemplateComponent(coverLetter.template || "professional");
	const pages = coverLetter.pages || [{ id: "1", content: coverLetter.content || "" }];

	return (
		<div className="relative flex flex-col gap-0" data-wf-loaded="true">
			{pages.map((page, index) => (
				<div
					key={page.id}
					data-page-index={index}
					className="relative w-full overflow-hidden print:w-full!"
					style={{
						width: "8.5in",
						minHeight: "11in",
						fontFamily: "Inter, sans-serif",
						fontSize: "14px",
						lineHeight: "1.5",
						pageBreakAfter: index < pages.length - 1 ? "always" : "auto",
						pageBreakInside: "avoid",
					}}
				>
					<TemplateComponent
						title={coverLetter.title || t`Untitled Cover Letter`}
						recipient={coverLetter.recipient || undefined}
						content={page.content || coverLetter.content || ""}
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
						className="h-full w-full"
					/>
				</div>
			))}
		</div>
	);
}
