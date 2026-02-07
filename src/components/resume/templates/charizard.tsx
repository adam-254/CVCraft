import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Main layout sections
	"group-data-[layout=main]:[&>h6]:text-2xl",
	"group-data-[layout=main]:[&>h6]:font-bold",
	"group-data-[layout=main]:[&>h6]:mb-4",

	// Sidebar sections with light text
	"group-data-[layout=sidebar]:[&>h6]:text-white",
	"group-data-[layout=sidebar]:[&>h6]:font-semibold",
	"group-data-[layout=sidebar]:[&>h6]:uppercase",
	"group-data-[layout=sidebar]:[&>h6]:tracking-wide",
	"group-data-[layout=sidebar]:[&>h6]:text-sm",
	"group-data-[layout=sidebar]:[&>h6]:border-b",
	"group-data-[layout=sidebar]:[&>h6]:border-white",
	"group-data-[layout=sidebar]:[&>h6]:border-opacity-30",
	"group-data-[layout=sidebar]:[&>h6]:pb-2",
	"group-data-[layout=sidebar]:[&>h6]:mb-3",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
	"group-data-[layout=sidebar]:text-white",
	"group-data-[layout=sidebar]:text-opacity-95",
);

/**
 * Template: Charizard
 */
export function CharizardTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-charizard page-content flex print:p-0">
			{!fullWidth && (
				<aside
					data-layout="sidebar"
					className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-(--page-gap-y) overflow-x-hidden bg-(--page-primary-color) p-6 text-white"
				>
					{isFirstPage && <SidebarHeader />}
					{sidebar.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</aside>
			)}

			<main
				data-layout="main"
				className="group page-main flex-1 space-y-(--page-gap-y) px-(--page-margin-x) pt-(--page-margin-y)"
			>
				{isFirstPage && <MainHeader />}
				{main.map((section) => {
					const Component = getSectionComponent(section, { sectionClassName });
					return <Component key={section} id={section} />;
				})}
			</main>
		</div>
	);
}

function SidebarHeader() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-sidebar-header space-y-4 border-white border-b border-opacity-30 pb-6">
			<PagePicture className="mx-auto rounded-full border-4 border-white border-opacity-30" />

			<div className="basics-items space-y-2 text-sm *:flex *:items-center *:gap-x-2">
				{basics.email && (
					<div className="basics-item-email">
						<EnvelopeIcon size={16} />
						<PageLink url={`mailto:${basics.email}`} label={basics.email} className="text-white" />
					</div>
				)}

				{basics.phone && (
					<div className="basics-item-phone">
						<PhoneIcon size={16} />
						<PageLink url={`tel:${basics.phone}`} label={basics.phone} className="text-white" />
					</div>
				)}

				{basics.location && (
					<div className="basics-item-location">
						<MapPinIcon size={16} />
						<span>{basics.location}</span>
					</div>
				)}

				{basics.website.url && (
					<div className="basics-item-website">
						<GlobeIcon size={16} />
						<PageLink {...basics.website} className="text-white" />
					</div>
				)}

				{basics.customFields.map((field: { id: string; icon: string; text: string; link?: string }) => (
					<div key={field.id} className="basics-item-custom">
						<PageIcon icon={field.icon} />
						{field.link ? (
							<PageLink url={field.link} label={field.text} className="text-white" />
						) : (
							<span>{field.text}</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

function MainHeader() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-header border-(--page-primary-color) border-b-4 pb-4">
			<h2 className="basics-name font-bold text-5xl">{basics.name}</h2>
			<p className="basics-headline text-(--page-primary-color) text-xl">{basics.headline}</p>
		</div>
	);
}
