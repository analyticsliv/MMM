/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    screens:{
      'xs': '420px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1100px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px'
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
     
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      

    },
    colors:{
      background:"#FAF9F8",
      foreground:"#020044",
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
      primary:{
        DEFAULT:'#020044',
        100:'#E6E6ED',
        200:'#CCCCDA',
        300:'#B4B3C7',
        400:'#9A99B4',
        500:'#67668F',
        600:'#4E4D7D',
        700:'#353369',
        800:'#1C1A57',
      },
      secondary:{
        DEFAULT:'#11DCAD',
        100:'#E8FCF7',
        200:'#CFF8EF',
        300:'#B8F5E7',
        400:'#A0F1DE',
        500:'#87EDD5',
        600:'#70EACE',
        700:'#59E7C6',
        800:'#41E3BD',
        900:'#29E0B6',
      },
      yellow:{
        default:"#FFCB47"
      },
      red:{
        default:" #EF476F",
        100:'#FEEDF1',
        200:'#FCDAE2',
        300:'#FBC8D4',
        400:'#F9B5C5',
        500:'#F6A2B6',
        600:'#F591A9',
        700:'#F47F9B',
        800:'#F26C8C',
        900:'#F15A7E',
      },
      orange:{
        default:"#FF9F47"
      },
      blue:{
        default:"#8367C7"
      }, 

      bannerOverlay: "rgba(0, 0, 0, 0.15)"
    
    },
    fontFamily: {
      jost : ['Jost', 'sans-serif'],
    },
    fontSize: {
      'xs': '1rem',
      'sm': '1.2rem',
      'base': '1.4rem',
      'lg': '1.6rem',
      'xl': '1.8rem',
      '2xl': '2.4rem',
      '3xl': '2.8rem',
      '4xl': '3.2rem',
      '5xl': '4rem',
      '6xl': '5.2rem',
      '7xl': '6.4rem',
    },
    fontWeight: {
      'light': 300,
      'normal': 400,
      'medium': 500,
      'semibold': 600,
      'bold': 700
    }
  },
  plugins: [require("tailwindcss-animate")],
}