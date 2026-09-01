/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyber: {
          950: '#030b1a',
          900: '#071526',
          800: '#0d1d31',
          700: '#11273d',
          600: '#1d3b58',
          500: '#1f8cff',
          400: '#49c4ff',
          300: '#9ae6ff',
          200: '#aed8ff',
          100: '#dfeaff',
        },
        accent: {
          purple: '#8b5cf6',
          cyan: '#22d3ee',
          green: '#22c55e',
          amber: '#f59e0b',
          red: '#f87171',
        },
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(73,196,255,0.35),0 0 40px rgba(73,196,255,0.18)',
        panel: '0 20px 60px rgba(2, 8, 23, 0.45)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
