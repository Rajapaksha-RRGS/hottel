import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#1A1A1A",
        bone: "#F5F5F7",
        gold: "#C5A059",
        "gold-light": "#D4B76A",
        "gold-dark": "#A68A45",
        "ocean-blue": "#005b96",
        luxury: {
          dark: "#121212",
          card: "#1F1F1F",
          gold: "#D4AF37",
          text: "#FFFFFF",
          cream: "#F3E5AB",
          border: "#2A2A2A",
        },
        light: {
          sidebar: "#001529",
          background: "#F0F2F5",
          cardBg: "#FFFFFF",
          text: "#2D3748",
          textSecondary: "#718096",
          borderLight: "#E2E8F0",
          accentBlue: "#0050B3",
        },
        dataViz: {
          blue: "#0050B3",
          orange: "#FF7A45",
          teal: "#0891B2",
          purple: "#7C3AED",
        },
        obsidian: {
          DEFAULT: "#05090F",
          card: "#0B1120",
          deep: "#030509",
          border: "#1F2937",
          surface: "#111827",
        },
        neon: {
          cyan: "#06B6D4",
          "cyan-light": "#22D3EE",
          "cyan-dim": "#0891B2",
          "cyan-glow": "rgba(6,182,212,0.15)",
        },
        "cyan-white": "#E0F2FE",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config
