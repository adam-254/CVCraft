import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Structured grid styling
	"[&>h6]:border-l-4",
	"[&>h6]:border-(--page-primary-color)",
	"[&>h6]:pl-4",
	"[&>h6]:font-bold",
	"[&>h6]:uppercase",
	"[&>h6]:text-sm",
	"[&>h6]:tracking-wider",
	"[&>h6]:mb-3",

	// Sidebar adjustments
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
	"group-data-[layout=sidebar]:[&>.section-content]:space-y-3",
);

/**
 * Template: Blastoise
 */
export function BlastoiseTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-blastoise page-content space-y-(--page-gap-y) border-(--page-primary-color) border-4 px-(--page-margin-x) pt-(--page-margin-y) print:border-0 print:p-0">
			{isFirstPage && <Header />}

			<div className="flex gap-x-(--page-gap-x)">
				{!fullWidth && (
					<aside
						data-layout="sidebar"
						className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-(--page-gap-y) overflow-x-hidden border-(--page-primary-color) border-r-2 pr-(--page-gap-x)"
					>
						{sidebar.map((section) => {
							const Component = getSectionComponent(section, { sectionClassName });
							return <Component key={section} id={section} />;
						})}
					</aside>
				)}

				<main data-layout="main" className="group page-main flex-1 space-y-(--page-gap-y)">
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
		<div className="page-header border-(--page-primary-color) border-b-4 pb-(--page-gap-y)">
			<div className="flex items-center gap-x-(--page-gap-x)">
				<PagePicture className="border-(--page-primary-color) border-4" />

				<div className="page-basics flex-1">
					<h2 className="basics-name font-bold text-4xl uppercase tracking-wide">{basics.name}</h2>
					<p className="basics-headline font-semibold text-(--page-primary-color) text-lg">{basics.headline}</p>
				</div>
			</div>

			<div className="basics-items mt-4 grid grid-cols-2 gap-2 text-sm *:flex *:items-center *:gap-x-1.5">
				{basics.email && (
					<div className="basics-item-email">
						<EnvelopeIcon size={14} />
						<PageLink url={`mailto:${basics.email}`} label={basics.email} />
					</div>
				)}

				{basics.phone && (
					<div className="basics-item-phone">
						<PhoneIcon size={14} />
						<PageLink url={`tel:${basics.phone}`} label={basics.phone} />
					</div>
				)}

				{basics.location && (
					<div className="basics-item-location">
						<MapPinIcon size={14} />
						<span>{basics.location}</span>
					</div>
				)}

				{basics.website.url && (
					<div className="basics-item-website">
						<GlobeIcon size={14} />
						<PageLink {...basics.website} />
					</div>
				)}

				{basics.customFields.map((field: { id: string; icon: string; text: string; link?: string }) => (
					<div key={field.id} className="basics-item-custom">
						<PageIcon icon={field.icon} />
						{field.link ? <PageLink url={field.link} label={field.text} /> : <span>{field.text}</span>}
					</div>
				))}
			</div>
		</div>
	);
}
