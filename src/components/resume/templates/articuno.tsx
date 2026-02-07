import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Premium section styling
	"[&>h6]:text-lg",
	"[&>h6]:font-bold",
	"[&>h6]:text-(--page-primary-color)",
	"[&>h6]:mb-4",
	"[&>h6]:relative",
	"[&>h6]:pb-2",

	// Main sections with underline
	"group-data-[layout=main]:[&>h6]:after:content-['']",
	"group-data-[layout=main]:[&>h6]:after:absolute",
	"group-data-[layout=main]:[&>h6]:after:bottom-0",
	"group-data-[layout=main]:[&>h6]:after:left-0",
	"group-data-[layout=main]:[&>h6]:after:w-16",
	"group-data-[layout=main]:[&>h6]:after:h-1",
	"group-data-[layout=main]:[&>h6]:after:bg-(--page-primary-color)",

	// Sidebar adjustments
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
	"group-data-[layout=sidebar]:[&>h6]:text-base",
);

/**
 * Template: Articuno
 * Premium design with diagonal accent banner
 */
export function ArticunoTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-articuno page-content relative overflow-hidden px-(--page-margin-x) pt-(--page-margin-y) print:p-0">
			{isFirstPage && <Header />}

			<div className="relative z-10 flex gap-x-(--page-gap-x) pt-(--page-gap-y)">
				{!fullWidth && (
					<aside
						data-layout="sidebar"
						className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-(--page-gap-y) overflow-x-hidden rounded-lg bg-gray-50 p-5"
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
		<div className="page-header relative pb-8">
			{/* Diagonal accent banner */}
			<div className="absolute top-0 right-0 left-0 h-40 overflow-hidden">
				<div
					className="absolute -top-10 -right-20 h-64 w-[120%] origin-top-right rotate-[-8deg] bg-(--page-primary-color) opacity-10"
					style={{ transform: "rotate(-8deg)" }}
				/>
			</div>

			<div className="relative z-10 flex items-start gap-x-8 pt-6">
				{/* Floating profile picture */}
				<div className="relative">
					<div className="absolute -inset-2 rounded-full bg-(--page-primary-color) opacity-20 blur-md" />
					<PagePicture className="relative rounded-full border-4 border-white shadow-lg" />
				</div>

				<div className="page-basics flex-1 space-y-4 pt-4">
					<div>
						<h2 className="basics-name font-bold text-5xl leading-tight">{basics.name}</h2>
						<p className="basics-headline font-medium text-(--page-primary-color) text-xl">{basics.headline}</p>
					</div>

					<div className="basics-items flex flex-wrap gap-x-6 gap-y-2 *:flex *:items-center *:gap-x-2">
						{basics.email && (
							<div className="basics-item-email rounded-full bg-white px-4 py-2 shadow-sm">
								<EnvelopeIcon size={16} />
								<PageLink url={`mailto:${basics.email}`} label={basics.email} />
							</div>
						)}

						{basics.phone && (
							<div className="basics-item-phone rounded-full bg-white px-4 py-2 shadow-sm">
								<PhoneIcon size={16} />
								<PageLink url={`tel:${basics.phone}`} label={basics.phone} />
							</div>
						)}

						{basics.location && (
							<div className="basics-item-location rounded-full bg-white px-4 py-2 shadow-sm">
								<MapPinIcon size={16} />
								<span>{basics.location}</span>
							</div>
						)}

						{basics.website.url && (
							<div className="basics-item-website rounded-full bg-white px-4 py-2 shadow-sm">
								<GlobeIcon size={16} />
								<PageLink {...basics.website} />
							</div>
						)}

						{basics.customFields.map((field: { id: string; icon: string; text: string; link?: string }) => (
							<div key={field.id} className="basics-item-custom rounded-full bg-white px-4 py-2 shadow-sm">
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
