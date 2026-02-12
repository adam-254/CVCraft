import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import type { CoverLetterTemplateProps } from "./types";

/**
 * Executive Template - Premium design for C-level and senior positions
 */
export function ExecutiveTemplate({
	title,
	recipient,
	content,
	className,
	senderName = "Your Name",
	senderAddress = "123 Executive Drive",
	senderCity = "New York, NY 10001",
	senderPhone = "(555) 123-4567",
	senderEmail = "executive@email.com",
	companyName = "Target Company",
	companyAddress = "456 Corporate Blvd",
	companyCity = "New York, NY 10002",
	hiringManager = "Hiring Manager",
}: CoverLetterTemplateProps) {
	const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return (
		<div className={cn("relative bg-gradient-to-br from-slate-50 to-gray-100 p-12 shadow-lg", className)}>
			<div className="bg-white shadow-2xl">
				{/* Premium Header with Gold Accent */}
				<div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 p-8">
					<div className="absolute top-0 right-0 size-64 rounded-full bg-amber-500 opacity-10 blur-3xl" />
					<div className="relative">
						<div className="mb-4 h-1 w-24 bg-amber-500" />
						<h1 className="mb-2 font-bold text-4xl text-white tracking-tight">{senderName}</h1>
						<div className="flex flex-wrap gap-4 text-gray-300 text-sm">
							<div className="flex items-center gap-2">
								<PhoneIcon className="size-4 text-amber-500" />
								<span>{senderPhone}</span>
							</div>
							<div className="flex items-center gap-2">
								<EnvelopeIcon className="size-4 text-amber-500" />
								<span>{senderEmail}</span>
							</div>
							<div className="flex items-center gap-2">
								<MapPinIcon className="size-4 text-amber-500" />
								<span>{senderCity}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="p-12">
					{/* Date and Company Info */}
					<div className="mb-8 flex justify-between border-gray-200 border-b pb-6">
						<div>
							<p className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{today}</p>
						</div>
						<div className="text-right">
							<p className="font-bold text-gray-900">{companyName}</p>
							<p className="text-gray-600 text-sm">{companyAddress}</p>
							<p className="text-gray-600 text-sm">{companyCity}</p>
						</div>
					</div>

					{/* Salutation */}
					<div className="mb-6">
						<p className="font-semibold text-gray-900 text-lg">Dear {hiringManager},</p>
					</div>

					{/* Content */}
					<div className="mb-8 space-y-4 text-justify text-gray-700 leading-relaxed">
						{content.split("\n\n").map((paragraph, index) => (
							<p key={index}>{paragraph}</p>
						))}
					</div>

					{/* Signature */}
					<div className="mt-12">
						<p className="font-semibold text-gray-900">Respectfully,</p>
						<div className="mt-8">
							<div className="mb-2 h-px w-48 bg-gradient-to-r from-amber-500 to-transparent" />
							<p className="font-bold text-gray-900">{senderName}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
