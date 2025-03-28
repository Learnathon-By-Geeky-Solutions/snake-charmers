/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Add Arial as the default sans-serif font
      },
      colors:{
        'light-green-1': '#42D674',
        'light-green-2':'#80EF80',
      },
      keyframes: {
        'moving-line': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(500%)' },
        },
        'progress-beam': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        }
      },
      animation: {
        'moving-line': 'moving-line 2s linear infinite',
        'progress-beam': 'progress-beam 2s linear infinite',

      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light'],
  },
};
