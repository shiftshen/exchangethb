import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff9e6',
          100: '#fff0bf',
          200: '#ffe082',
          300: '#ffd24d',
          400: '#f5c51a',
          500: '#f0b90b',
          600: '#d89f00',
          700: '#a77600',
          800: '#6f4f00',
          900: '#2b1c00'
        },
        accent: '#f0b90b',
        ink: '#f5f5f5',
        surface: {
          950: '#0b0e11',
          900: '#13171d',
          850: '#171b22',
          800: '#1e2329',
          700: '#2b3139'
        }
      },
      boxShadow: {
        soft: '0 20px 60px rgba(0,0,0,0.28)',
        glow: '0 0 0 1px rgba(240,185,11,0.22), 0 18px 60px rgba(0,0,0,0.36)'
      }
    }
  },
  plugins: []
} satisfies Config;
