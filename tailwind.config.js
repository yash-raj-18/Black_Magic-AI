/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#12121a',
        'surface-2': '#1a1a28',
        border: '#2a2a3a',
        primary: '#00d4ff',
        'primary-dim': '#0094b8',
        accent: '#ff3e8a',
        'accent-dim': '#c02a66',
        neon: {
          blue: '#00d4ff',
          pink: '#ff3e8a',
          green: '#00ff88',
        },
        dim: '#8888a0',
        bright: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 1s infinite',
        'float-slow': 'float 6s ease-in-out 0.5s infinite',
        'gradient': 'gradientShift 8s ease infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
};
