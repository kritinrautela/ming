import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Brand bible tokens (docs/chazen-brand-bible.md) — hex values are the single source of truth.
        ink: "#171713", // Ink black
        porcelain: "#fbfaf6", // Porcelain
        paper: "#f2eadc", // Warm ivory
        moss: "#3f5945", // Moss green
        clay: "#6f4a32", // Tea brown
        brass: "#9d8150", // Aged bronze
        seal: "#9f3f2f", // Clay seal red
        charcoal: "#10120f", // Deep charcoal
        // Supporting neutral with no brand-bible analog — kept as-is, used for secondary tints only.
        stone: "#d8d0c2",
        leaf: "#203a2b"
      },
      fontFamily: {
        display: ["var(--font-serif)", "Cormorant Garamond", "var(--font-cjk)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Instrument Sans", "Avenir Next", "Helvetica Neue", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(32, 58, 43, 0.12)",
        object: "0 18px 40px rgba(23, 23, 19, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
