import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Minimalist intelligent design
	"[&>h6]:text-sm",
	"[&>h6]:font-semibold",
	"[&>h6]:uppercase",
	"[&>h6]:tracking-widest",
	"[&>h6]:text-(--page-primary-color)",
	"[&>h6]:mb-4",

	// Sidebar adjustments
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
);

/**
 * Template: Alakazam
 */
export function AlakazamTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-alakazam page-content space-y-8 px-(--page-margin-x) pt-(--page-margin-y) print:p-0">
			{isFirstPage && <Header />}

			<div className="flex gap-x-12">
				{!fullWidth && (
					<aside
						data-layout="sidebar"
						className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-6 overflow-x-hidden"
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
		<div className="page-header space-y-4 text-center">
			<PagePicture className="mx-auto" />

			<div className="page-basics space-y-3">
				<div>
					<h2 className="basics-name font-light text-3xl tracking-wide">{basics.name}</h2>
					<p className="basics-headline text-(--page-primary-color) text-sm uppercase tracking-widest">
						{basics.headline}
					</p>
				</div>

				<div className="basics-items flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm *:flex *:items-center *:gap-x-1.5">
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
		</div>
	);
}
