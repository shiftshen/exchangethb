import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7f5',
          100: '#d7ebe6',
          200: '#b2d9cf',
          300: '#86c1b2',
          400: '#4e9b8a',
          500: '#2c7a6b',
          600: '#1f5f54',
          700: '#184c44',
          800: '#153d37',
          900: '#12332f'
        },
        accent: '#d4a44a',
        ink: '#13211d'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(19,33,29,0.08)'
      }
    }
  },
  plugins: []
} satisfies Config;
