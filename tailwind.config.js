/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F5EFEB',
          300: '#ECE2D8',
          400: '#DECFC1'
        },
        beige: {
          50: '#FAF7F2',
          100: '#F5EBE1',
          200: '#EBD9CC',
          300: '#DFC2AE',
          400: '#D0A88F',
          500: '#BA8D72'
        },
        rose: {
          50: '#FCF7F7',
          100: '#F9EAEA',
          200: '#F2D3D4',
          300: '#E5ADB0',
          400: '#D68C90',
          500: '#C86D73',
          600: '#AE4E55',
          700: '#8C383E'
        },
        charcoal: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          400: '#737373',
          600: '#404040',
          700: '#333333',
          800: '#262626',
          900: '#1A1A1A',
          950: '#111111'
        },
        gold: {
          50: '#FCF9F0',
          100: '#F8F1DD',
          200: '#EEDDAF',
          300: '#E4CA80',
          400: '#DDBB5E',
          500: '#C5A059',
          600: '#B08B42',
          700: '#8E6E2E',
          800: '#715622'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 30px -5px rgba(31, 31, 31, 0.06), 0 4px 10px -2px rgba(31, 31, 31, 0.03)',
        'floating': '0 20px 40px -10px rgba(31, 31, 31, 0.1), 0 8px 16px -4px rgba(31, 31, 31, 0.05)',
        'gold': '0 8px 25px -4px rgba(197, 160, 89, 0.25)',
      }
    },
  },
  plugins: [],
}
