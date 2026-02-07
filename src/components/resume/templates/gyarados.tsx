import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Striking timeline design
	"[&>h6]:text-lg",
	"[&>h6]:font-bold",
	"[&>h6]:text-(--page-primary-color)",
	"[&>h6]:mb-4",
	"[&>h6]:pb-2",
	"[&>h6]:border-b-2",
	"[&>h6]:border-(--page-primary-color)",

	// Timeline markers for main sections
	"[&>.section-content]:relative",
	"[&>.section-content]:pl-6",
	"[&>.section-content]:border-l-2",
	"[&>.section-content]:border-(--page-primary-color)",
	"[&>.section-content]:border-opacity-30",
	"[&>.section-content]:ml-2",

	// Timeline dots
	"[&>.section-content_.section-item]:relative",
	"[&>.section-content_.section-item]:before:content-['']",
	"[&>.section-content_.section-item]:before:absolute",
	"[&>.section-content_.section-item]:before:left-[-1.75rem]",
	"[&>.section-content_.section-item]:before:top-2",
	"[&>.section-content_.section-item]:before:size-3",
	"[&>.section-content_.section-item]:before:rounded-full",
	"[&>.section-content_.section-item]:before:bg-(--page-primary-color)",
	"[&>.section-content_.section-item]:before:border-2",
	"[&>.section-content_.section-item]:before:border-(--page-background-color)",
);

/**
 * Template: Gyarados
 */
export function GyaradosTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-gyarados page-content space-y-(--page-gap-y) px-(--page-margin-x) pt-(--page-margin-y) print:p-0">
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
		<div className="page-header bg-(--page-primary-color) p-6 text-white print:text-black">
			<div className="flex items-center gap-x-(--page-gap-x)">
				<PagePicture className="border-4 border-white" />

				<div className="page-basics flex-1 space-y-2">
					<div>
						<h2 className="basics-name font-bold text-4xl">{basics.name}</h2>
						<p className="basics-headline text-xl opacity-90">{basics.headline}</p>
					</div>

					<div className="basics-items flex flex-wrap gap-x-4 gap-y-1 *:flex *:items-center *:gap-x-1.5">
						{basics.email && (
							<div className="basics-item-email">
								<EnvelopeIcon />
								<PageLink url={`mailto:${basics.email}`} label={basics.email} className="text-white print:text-black" />
							</div>
						)}

						{basics.phone && (
							<div className="basics-item-phone">
								<PhoneIcon />
								<PageLink url={`tel:${basics.phone}`} label={basics.phone} className="text-white print:text-black" />
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
								<PageLink {...basics.website} className="text-white print:text-black" />
							</div>
						)}

						{basics.customFields.map((field: { id: string; icon: string; text: string; link?: string }) => (
							<div key={field.id} className="basics-item-custom">
								<PageIcon icon={field.icon} />
								{field.link ? (
									<PageLink url={field.link} label={field.text} className="text-white print:text-black" />
								) : (
									<span>{field.text}</span>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
