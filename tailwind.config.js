/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vert profond & identitaire — Fil conducteur Saveurs d'Or / AMIGO
        forest: {
          50: '#f0f7f3',
          100: '#dceee3',
          200: '#bddcc9',
          300: '#93c2a6',
          400: '#62a27e',
          500: '#3e8460',
          600: '#2c6b4d',
          700: '#23563e',
          800: '#1d4432',
          900: '#153628',
          950: '#0b1f17', // Deep luxury forest
        },
        // Vert sauge — Surfaces secondaires et zones de respiration
        sage: {
          50: '#f5f8f6',
          100: '#e7efe9',
          200: '#d0dfd4',
          300: '#adc6b4',
          400: '#84a88e',
          500: '#628e6d',
          600: '#4c7255',
          700: '#3d5a44',
          800: '#334938',
          900: '#2b3c30',
          950: '#162119',
        },
        // Crème & ivoire chaleureux — Arrière-plans lumineux et réconfortants
        cream: {
          50: '#fdfcf9', // Ultra clean ivory
          100: '#faf6ee',
          200: '#f4ede0',
          300: '#ebe0cd',
          400: '#dfccb2',
          500: '#cdb393',
          600: '#b89c79',
          700: '#9b7f5e',
          800: '#7c664c',
          900: '#64533e',
          950: '#362b1e',
        },
        // Doré & Ocre — Touches d'accentuation premium & gastronomiques
        gold: {
          50: '#fdfaf2',
          100: '#faf2db',
          200: '#f4e3b3',
          300: '#ebcf83',
          400: '#deb851',
          500: '#cfa035', // Warm antique gold
          600: '#b68328',
          700: '#906220',
          800: '#754d1f',
          900: '#63401e',
          950: '#38220d',
        },
        // Brun chaud & bistre — Typographie secondaire et finitions boisées
        earth: {
          50: '#f8f6f5',
          100: '#ede8e4',
          200: '#ded5ce',
          300: '#c5b6ab',
          400: '#a89485',
          500: '#8e7868',
          600: '#735e50',
          700: '#5c4a3f',
          800: '#42352d',
          900: '#271f1a',
          950: '#17110e',
        },
        // Mapping de compatibilité pour le code existant avec le nouveau vert identitaire
        brand: {
          50: '#f0f7f3',
          100: '#dceee3',
          200: '#bddcc9',
          300: '#93c2a6',
          400: '#62a27e',
          500: '#3e8460',
          600: '#2c6b4d',
          700: '#23563e',
          800: '#1d4432',
          900: '#153628',
          950: '#0b1f17',
        },
        surface: {
          light: '#fbf9f5', // Warm ivory background
          subtle: '#f4ede0',
          card: '#ffffff',
          dark: '#0b1f17',
        },
        accent: {
          amber: '#cfa035',
          rose: '#e11d48',
          sand: '#e8decb',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
        '4/3': '4 / 3',
        '1/1': '1 / 1',
        '16/9': '16 / 9',
      },
      boxShadow: {
        'warm-xs': '0 1px 2px 0 rgba(23, 17, 14, 0.04)',
        'warm-sm': '0 2px 6px -1px rgba(23, 17, 14, 0.06), 0 1px 3px 0 rgba(23, 17, 14, 0.04)',
        'warm-md': '0 6px 18px -2px rgba(23, 17, 14, 0.08), 0 2px 6px -1px rgba(23, 17, 14, 0.04)',
        'warm-lg': '0 12px 30px -4px rgba(23, 17, 14, 0.12), 0 4px 10px -2px rgba(23, 17, 14, 0.05)',
        'warm-xl': '0 20px 40px -6px rgba(23, 17, 14, 0.16), 0 8px 16px -4px rgba(23, 17, 14, 0.06)',
      },
      fontSize: {
        'base': ['1.0625rem', { lineHeight: '1.6' }],
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      }
    },
  },
  plugins: [],
}
