/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00d4ff',
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e7ff',
          300: '#66dbff',
          400: '#33cfff',
          500: '#00d4ff',
          600: '#00a8cc',
          700: '#007d99',
          800: '#005266',
          900: '#002633',
        },
        dark: {
          primary: '#0a0e27',
          secondary: '#1a1f3a',
          tertiary: '#252b4a',
          card: 'rgba(26, 31, 58, 0.8)',
        },
        text: {
          primary: '#ffffff',
          secondary: '#8b92b0',
          muted: '#5a6080',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #7c3aed 0%, #00d4ff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.5)',
        'glow-cyan-strong': '0 0 40px rgba(0, 212, 255, 0.8)',
        'glow-blue': '0 0 20px rgba(0, 153, 255, 0.5)',
      },
    },
  },
  plugins: [],
}