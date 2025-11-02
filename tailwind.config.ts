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
        // Primární burgundy/maroon
        burgundy: {
          DEFAULT: '#340C0D',
          light: '#5D1F20',
          dark: '#2A0A0B',
        },
        maroon: '#5D1F20',
        terracotta: '#8B4755',

        // Neutrální
        ivory: '#E9E0D7',
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
    },
  },
  plugins: [],
};

export default config;
