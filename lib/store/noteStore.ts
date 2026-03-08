/*zustand*/
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/*types*/
import type { CreateNoteProps } from "@/lib/api/clientApi";

type CreateNoteStore = {
    draft: CreateNoteProps;
    setDraft: (note: Partial<CreateNoteProps>) => void;
    clearDraft: () => void;
}

export const initialDraft: CreateNoteProps = {
  title: '',
  content: '',
  tag: 'Todo',
};


export const useCreateNoteStore = create<CreateNoteStore>()(
    persist((set) => ({
        draft: initialDraft,
        setDraft: (note) => set((state) => ({ draft: { ...state.draft, ...note } })),
        clearDraft: () => set({ draft: initialDraft }),
    }),
        {
            name: "create-note-draft",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ draft: state.draft }),
        }
    )
);