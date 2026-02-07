import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Ultra-modern bold styling
	"[&>h6]:text-2xl",
	"[&>h6]:font-black",
	"[&>h6]:text-(--page-primary-color)",
	"[&>h6]:mb-4",
	"[&>h6]:relative",
	"[&>h6]:pl-6",

	// Bold left accent
	"group-data-[layout=main]:[&>h6]:before:content-['']",
	"group-data-[layout=main]:[&>h6]:before:absolute",
	"group-data-[layout=main]:[&>h6]:before:left-0",
	"group-data-[layout=main]:[&>h6]:before:top-0",
	"group-data-[layout=main]:[&>h6]:before:bottom-0",
	"group-data-[layout=main]:[&>h6]:before:w-2",
	"group-data-[layout=main]:[&>h6]:before:bg-(--page-primary-color)",

	// Sidebar adjustments
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
	"group-data-[layout=sidebar]:[&>h6]:text-lg",
	"group-data-[layout=sidebar]:[&>h6]:pl-0",
	"group-data-[layout=sidebar]:[&>h6]:before:hidden",
);

/**
 * Template: Rayquaza
 * Ultra-modern asymmetric design with overlapping sections
 */
export function RayquazaTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-rayquaza page-content relative space-y-(--page-gap-y) px-(--page-margin-x) pt-(--page-margin-y) print:p-0">
			{isFirstPage && <Header />}

			<div className="flex gap-x-8">
				<main data-layout="main" className="group page-main flex-1 space-y-(--page-gap-y)">
					{main.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</main>

				{!fullWidth && (
					<aside
						data-layout="sidebar"
						className="group page-sidebar w-[38%] shrink-0 space-y-(--page-gap-y) overflow-x-hidden"
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
		<div className="page-header relative mb-8 overflow-hidden">
			{/* Overlapping geometric shapes */}
			<div className="absolute top-0 right-0 h-48 w-[45%] bg-(--page-primary-color) opacity-5" />
			<div className="absolute top-8 right-[10%] h-32 w-[35%] bg-(--page-primary-color) opacity-10" />

			<div className="relative flex items-start gap-x-8 pb-8">
				<div className="page-basics flex-1 space-y-6">
					<div className="space-y-2">
						<h2 className="basics-name font-black text-6xl leading-none tracking-tight">{basics.name}</h2>
						<div className="flex items-center gap-x-3">
							<div className="h-1 w-16 bg-(--page-primary-color)" />
							<p className="basics-headline font-bold text-(--page-primary-color) text-2xl">{basics.headline}</p>
						</div>
					</div>

					<div className="basics-items space-y-2 *:flex *:items-center *:gap-x-3">
						{basics.email && (
							<div className="basics-item-email group">
								<div className="flex size-10 items-center justify-center rounded-lg bg-(--page-primary-color) text-white transition-transform group-hover:scale-110">
									<EnvelopeIcon size={20} weight="bold" />
								</div>
								<PageLink url={`mailto:${basics.email}`} label={basics.email} className="font-medium" />
							</div>
						)}

						{basics.phone && (
							<div className="basics-item-phone group">
								<div className="flex size-10 items-center justify-center rounded-lg bg-(--page-primary-color) text-white transition-transform group-hover:scale-110">
									<PhoneIcon size={20} weight="bold" />
								</div>
								<PageLink url={`tel:${basics.phone}`} label={basics.phone} className="font-medium" />
							</div>
						)}

						{basics.location && (
							<div className="basics-item-location group">
								<div className="flex size-10 items-center justify-center rounded-lg bg-(--page-primary-color) text-white transition-transform group-hover:scale-110">
									<MapPinIcon size={20} weight="bold" />
								</div>
								<span className="font-medium">{basics.location}</span>
							</div>
						)}

						{basics.website.url && (
							<div className="basics-item-website group">
								<div className="flex size-10 items-center justify-center rounded-lg bg-(--page-primary-color) text-white transition-transform group-hover:scale-110">
									<GlobeIcon size={20} weight="bold" />
								</div>
								<PageLink {...basics.website} className="font-medium" />
							</div>
						)}

						{basics.customFields.map((field: { id: string; icon: string; text: string; link?: string }) => (
							<div key={field.id} className="basics-item-custom group">
								<div className="flex size-10 items-center justify-center rounded-lg bg-(--page-primary-color) text-white transition-transform group-hover:scale-110">
									<PageIcon icon={field.icon} />
								</div>
								{field.link ? (
									<PageLink url={field.link} label={field.text} className="font-medium" />
								) : (
									<span className="font-medium">{field.text}</span>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Overlapping profile picture */}
				<div className="relative -mt-4">
					<div className="absolute -inset-4 rounded-2xl bg-(--page-primary-color) opacity-10" />
					<PagePicture className="relative z-10 rounded-2xl border-4 border-white shadow-2xl" />
				</div>
			</div>

			{/* Bottom accent line */}
			<div className="absolute right-[40%] bottom-0 left-0 h-1 bg-(--page-primary-color)" />
		</div>
	);
}
