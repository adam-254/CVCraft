import { BuildingsIcon, EnvelopeIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Corporate Template - Professional design for large corporations and formal business settings
 */
export function CorporateTemplate({
	content,
	className,
	senderName = "Your Name",
	senderAddress = "123 Business Street",
	senderCity = "New York, NY 10001",
	senderPhone = "(555) 123-4567",
	senderEmail = "professional@email.com",
	companyName = "Corporation Name",
	companyAddress = "456 Corporate Plaza",
	companyCity = "New York, NY 10002",
	hiringManager = "Hiring Manager",
	position = "Position Title",
}: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("bg-gray-50 p-12 shadow-lg", className)}>
			<div className="bg-white shadow-xl">
				{/* Corporate Header with Navy Blue */}
				<div className="border-blue-900 border-b-4 bg-gradient-to-r from-blue-900 to-blue-800 p-8">
					<div className="flex items-start justify-between">
						<div>
							<h1 className="mb-3 font-bold text-3xl text-white tracking-wide">{senderName}</h1>
							<div className="space-y-1 text-blue-100 text-sm">
								<p>{senderAddress}</p>
								<p>{senderCity}</p>
							</div>
						</div>
						<div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
							<BuildingsIcon className="size-12 text-white" weight="duotone" />
						</div>
					</div>
					<div className="mt-4 flex gap-6 border-blue-700 border-t pt-4 text-blue-100 text-sm">
						<div className="flex items-center gap-2">
							<PhoneIcon className="size-4" />
							<span>{senderPhone}</span>
						</div>
						<div className="flex items-center gap-2">
							<EnvelopeIcon className="size-4" />
							<span>{senderEmail}</span>
						</div>
					</div>
				</div>

				<div className="p-10">
					{/* Date and Recipient */}
					<div className="mb-8 grid grid-cols-2 gap-8 border-gray-200 border-b pb-6">
						<div>
							<p className="mb-1 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</p>
							<p className="font-medium text-gray-900">{today}</p>
						</div>
						<div className="text-right">
							<p className="mb-1 font-semibold text-gray-500 text-xs uppercase tracking-wider">To</p>
							<p className="font-bold text-gray-900">{hiringManager}</p>
							<p className="font-semibold text-gray-700">{position}</p>
							<p className="mt-2 font-bold text-gray-900">{companyName}</p>
							<p className="text-gray-600 text-sm">{companyAddress}</p>
							<p className="text-gray-600 text-sm">{companyCity}</p>
						</div>
					</div>

					{/* Formal Salutation */}
					<div className="mb-6">
						<p className="font-semibold text-gray-900">Dear {hiringManager},</p>
					</div>

					{/* Content with Professional Spacing */}
					<div className="mb-8 space-y-4 text-justify text-gray-700 leading-relaxed">
						{content.split("\n\n").map((paragraph, index) => (
							<p key={index} className="indent-8">
								{paragraph}
							</p>
						))}
					</div>

					{/* Formal Closing */}
					<div className="mt-12">
						<p className="font-semibold text-gray-900">Sincerely,</p>
						<div className="mt-8 border-blue-900 border-t-2 pt-2">
							<p className="font-bold text-gray-900 text-lg">{senderName}</p>
						</div>
					</div>

					{/* Footer with Corporate Branding */}
					<div className="mt-12 border-gray-200 border-t pt-6">
						<p className="text-center text-gray-500 text-xs uppercase tracking-wider">Professional Correspondence</p>
					</div>
				</div>
			</div>
		</div>
	);
}
