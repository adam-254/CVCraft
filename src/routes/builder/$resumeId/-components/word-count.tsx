import { t } from "@lingui/core/macro";
import { TextAaIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useResumeStore } from "@/components/resume/store/resume";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function WordCount() {
	const resume = useResumeStore((state) => state.resume);

	const { wordCount, charCount } = useMemo(() => {
		const getAllText = (obj: any): string => {
			if (typeof obj === "string") return obj;
			if (Array.isArray(obj)) return obj.map(getAllText).join(" ");
			if (obj && typeof obj === "object") {
				return Object.values(obj).map(getAllText).join(" ");
			}
			return "";
		};

		const allText = getAllText(resume.data);
		const words = allText.trim().split(/\s+/).filter(Boolean).length;
		const chars = allText.replace(/\s/g, "").length;

		return { wordCount: words, charCount: chars };
	}, [resume.data]);

	return (
		<motion.div
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 0.7, x: 0 }}
			whileHover={{ opacity: 1 }}
			transition={{ duration: 0.2 }}
			className="fixed right-4 bottom-4 flex items-center gap-x-2 rounded-full bg-popover px-4 py-2 text-xs shadow-xl"
		>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="flex items-center gap-x-2">
						<TextAaIcon className="size-4" />
						<div className="flex gap-x-3">
							<span className="font-medium">
								{wordCount} {t`words`}
							</span>
							<span className="text-muted-foreground">•</span>
							<span className="font-medium">
								{charCount} {t`chars`}
							</span>
						</div>
					</div>
				</TooltipTrigger>
				<TooltipContent side="top" align="end" className="font-medium">
					<div className="space-y-1">
						<div>{t`Total word count: ${wordCount}`}</div>
						<div>{t`Total character count: ${charCount}`}</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</motion.div>
	);
}
