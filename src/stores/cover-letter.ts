import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type CoverLetter = {
	id: string;
	title: string;
	slug: string;
	recipient: string;
	content: string;
	tags: string[];
	isPublic: boolean;
	isLocked: boolean;
	password: string | null;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
};

type CoverLetterStore = {
	coverLetter: CoverLetter | null;
	setCoverLetter: (coverLetter: CoverLetter | null) => void;
	updateCoverLetter: (updater: (draft: CoverLetter) => void) => void;
};

export const useCoverLetterStore = create<CoverLetterStore>()(
	immer((set) => ({
		coverLetter: null,

		setCoverLetter: (coverLetter) => {
			set({ coverLetter });
		},

		updateCoverLetter: (updater) => {
			set((state) => {
				if (state.coverLetter) {
					updater(state.coverLetter);
				}
			});
		},
	})),
);
