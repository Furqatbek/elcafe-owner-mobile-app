/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
        critical: '#DC2626',
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
      },
    },
  },
  plugins: [],
};
