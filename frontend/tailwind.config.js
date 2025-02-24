module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'grid': "url('/grid.svg')",
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        'spaceBlack': '#0a0c1b',
        'galaxyBlue': '#1a1c3a',
        'stellarPurple': '#7c3aed',
        'stellarWhite': 'rgba(255, 255, 255, 0.9)',
        'stellarGray': 'rgba(255, 255, 255, 0.6)'
      }
    },
  },
  plugins: [],
}