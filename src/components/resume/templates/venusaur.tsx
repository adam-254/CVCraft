import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Decorative section headers with icons
	"[&>h6]:flex",
	"[&>h6]:items-center",
	"[&>h6]:gap-x-2",
	"[&>h6]:font-semibold",
	"[&>h6]:text-(--page-primary-color)",
	"[&>h6]:mb-3",
	"[&>h6]:pb-2",
	"[&>h6]:border-b",
	"[&>h6]:border-(--page-primary-color)",
	"[&>h6]:border-opacity-30",
);

/**
 * Template: Venusaur
 */
export function VenusaurTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-venusaur page-content space-y-(--page-gap-y) px-(--page-margin-x) pt-(--page-margin-y) print:p-0">
			{isFirstPage && <Header />}

			<main data-layout="main" className="group page-main space-y-(--page-gap-y)">
				{main.map((section) => {
					const Component = getSectionComponent(section, { sectionClassName });
					return <Component key={section} id={section} />;
				})}
			</main>

			{!fullWidth && (
				<aside data-layout="sidebar" className="group page-sidebar space-y-(--page-gap-y)">
					{sidebar.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</aside>
			)}
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-header relative overflow-hidden rounded-lg bg-(--page-primary-color) bg-opacity-10 p-6">
			<div className="absolute top-0 right-0 size-32 translate-x-8 -translate-y-8 rounded-full bg-(--page-primary-color) opacity-10" />
			<div className="absolute bottom-0 left-0 size-24 -translate-x-6 translate-y-6 rounded-full bg-(--page-primary-color) opacity-10" />

			<div className="relative flex items-center gap-x-(--page-gap-x)">
				<PagePicture className="rounded-lg" />

				<div className="page-basics flex-1 space-y-2">
					<div>
						<h2 className="basics-name font-bold text-3xl">{basics.name}</h2>
						<p className="basics-headline text-(--page-primary-color) text-lg">{basics.headline}</p>
					</div>

					<div className="basics-items flex flex-wrap gap-x-4 gap-y-1 *:flex *:items-center *:gap-x-1.5">
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
