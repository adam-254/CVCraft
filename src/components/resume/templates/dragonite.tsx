import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Asymmetric creative styling
	"[&>h6]:font-bold",
	"[&>h6]:text-(--page-primary-color)",
	"[&>h6]:mb-3",
	"[&>h6]:relative",
	"[&>h6]:pl-4",

	// Main sections with decorative element
	"group-data-[layout=main]:[&>h6]:before:content-['']",
	"group-data-[layout=main]:[&>h6]:before:absolute",
	"group-data-[layout=main]:[&>h6]:before:left-0",
	"group-data-[layout=main]:[&>h6]:before:top-0",
	"group-data-[layout=main]:[&>h6]:before:bottom-0",
	"group-data-[layout=main]:[&>h6]:before:w-1",
	"group-data-[layout=main]:[&>h6]:before:bg-(--page-primary-color)",

	// Sidebar adjustments
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
	"group-data-[layout=sidebar]:[&>h6]:pl-0",
	"group-data-[layout=sidebar]:[&>h6]:before:hidden",
);

/**
 * Template: Dragonite
 */
export function DragoniteTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-dragonite page-content space-y-(--page-gap-y) px-(--page-margin-x) pt-(--page-margin-y) print:p-0">
			{isFirstPage && <Header />}

			<div className="flex gap-x-(--page-gap-x)">
				<main data-layout="main" className="group page-main flex-1 space-y-(--page-gap-y)">
					{main.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</main>

				{!fullWidth && (
					<aside
						data-layout="sidebar"
						className="group page-sidebar w-[35%] shrink-0 space-y-(--page-gap-y) overflow-x-hidden"
					>
						{sidebar.map((section) => {
							const Component = getSectionComponent(section, { sectionClassName });
							return <Component key={section} id={section} />;
						})}
					</aside>
				)}
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-header relative">
			<div className="absolute top-0 right-0 h-full w-[35%] bg-(--page-primary-color) opacity-5" />

			<div className="relative flex items-start gap-x-(--page-gap-x) pb-(--page-gap-y)">
				<div className="page-basics flex-1 space-y-3">
					<div>
						<h2 className="basics-name font-bold text-4xl leading-tight">{basics.name}</h2>
						<p className="basics-headline text-(--page-primary-color) text-xl">{basics.headline}</p>
					</div>

					<div className="basics-items flex flex-wrap gap-x-3 gap-y-1 *:flex *:items-center *:gap-x-1.5">
						{basics.email && (
							<div className="basics-item-email">
								<EnvelopeIcon />
								<PageLink url={`mailto:${basics.email}`} label={basics.email} />
							</div>
						)}

						{basics.phone && (
							<div className="basics-item-phone">
								<PhoneIcon />
								<PageLink url={`tel:${basics.phone}`} label={basics.phone} />
							</div>
						)}

						{basics.location && (
							<div className="basics-item-location">
								<MapPinIcon />
								<span>{basics.location}</span>
							</div>
						)}

						{basics.website.url && (
							<div className="basics-item-website">
								<GlobeIcon />
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

				<PagePicture className="relative z-10" />
			</div>
		</div>
	);
}
