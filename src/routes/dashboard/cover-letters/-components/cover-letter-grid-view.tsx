import { AnimatePresence, motion } from "motion/react";
import type { RouterOutput } from "@/integrations/orpc/client";
import { CoverLetterCard } from "./cards/cover-letter-card";

type CoverLetter = RouterOutput["coverLetter"]["list"][number];

type Props = {
	coverLetters: CoverLetter[];
};

export function CoverLetterGridView({ coverLetters }: Props) {
	return (
		<div className="grid 3xl:grid-cols-6 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
			<AnimatePresence>
				{coverLetters?.map((coverLetter, index) => (
					<motion.div
						layout
						key={coverLetter.id}
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, y: -50, filter: "blur(12px)" }}
						transition={{ delay: index * 0.05 }}
					>
						<CoverLetterCard coverLetter={coverLetter} />
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}
