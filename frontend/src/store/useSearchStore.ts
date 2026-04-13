import { create } from "zustand";
import { SearchState } from "../types";

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedTag: "",
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}));
