import { t } from "@lingui/core/macro";
import { debounce } from "es-toolkit";
import isDeepEqual from "fast-deep-equal";
import type { WritableDraft } from "immer";
import { current } from "immer";
import { toast } from "sonner";
import type { TemporalState } from "zundo";
import { temporal } from "zundo";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand/react";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { orpc, type RouterOutput } from "@/integrations/orpc/client";

type CoverLetter = RouterOutput["coverLetter"]["getById"];

type CoverLetterBuilderState = {
	coverLetter: CoverLetter;
	isReady: boolean;
	selectedTemplate: string;
	currentPageIndex: number;
};

type CoverLetterBuilderActions = {
	initialize: (coverLetter: CoverLetter | null) => void;
	updateCoverLetter: (fn: (draft: WritableDraft<CoverLetter>) => void) => void;
	setSelectedTemplate: (template: string) => void;
	setCurrentPageIndex: (index: number) => void;
	addPage: () => void;
	deletePage: (pageIndex: number) => void;
	updatePageContent: (pageIndex: number, content: string) => void;
};

type CoverLetterBuilderStore = CoverLetterBuilderState & CoverLetterBuilderActions;

const controller = new AbortController();
const signal = controller.signal;

const _syncCoverLetter = (coverLetter: CoverLetter) => {
	orpc.coverLetter.update.call({
		id: coverLetter.id,
		title: coverLetter.title,
		recipient: coverLetter.recipient,
		content: coverLetter.content,
		pages: coverLetter.pages,
		tags: coverLetter.tags,
		senderName: coverLetter.senderName,
		senderAddress: coverLetter.senderAddress,
		senderCity: coverLetter.senderCity,
		senderPhone: coverLetter.senderPhone,
		senderEmail: coverLetter.senderEmail,
		companyName: coverLetter.companyName,
		companyAddress: coverLetter.companyAddress,
		companyCity: coverLetter.companyCity,
		hiringManager: coverLetter.hiringManager,
		position: coverLetter.position,
	}, { signal });
};

const syncCoverLetter = debounce(_syncCoverLetter, 500, { signal });

let errorToastId: string | number | undefined;

type PartializedState = { coverLetter: CoverLetter | null; selectedTemplate: string; currentPageIndex: number };

export const useCoverLetterBuilderStore = create<CoverLetterBuilderStore>()(
	temporal(
		immer((set) => ({
			coverLetter: null as unknown as CoverLetter,
			isReady: false,
			selectedTemplate: "professional",
			currentPageIndex: 0,

			initialize: (coverLetter) => {
				set((state) => {
					state.coverLetter = coverLetter as CoverLetter;
					state.isReady = coverLetter !== null;
					state.currentPageIndex = 0;
					useCoverLetterBuilderStore.temporal.getState().clear();
				});
			},

			setSelectedTemplate: (template) => {
				set((state) => {
					state.selectedTemplate = template;
				});
			},

			setCurrentPageIndex: (index) => {
				set((state) => {
					state.currentPageIndex = index;
				});
			},

			addPage: () => {
				set((state) => {
					if (!state.coverLetter) return state;

					if (state.coverLetter.isLocked) {
						errorToastId = toast.error(t`This cover letter is locked and cannot be updated.`, { id: errorToastId });
						return state;
					}

					const newPageId = String(state.coverLetter.pages.length + 1);
					state.coverLetter.pages.push({ id: newPageId, content: "" });
					state.currentPageIndex = state.coverLetter.pages.length - 1;
					syncCoverLetter(current(state.coverLetter));
				});
			},

			deletePage: (pageIndex) => {
				set((state) => {
					if (!state.coverLetter) return state;

					if (state.coverLetter.isLocked) {
						errorToastId = toast.error(t`This cover letter is locked and cannot be updated.`, { id: errorToastId });
						return state;
					}

					if (state.coverLetter.pages.length <= 1) {
						errorToastId = toast.error(t`You must have at least one page.`, { id: errorToastId });
						return state;
					}

					state.coverLetter.pages.splice(pageIndex, 1);
					
					// Adjust current page index if needed
					if (state.currentPageIndex >= state.coverLetter.pages.length) {
						state.currentPageIndex = state.coverLetter.pages.length - 1;
					}
					
					syncCoverLetter(current(state.coverLetter));
				});
			},

			updatePageContent: (pageIndex, content) => {
				set((state) => {
					if (!state.coverLetter) return state;

					if (state.coverLetter.isLocked) {
						errorToastId = toast.error(t`This cover letter is locked and cannot be updated.`, { id: errorToastId });
						return state;
					}

					if (state.coverLetter.pages[pageIndex]) {
						state.coverLetter.pages[pageIndex].content = content;
						syncCoverLetter(current(state.coverLetter));
					}
				});
			},

			updateCoverLetter: (fn) => {
				set((state) => {
					if (!state.coverLetter) return state;

					if (state.coverLetter.isLocked) {
						errorToastId = toast.error(t`This cover letter is locked and cannot be updated.`, { id: errorToastId });
						return state;
					}

					fn(state.coverLetter);
					syncCoverLetter(current(state.coverLetter));
				});
			},
		})),
		{
			partialize: (state) => ({ 
				coverLetter: state.coverLetter, 
				selectedTemplate: state.selectedTemplate,
				currentPageIndex: state.currentPageIndex 
			}),
			equality: (pastState, currentState) => isDeepEqual(pastState, currentState),
			limit: 100,
		},
	),
);

export function useTemporalStore<T>(selector: (state: TemporalState<PartializedState>) => T): T {
	return useStoreWithEqualityFn(useCoverLetterBuilderStore.temporal, selector);
}