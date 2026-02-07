import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Flame-inspired passionate styling
	"[&>h6]:text-xl",
	"[&>h6]:font-bold",
	"[&>h6]:text-(--page-primary-color)",
	"[&>h6]:mb-4",
	"[&>h6]:relative",
	"[&>h6]:pb-3",

	// Gradient underline
	"[&>h6]:after:content-['']",
	"[&>h6]:after:absolute",
	"[&>h6]:after:bottom-0",
	"[&>h6]:after:left-0",
	"[&>h6]:after:right-0",
	"[&>h6]:after:h-0.5",
	"[&>h6]:after:bg-linear-to-r",
	"[&>h6]:after:from-(--page-primary-color)",
	"[&>h6]:after:to-transparent",
);

/**
 * Template: Moltres
 * Striking design with flame-inspired waves
 */
export function MoltresTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-moltres page-content space-y-(--page-gap-y) px-(--page-margin-x) pt-(--page-margin-y) print:p-0">
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
		<div className="page-header relative overflow-hidden rounded-2xl bg-linear-to-br bg-opacity-10 from-(--page-primary-color) from-0% via-(--page-primary-color) via-50% to-100% to-transparent p-8">
			{/* Wave pattern overlay */}
			<div className="absolute inset-0 opacity-10">
				<svg
					className="h-full w-full"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1200 120"
					preserveAspectRatio="none"
				>
					<path
						d="M0,0 C150,50 350,50 600,20 C850,50 1050,50 1200,0 L1200,120 L0,120 Z"
						fill="currentColor"
						className="text-(--page-primary-color)"
					/>
				</svg>
			</div>

			<div className="relative flex items-center gap-x-8">
				<div className="relative">
					{/* Glowing effect around picture */}
					<div className="absolute -inset-3 animate-pulse rounded-full bg-(--page-primary-color) opacity-20 blur-xl" />
					<PagePicture className="relative rounded-full border-4 border-white shadow-2xl" />
				</div>

				<div className="page-basics flex-1 space-y-4">
					<div>
						<h2 className="basics-name font-bold text-5xl leading-tight">{basics.name}</h2>
						<p className="basics-headline font-semibold text-(--page-primary-color) text-2xl">{basics.headline}</p>
					</div>

					<div className="basics-items flex flex-wrap gap-3 *:flex *:items-center *:gap-x-2">
						{basics.email && (
							<div className="basics-item-email rounded-lg bg-white bg-opacity-80 px-4 py-2 shadow backdrop-blur-sm">
								<EnvelopeIcon size={18} weight="duotone" />
								<PageLink url={`mailto:${basics.email}`} label={basics.email} />
							</div>
						)}

						{basics.phone && (
							<div className="basics-item-phone rounded-lg bg-white bg-opacity-80 px-4 py-2 shadow backdrop-blur-sm">
								<PhoneIcon size={18} weight="duotone" />
								<PageLink url={`tel:${basics.phone}`} label={basics.phone} />
							</div>
						)}

						{basics.location && (
							<div className="basics-item-location rounded-lg bg-white bg-opacity-80 px-4 py-2 shadow backdrop-blur-sm">
								<MapPinIcon size={18} weight="duotone" />
								<span>{basics.location}</span>
							</div>
						)}

						{basics.website.url && (
							<div className="basics-item-website rounded-lg bg-white bg-opacity-80 px-4 py-2 shadow backdrop-blur-sm">
								<GlobeIcon size={18} weight="duotone" />
								<PageLink {...basics.website} />
							</div>
						)}

						{basics.customFields.map((field: { id: string; icon: string; text: string; link?: string }) => (
							<div
								key={field.id}
								className="basics-item-custom rounded-lg bg-white bg-opacity-80 px-4 py-2 shadow backdrop-blur-sm"
							>
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
