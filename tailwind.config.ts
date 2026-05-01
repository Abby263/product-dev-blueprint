import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d9d9de",
          300: "#b8b8c0",
          400: "#8d8d99",
          500: "#6b6b78",
          600: "#52525c",
          700: "#3f3f47",
          800: "#27272d",
          900: "#18181b",
          950: "#0b0b0d",
        },
        accent: {
          50: "#eef4ff",
          100: "#dde9ff",
          200: "#b9d2ff",
          300: "#8cb2ff",
          400: "#5d8aff",
          500: "#3a66f4",
          600: "#284bd6",
          700: "#213cae",
          800: "#1d3489",
          900: "#1b2e6d",
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica Neue', 'Arial'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
