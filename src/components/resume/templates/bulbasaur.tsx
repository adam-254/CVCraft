import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Nature-inspired organic styling
	"[&>h6]:relative",
	"[&>h6]:pl-6",
	"[&>h6]:font-semibold",
	"[&>h6]:text-(--page-primary-color)",
	"[&>h6]:before:content-['']",
	"[&>h6]:before:absolute",
	"[&>h6]:before:left-0",
	"[&>h6]:before:top-1/2",
	"[&>h6]:before:-translate-y-1/2",
	"[&>h6]:before:size-3",
	"[&>h6]:before:rounded-full",
	"[&>h6]:before:bg-(--page-primary-color)",

	// Sidebar layout adjustments
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
);

/**
 * Template: Bulbasaur
 */
export function BulbasaurTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-bulbasaur page-content space-y-(--page-gap-y) px-(--page-margin-x) pt-(--page-margin-y) print:p-0">
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
						className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-(--page-gap-y) overflow-x-hidden rounded-lg bg-linear-to-b bg-opacity-5 from-(--page-primary-color) from-0% via-(--page-primary-color) via-20% to-100% to-transparent p-4"
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
		<div className="page-header relative overflow-hidden rounded-lg bg-linear-to-r bg-opacity-10 from-(--page-primary-color) from-0% to-100% to-transparent p-6">
			<div className="flex items-center gap-x-(--page-gap-x)">
				<PagePicture className="rounded-lg" />

				<div className="page-basics flex-1 space-y-2">
					<div>
						<h2 className="basics-name font-bold text-3xl">{basics.name}</h2>
						<p className="basics-headline text-(--page-primary-color) text-lg">{basics.headline}</p>
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
			</div>
		</div>
	);
}
