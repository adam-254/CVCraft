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
};

type CoverLetterBuilderActions = {
	initialize: (coverLetter: CoverLetter | null) => void;
	updateCoverLetter: (fn: (draft: WritableDraft<CoverLetter>) => void) => void;
	setSelectedTemplate: (template: string) => void;
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
		tags: coverLetter.tags,
	}, { signal });
};

const syncCoverLetter = debounce(_syncCoverLetter, 500, { signal });

let errorToastId: string | number | undefined;

type PartializedState = { coverLetter: CoverLetter | null; selectedTemplate: string };

export const useCoverLetterBuilderStore = create<CoverLetterBuilderStore>()(
	temporal(
		immer((set) => ({
			coverLetter: null as unknown as CoverLetter,
			isReady: false,
			selectedTemplate: "professional",

			initialize: (coverLetter) => {
				set((state) => {
					state.coverLetter = coverLetter as CoverLetter;
					state.isReady = coverLetter !== null;
					useCoverLetterBuilderStore.temporal.getState().clear();
				});
			},

			setSelectedTemplate: (template) => {
				set((state) => {
					state.selectedTemplate = template;
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
			partialize: (state) => ({ coverLetter: state.coverLetter, selectedTemplate: state.selectedTemplate }),
			equality: (pastState, currentState) => isDeepEqual(pastState, currentState),
			limit: 100,
		},
	),
);

export function useTemporalStore<T>(selector: (state: TemporalState<PartializedState>) => T): T {
	return useStoreWithEqualityFn(useCoverLetterBuilderStore.temporal, selector);
}