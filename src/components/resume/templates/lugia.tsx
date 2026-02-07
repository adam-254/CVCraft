import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Elegant premium styling with centered headers
	"[&>h6]:text-center",
	"[&>h6]:text-sm",
	"[&>h6]:font-bold",
	"[&>h6]:uppercase",
	"[&>h6]:tracking-[0.2em]",
	"[&>h6]:text-(--page-primary-color)",
	"[&>h6]:mb-4",
	"[&>h6]:pb-3",
	"[&>h6]:relative",

	// Decorative underline
	"[&>h6]:after:content-['']",
	"[&>h6]:after:absolute",
	"[&>h6]:after:bottom-0",
	"[&>h6]:after:left-1/2",
	"[&>h6]:after:-translate-x-1/2",
	"[&>h6]:after:w-12",
	"[&>h6]:after:h-0.5",
	"[&>h6]:after:bg-(--page-primary-color)",

	// Sidebar adjustments
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
);

/**
 * Template: Lugia
 * Elegant centered design with decorative borders and premium spacing
 */
export function LugiaTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-lugia page-content space-y-8 border-(--page-primary-color) border-8 border-double border-opacity-20 px-8 pt-8 print:border-0 print:p-0">
			{isFirstPage && <Header />}

			<div className="flex gap-x-8">
				{!fullWidth && (
					<aside
						data-layout="sidebar"
						className="group page-sidebar w-[28%] shrink-0 space-y-6 overflow-x-hidden rounded-lg border border-(--page-primary-color) border-opacity-20 p-5"
					>
						{sidebar.map((section) => {
							const Component = getSectionComponent(section, { sectionClassName });
							return <Component key={section} id={section} />;
						})}
					</aside>
				)}

				<main data-layout="main" className="group page-main flex-1 space-y-6">
					{main.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</main>
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-header relative border border-(--page-primary-color) border-opacity-20 p-8 text-center">
			{/* Corner decorations */}
			<div className="absolute top-0 left-0 h-8 w-8 border-(--page-primary-color) border-t-2 border-l-2" />
			<div className="absolute top-0 right-0 h-8 w-8 border-(--page-primary-color) border-t-2 border-r-2" />
			<div className="absolute bottom-0 left-0 h-8 w-8 border-(--page-primary-color) border-b-2 border-l-2" />
			<div className="absolute right-0 bottom-0 h-8 w-8 border-(--page-primary-color) border-r-2 border-b-2" />

			<div className="relative space-y-6">
				{/* Centered profile with ornamental circles */}
				<div className="relative mx-auto w-fit">
					<div className="absolute -inset-6 rounded-full border border-(--page-primary-color) opacity-20" />
					<div className="absolute -inset-3 rounded-full border border-(--page-primary-color) opacity-30" />
					<div className="absolute top-1/2 -left-8 size-2 -translate-y-1/2 rounded-full bg-(--page-primary-color)" />
					<div className="absolute top-1/2 -right-8 size-2 -translate-y-1/2 rounded-full bg-(--page-primary-color)" />
					<PagePicture className="relative rounded-full border-(--page-primary-color) border-4 border-opacity-30 shadow-lg" />
				</div>

				<div className="page-basics space-y-4">
					<div className="space-y-2">
						<h2 className="basics-name font-light text-4xl tracking-wider">{basics.name}</h2>
						<div className="mx-auto flex w-fit items-center gap-x-3">
							<div className="h-px w-8 bg-(--page-primary-color)" />
							<p className="basics-headline text-(--page-primary-color) text-xs uppercase tracking-[0.3em]">
								{basics.headline}
							</p>
							<div className="h-px w-8 bg-(--page-primary-color)" />
						</div>
					</div>

					<div className="basics-items mx-auto flex max-w-2xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm *:flex *:items-center *:gap-x-2">
						{basics.email && (
							<div className="basics-item-email">
								<div className="flex size-7 items-center justify-center rounded-full border border-(--page-primary-color) border-opacity-30">
									<EnvelopeIcon size={14} className="text-(--page-primary-color)" />
								</div>
								<PageLink url={`mailto:${basics.email}`} label={basics.email} />
							</div>
						)}

						{basics.phone && (
							<div className="basics-item-phone">
								<div className="flex size-7 items-center justify-center rounded-full border border-(--page-primary-color) border-opacity-30">
									<PhoneIcon size={14} className="text-(--page-primary-color)" />
								</div>
								<PageLink url={`tel:${basics.phone}`} label={basics.phone} />
							</div>
						)}

						{basics.location && (
							<div className="basics-item-location">
								<div className="flex size-7 items-center justify-center rounded-full border border-(--page-primary-color) border-opacity-30">
									<MapPinIcon size={14} className="text-(--page-primary-color)" />
								</div>
								<span>{basics.location}</span>
							</div>
						)}

						{basics.website.url && (
							<div className="basics-item-website">
								<div className="flex size-7 items-center justify-center rounded-full border border-(--page-primary-color) border-opacity-30">
									<GlobeIcon size={14} className="text-(--page-primary-color)" />
								</div>
								<PageLink {...basics.website} />
							</div>
						)}

						{basics.customFields.map((field: { id: string; icon: string; text: string; link?: string }) => (
							<div key={field.id} className="basics-item-custom">
								<div className="flex size-7 items-center justify-center rounded-full border border-(--page-primary-color) border-opacity-30">
									<PageIcon icon={field.icon} />
								</div>
								{field.link ? <PageLink url={field.link} label={field.text} /> : <span>{field.text}</span>}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
