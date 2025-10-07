module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        biznet: {
          50: '#f3f8ff',
          100: '#e6f0ff',
          500: '#0066cc',
          700: '#004c99',
          900: '#003366'
        }
      }
    }
  },
  plugins: []
}
