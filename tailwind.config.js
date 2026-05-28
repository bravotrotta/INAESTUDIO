export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'studio-bg': '#FAD2E1',
        'studio-primary': '#770523',
        'studio-accent-green': '#D0D996',
        'studio-accent-orange': '#DD4E28',
        'studio-white': '#FFFFFF',
        'studio-text-dark': '#2D1B1B',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
