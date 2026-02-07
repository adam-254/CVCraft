import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Dynamic zigzag styling
	"[&>h6]:text-xl",
	"[&>h6]:font-black",
	"[&>h6]:uppercase",
	"[&>h6]:tracking-wide",
	"[&>h6]:text-(--page-primary-color)",
	"[&>h6]:mb-4",
	"[&>h6]:relative",
	"[&>h6]:inline-block",

	// Zigzag underline effect
	"group-data-[layout=main]:[&>h6]:after:content-['']",
	"group-data-[layout=main]:[&>h6]:after:absolute",
	"group-data-[layout=main]:[&>h6]:after:bottom-[-8px]",
	"group-data-[layout=main]:[&>h6]:after:left-0",
	"group-data-[layout=main]:[&>h6]:after:right-0",
	"group-data-[layout=main]:[&>h6]:after:h-1",
	"group-data-[layout=main]:[&>h6]:after:bg-(--page-primary-color)",

	// Sidebar adjustments
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
	"group-data-[layout=sidebar]:[&>h6]:text-base",
);

/**
 * Template: Zapdos
 * Dynamic design with electric energy
 */
export function ZapdosTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-zapdos page-content space-y-(--page-gap-y) px-(--page-margin-x) pt-(--page-margin-y) print:p-0">
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
						className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-(--page-gap-y) overflow-x-hidden border-(--page-primary-color) border-l-4 pl-6"
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
		<div className="page-header relative overflow-hidden">
			{/* Electric zigzag background pattern */}
			<div className="absolute inset-0 opacity-5">
				<svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
					<pattern id="zigzag" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
						<path
							d="M0 20 L10 10 L20 20 L30 10 L40 20"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							className="text-(--page-primary-color)"
						/>
					</pattern>
					<rect width="100%" height="100%" fill="url(#zigzag)" />
				</svg>
			</div>

			<div className="relative border-(--page-primary-color) border-b-4 pb-6">
				<div className="flex items-center gap-x-8">
					<PagePicture className="border-(--page-primary-color) border-4 shadow-lg" />

					<div className="page-basics flex-1 space-y-3">
						<div>
							<h2 className="basics-name font-black text-5xl uppercase tracking-tight">{basics.name}</h2>
							<p className="basics-headline font-bold text-(--page-primary-color) text-2xl">{basics.headline}</p>
						</div>

						<div className="basics-items grid grid-cols-2 gap-2 font-medium text-sm *:flex *:items-center *:gap-x-2">
							{basics.email && (
								<div className="basics-item-email">
									<div className="flex size-8 items-center justify-center rounded bg-(--page-primary-color) text-white">
										<EnvelopeIcon size={16} weight="bold" />
									</div>
									<PageLink url={`mailto:${basics.email}`} label={basics.email} />
								</div>
							)}

							{basics.phone && (
								<div className="basics-item-phone">
									<div className="flex size-8 items-center justify-center rounded bg-(--page-primary-color) text-white">
										<PhoneIcon size={16} weight="bold" />
									</div>
									<PageLink url={`tel:${basics.phone}`} label={basics.phone} />
								</div>
							)}

							{basics.location && (
								<div className="basics-item-location">
									<div className="flex size-8 items-center justify-center rounded bg-(--page-primary-color) text-white">
										<MapPinIcon size={16} weight="bold" />
									</div>
									<span>{basics.location}</span>
								</div>
							)}

							{basics.website.url && (
								<div className="basics-item-website">
									<div className="flex size-8 items-center justify-center rounded bg-(--page-primary-color) text-white">
										<GlobeIcon size={16} weight="bold" />
									</div>
									<PageLink {...basics.website} />
								</div>
							)}

							{basics.customFields.map((field: { id: string; icon: string; text: string; link?: string }) => (
								<div key={field.id} className="basics-item-custom">
									<div className="flex size-8 items-center justify-center rounded bg-(--page-primary-color) text-white">
										<PageIcon icon={field.icon} />
									</div>
									{field.link ? <PageLink url={field.link} label={field.text} /> : <span>{field.text}</span>}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
