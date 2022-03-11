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
  entry: Entry | null;
  updateId: (id: number) => void;
  updateFullName: (fullName: string) => void;
  updateHandle: (handle: string) => void;
  updateHtml: (html: string) => void;
  updateSubmitted: (submitted: boolean) => void;
  clear: () => void;
}

export const useEntryStore = createStore<EntrytStore>(
  persist(
    {
      key: "entry",
      denylist: [],
    },
    (set) => ({
      isSubmitted: false,
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
      updateSubmitted: (value: boolean) => {
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
