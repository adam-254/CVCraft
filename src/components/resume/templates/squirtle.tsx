import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Compact, tech-style sections
	"[&>h6]:text-sm",
	"[&>h6]:font-bold",
	"[&>h6]:uppercase",
	"[&>h6]:tracking-wide",
	"[&>h6]:border-l-4",
	"[&>h6]:border-(--page-primary-color)",
	"[&>h6]:pl-3",
	"[&>h6]:mb-3",

	// Sidebar layout adjustments
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
);

/**
 * Template: Squirtle
 */
export function SquirtleTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-squirtle page-content space-y-(--page-gap-y) px-(--page-margin-x) pt-(--page-margin-y) print:p-0">
			{isFirstPage && <Header />}

			<div className="flex gap-x-(--page-gap-x)">
				{!fullWidth && (
					<aside
						data-layout="sidebar"
						className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-(--page-gap-y) overflow-x-hidden bg-gray-50 p-4"
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
		<div className="page-header bg-gray-50 p-4">
			<div className="flex items-start gap-x-(--page-gap-x)">
				<PagePicture className="mt-1" />

				<div className="page-basics flex-1 space-y-2">
					<div>
						<h2 className="basics-name font-bold text-2xl">{basics.name}</h2>
						<p className="basics-headline font-medium text-(--page-primary-color)">{basics.headline}</p>
					</div>

					<div className="basics-items flex flex-wrap gap-2 text-sm *:flex *:items-center *:gap-x-1.5">
						{basics.email && (
							<div className="basics-item-email rounded-full bg-white px-3 py-1">
								<EnvelopeIcon size={14} />
								<PageLink url={`mailto:${basics.email}`} label={basics.email} />
							</div>
						)}

						{basics.phone && (
							<div className="basics-item-phone rounded-full bg-white px-3 py-1">
								<PhoneIcon size={14} />
								<PageLink url={`tel:${basics.phone}`} label={basics.phone} />
							</div>
						)}

						{basics.location && (
							<div className="basics-item-location rounded-full bg-white px-3 py-1">
								<MapPinIcon size={14} />
								<span>{basics.location}</span>
							</div>
						)}

						{basics.website.url && (
							<div className="basics-item-website rounded-full bg-white px-3 py-1">
								<GlobeIcon size={14} />
								<PageLink {...basics.website} />
							</div>
						)}

						{basics.customFields.map((field: { id: string; icon: string; text: string; link?: string }) => (
							<div key={field.id} className="basics-item-custom rounded-full bg-white px-3 py-1">
								<PageIcon icon={field.icon} />
								{field.link ? <PageLink url={field.link} label={field.text} /> : <span>{field.text}</span>}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
