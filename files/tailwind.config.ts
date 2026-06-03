import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red:          '#801A00',
          'red-hover':  '#9C2200',
          'red-dark':   '#5C1300',
          'red-bg':     '#F9F0F0',
          'red-border': 'rgba(128,26,0,0.2)',
        },
        gray: {
          50:  '#F7F7F7',
          100: '#F0F0F0',
          200: '#D8D8D8',
          300: '#B0B0B0',
          500: '#6B6B6B',
          700: '#3D3D3D',
          900: '#1A1A1A',
        },
      },
      fontFamily: {
        sans:  ['YekanBakh', 'Tahoma', 'sans-serif'],
        yekan: ['YekanBakh', 'Tahoma', 'sans-serif'],
      },
      fontSize: {
        'xs':  ['11px', { lineHeight: '1.4' }],
        'sm':  ['13px', { lineHeight: '1.5' }],
        'base':['15px', { lineHeight: '1.6' }],
        'md':  ['17px', { lineHeight: '1.6' }],
        'lg':  ['20px', { lineHeight: '1.4' }],
        'xl':  ['24px', { lineHeight: '1.3' }],
        '2xl': ['32px', { lineHeight: '1.15' }],
        '3xl': ['40px', { lineHeight: '1.1' }],
        '4xl': ['56px', { lineHeight: '1.05' }],
      },
      letterSpacing: {
        tight:   '-0.03em',
        wide:    '0.08em',
        wider:   '0.14em',
        widest:  '0.22em',
      },
      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '14px',
        xl:   '20px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 4px rgba(0,0,0,0.06)',
        md: '0 4px 16px rgba(0,0,0,0.08)',
        lg: '0 8px 32px rgba(0,0,0,0.12)',
        xl: '0 16px 48px rgba(0,0,0,0.16)',
      },
      spacing: {
        '18': '72px',
        '22': '88px',
        '30': '120px',
      },
      maxWidth: {
        container: '1280px',
      },
      height: {
        nav:    '72px',
        topbar: '40px',
      },
      zIndex: {
        nav:     '100',
        modal:   '200',
        toast:   '300',
        tooltip: '400',
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}

export default config
