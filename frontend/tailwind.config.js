/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme (default)
        bg: {
          primary: '#0a0a0a',
          secondary: '#141414',
          card: '#1a1a1a',
        },
        accent: {
          primary: '#e50914',
          secondary: '#f6f6f6',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
          muted: '#808080',
        },
        border: {
          DEFAULT: '#2a2a2a',
          light: '#3a3a3a',
        },
        // Light theme
        'bg-light': {
          primary: '#ffffff',
          secondary: '#f5f5f5',
        },
        'accent-light': {
          primary: '#d81f26',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
