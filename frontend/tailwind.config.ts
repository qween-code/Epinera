import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d12",
        surface: "#11141b",
        elev: "#161a23",
        border: "#222836",
        text: "#e7eaf0",
        muted: "#8a93a6",
        accent: "#5b8cff",
        success: "#4ade80",
        warn: "#f6c453",
        danger: "#ef4d6e",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
