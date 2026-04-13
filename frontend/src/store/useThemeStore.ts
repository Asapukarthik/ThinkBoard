import { create } from "zustand";
import { ThemeState } from "../types";

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem("theme") as "noir" | "light" | "dark") || "noir",
  toggleTheme: () => set((state) => {
    let newTheme: "noir" | "light" | "dark";
    if (state.theme === "noir") newTheme = "light";
    else if (state.theme === "light") newTheme = "dark";
    else newTheme = "noir";
    
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    return { theme: newTheme };
  }),
  initTheme: () => set((state) => {
    document.documentElement.setAttribute("data-theme", state.theme);
    return state;
  })
}));
