import createStore from "zustand";
import persist from "../lib/persist";

interface Entry {
  id?: number;
  handle?: string;
  fullName?: string;
  html?: string;
  submitted?: boolean;
}

interface EntrytStore {
  isSubmitted: boolean;
  isLoading: boolean;
  entry: Entry | null;
  updateId: (id: number) => void;
  updateFullName: (fullName: string) => void;
  updateHandle: (handle: string) => void;
  updateHtml: (html: string) => void;
  updateIsSubmitted: (submitted: boolean) => void;
  updateIsLoading: (isLoading: boolean) => void;
  clear: () => void;
}

export const useEntryStore = createStore<EntrytStore>(
  persist(
    {
      key: "entry",
      denylist: ["isLoading"],
    },
    (set) => ({
      isSubmitted: false,
      isLoading: false,
      entry: null,
      updateId: (id) => {
        set((state) => ({
          entry: {
            ...state.entry,
            id: id,
          },
        }));
      },
      updateFullName: (fullName: string) => {
        set((state) => ({
          entry: {
            ...state.entry,
            fullName: fullName,
          },
        }));
      },
      updateHandle: (handle: string) => {
        set((state) => ({
          entry: {
            ...state.entry,
            handle: handle,
          },
        }));
      },
      updateHtml: (html: string) => {
        set((state) => ({
          entry: {
            ...state.entry,
            html: html,
          },
        }));
      },
      updateIsLoading: (value: boolean) => {
        set((state) => ({
          isLoading: value
        }));
      },
      updateIsSubmitted: (value: boolean) => {
        set((state) => ({
          isSubmitted: value
        }));
      },
      clear: () => {
        set((state) => ({
          entry: null,
        }));
      },
    })
  )
);
