import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primární burgundy/maroon (rozšířená paleta + DEFAULT pro zpětnou kompatibilitu)
        burgundy: {
          DEFAULT: '#340C0D', // bg-burgundy bude fungovat jako dřív
          50: '#FCF3F3',
          100: '#F9E7E7',
          200: '#F2CFCF',
          300: '#E8A7A8',
          400: '#DC7A7B',
          500: '#CC5556',
          600: '#B13D3F',
          700: '#8B2F31',
          800: '#5D1F20',
          900: '#340C0D',
          950: '#2A0A0B',
          light: '#5D1F20',
          dark: '#2A0A0B',
        },
        maroon: '#5D1F20',
        terracotta: '#8B4755',

        // Neutrální
        ivory: '#e8e1d7',
        'warm-beige': '#D4C4B0',
        'light-taupe': '#C9B8A8',
        'soft-cream': '#F5F1ED',

        // Akcenty
        'dusty-rose': '#B89B9B',
        'muted-mauve': '#A07982',

        // Systémové
        success: '#4A7C59',
        warning: '#D4A574',
        error: '#8B3A3A',
        info: '#6B7A8F',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': ['3rem', { lineHeight: '1.2' }],
        'h1-mobile': ['2rem', { lineHeight: '1.2' }],
        'h2': ['2.25rem', { lineHeight: '1.2' }],
        'h2-mobile': ['1.75rem', { lineHeight: '1.2' }],
        'h3': ['1.75rem', { lineHeight: '1.2' }],
        'h3-mobile': ['1.5rem', { lineHeight: '1.2' }],
        'h4': ['1.5rem', { lineHeight: '1.2' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'light': '0 2px 4px rgba(52, 12, 13, 0.08)',
        'medium': '0 4px 12px rgba(52, 12, 13, 0.12)',
        'heavy': '0 8px 24px rgba(52, 12, 13, 0.16)',
        'card-hover': '0 12px 32px rgba(52, 12, 13, 0.20)',
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'modal-in': 'modal-in 0.3s ease-out',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
