/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        'glass-white': 'rgba(255, 255, 255, 0.6)',
        'glass-border': 'rgba(255, 255, 255, 0.3)',
        'glass-shadow': 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
