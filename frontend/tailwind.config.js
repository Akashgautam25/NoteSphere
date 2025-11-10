/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'primary-blue': '#3A82F6',
        'secondary-purple': '#6C63FF',
        'text-primary': '#111827',
        'text-secondary': '#4B5563',
        'border-light': '#E5E7EB',
        'surface-light': '#F8F9FA',
      },
    },
  },
  plugins: [],
}