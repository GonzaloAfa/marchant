/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Azul académico con mejor contraste (WCAG AA)
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#1976d2', // Mejor contraste
          600: '#1565c0', // Mejor contraste
          700: '#0d47a1', // Mejor contraste
          800: '#0a3d8a',
          900: '#083370',
        },
        // Secondary: Dorado con mejor contraste
        secondary: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#f57c00', // Mejor contraste
          600: '#e65100', // Mejor contraste
          700: '#bf360c',
          800: '#a0260a',
          900: '#7f1d08',
        },
        // Gray scale mejorado para mejor contraste
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
