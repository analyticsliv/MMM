import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #01A2FC 100%, #36D2EF 100%)',
      },
      colors:{
        background:"#F0F0F9",
        foreground:"#020044",
        homeGray:"#EDF4FF",
        primary:"#30486A",
        homebg:"#FFF4EE",
        textcolor:"#202020",
        black: '#000',
        white: '#FFFFFF',
        gray: {
          default:'#030822',
          100:"#F9F9FB",
          200:"#FAF9F8",
          300:"#F4F5F6",
          400:"#E9E9E9",
          500:"#C3C9D6",
          600:"#8991A4",
          700:"#030822"
        },
      },
      fontFamily: {
        jost : ['Jost', 'sans-serif'],
      },
      borderRadius: {
        lg: "20px",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config