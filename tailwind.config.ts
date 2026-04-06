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
        burgundy: {
          DEFAULT: '#4A1520',
          light: '#6B2535',
          dark: '#2A0A0B',
          50: '#FCF3F3',
          100: '#F0D8DB',
          200: '#DDA8AE',
          300: '#C47880',
          400: '#A84E5A',
          500: '#8B3040',
          600: '#6B2535',
          700: '#4A1520',
          800: '#2A0A0B',
          900: '#160508',
          950: '#0A0204',
        },
        maroon: '#6B2535',
        terracotta: '#9B3A4A',

        // Neutrální
        ivory: '#F8F4EF',
        'ivory-warm': '#F2EBE2',
        'warm-beige': '#D4C4B0',
        beige: '#E8DDD2',
        'beige-mid': '#D4C4B0',
        'light-taupe': '#E8DDD2',
        'soft-cream': '#F8F4EF',

        // Text
        'text-dark': '#1C0C0F',
        'text-mid': '#5A3840',
        'text-soft': '#8C6E73',
        accent: '#9B3A4A',

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
        playfair: ['Cormorant Garamond', 'serif'], // alias → sjednoceno s cormorant
        cormorant: ['Cormorant Garamond', 'serif'],
        jost: ['Jost', 'sans-serif'],
        inter: ['Jost', 'sans-serif'], // alias for backward compat
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
        'light': '0 2px 4px rgba(74, 21, 32, 0.08)',
        'medium': '0 4px 12px rgba(74, 21, 32, 0.12)',
        'heavy': '0 8px 24px rgba(74, 21, 32, 0.16)',
        'card-hover': '0 12px 32px rgba(74, 21, 32, 0.20)',
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
