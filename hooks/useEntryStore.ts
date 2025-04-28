import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the state structure for the EntryStore
interface EntryState {
  isSubmitted: boolean;
  isLoading: boolean;
  entry: Entry | null;
}

// Define the actions available in the EntryStore
interface EntryActions {
  updateEntry: (updates: Partial<Entry>) => void;
  updateIsSubmitted: (
    nextValue:
      | EntryState["isSubmitted"]
      | ((current: EntryState["isSubmitted"]) => EntryState["isSubmitted"])
  ) => void;
  updateIsLoading: (
    nextValue:
      | EntryState["isLoading"]
      | ((current: EntryState["isLoading"]) => EntryState["isLoading"])
  ) => void;
  clear: () => void;
}

// Combine state and actions into a single type
type EntryStore = EntryState & EntryActions;

// Define the Entry interface
interface Entry {
  id?: number;
  handle?: string;
  fullName?: string;
  html?: string;
  submitted?: boolean;
}

export const useEntryStore = create<EntryStore>()(
  persist(
    (set, get) => ({
      isSubmitted: false,
      isLoading: false,
      entry: null,

      // Consolidated update function for Entry properties
      updateEntry: (updates) => {
        set((state) => ({
          entry: {
            ...state.entry,
            ...updates,
          },
        }));
      },

      updateIsSubmitted: (nextValue) => {
        set((state) => ({
          isSubmitted:
            typeof nextValue === "function"
              ? nextValue(state.isSubmitted)
              : nextValue,
        }));
      },

      updateIsLoading: (nextValue) => {
        set((state) => ({
          isLoading:
            typeof nextValue === "function"
              ? nextValue(state.isLoading)
              : nextValue,
        }));
      },

      clear: () => {
        set(() => ({ entry: null }));
      },
    }),
    {
      name: "entry-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
    }
  )
);