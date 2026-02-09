import { BookOpenIcon, GraduationCapIcon, PencilIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Academic Template - Scholarly design for academic positions and research roles
 */
export function AcademicTemplate({
	content,
	className,
	senderName = "Your Name",
	senderAddress = "123 University Avenue",
	senderCity = "Boston, MA 02115",
	senderPhone = "(555) 123-4567",
	senderEmail = "scholar@university.edu",
	companyName = "University Name",
	companyAddress = "Department of Studies",
	companyCity = "City, State ZIP",
	hiringManager = "Search Committee Chair",
	position = "Academic Position",
}: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("bg-amber-50 p-12 shadow-lg", className)}>
			<div className="bg-white shadow-2xl">
				{/* Academic Header with Serif Typography */}
				<div className="border-amber-700 border-b-2 bg-gradient-to-b from-amber-50 to-white p-8">
					<div className="mb-6 flex items-center gap-4">
						<div className="rounded-full bg-amber-700 p-4">
							<GraduationCapIcon className="size-8 text-white" weight="duotone" />
						</div>
						<div className="h-12 w-px bg-amber-300" />
						<div className="flex gap-3">
							<BookOpenIcon className="size-6 text-amber-700" weight="duotone" />
							<PencilIcon className="size-6 text-amber-600" weight="duotone" />
						</div>
					</div>
					<h1 className="mb-2 font-bold font-serif text-3xl text-gray-900">{senderName}</h1>
					<p className="mb-4 font-serif text-amber-800 text-lg italic">{position}</p>
					<div className="space-y-1 text-gray-700 text-sm">
						<p>{senderAddress}</p>
						<p>{senderCity}</p>
						<div className="mt-3 flex gap-4 border-amber-200 border-t pt-3">
							<span>{senderPhone}</span>
							<span className="text-amber-700">•</span>
							<span>{senderEmail}</span>
						</div>
					</div>
				</div>

				<div className="p-10">
					{/* Date */}
					<div className="mb-8">
						<p className="font-serif text-gray-900">{today}</p>
					</div>

					{/* Recipient Information */}
					<div className="mb-8 rounded-lg border-2 border-amber-100 bg-amber-50/50 p-6">
						<p className="font-semibold text-gray-900">{hiringManager}</p>
						<p className="font-serif text-gray-700">{position}</p>
						<p className="mt-2 font-semibold text-gray-900">{companyName}</p>
						<p className="text-gray-700 text-sm">{companyAddress}</p>
						<p className="text-gray-700 text-sm">{companyCity}</p>
					</div>

					{/* Formal Academic Salutation */}
					<div className="mb-6">
						<p className="font-serif text-gray-900">Dear Members of the Search Committee,</p>
					</div>

					{/* Content with Academic Styling */}
					<div className="mb-8 space-y-5 text-justify font-serif text-gray-800 leading-loose">
						{content.split("\n\n").map((paragraph, index) => (
							<p key={index} className="relative pl-6">
								<span className="absolute top-0 left-0 font-serif text-2xl text-amber-700/30">¶</span>
								{paragraph}
							</p>
						))}
					</div>

					{/* Formal Academic Closing */}
					<div className="mt-12">
						<p className="font-serif text-gray-900">Respectfully submitted,</p>
						<div className="mt-8 space-y-2">
							<div className="h-px w-64 bg-gradient-to-r from-amber-700 to-transparent" />
							<p className="font-bold font-serif text-gray-900 text-lg">{senderName}</p>
							<p className="font-serif text-gray-600 text-sm italic">Candidate for {position}</p>
						</div>
					</div>

					{/* Academic Footer */}
					<div className="mt-12 border-amber-200 border-t-2 pt-6">
						<div className="flex items-center justify-center gap-3 text-amber-800 text-xs">
							<BookOpenIcon className="size-4" />
							<span className="font-serif uppercase tracking-wider">Academic Correspondence</span>
							<BookOpenIcon className="size-4" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
