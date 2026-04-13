import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3b82f6", // Vibrant Blue
          "primary-content": "#ffffff",
          "secondary": "#8b5cf6", // Purple
          "accent": "#ec4899", // Pink
          "neutral": "#f3f4f6",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "base-content": "#1f2937",
        },
      },
      {
        dark: {
          "primary": "#60a5fa", // Bright Blue
          "primary-content": "#000000",
          "secondary": "#a78bfa", // Light Purple
          "accent": "#f472b6", // Bright Pink
          "neutral": "#27272a",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#0f172a",
          "base-content": "#f3f4f6",
        },
      },
      {
        noir: {
          "primary": "#60a5fa", // Bright Blue for contrast
          "primary-content": "#000000",
          "secondary": "#a78bfa", // Light Purple
          "accent": "#f472b6", // Bright Pink
          "neutral": "#09090b",
          "base-100": "#000000",
          "base-200": "#09090b",
          "base-300": "#18181b",
          "base-content": "#f3f4f6",
          "info": "#60a5fa",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
};
