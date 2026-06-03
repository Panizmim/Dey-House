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
          DEFAULT: '#801A00',
          hover:   '#A02424',
          light:   '#FDF0F0',
          border:  '#F0D5D5',
        },
        neutral: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#EFEFEF',
          300: '#E0E0E0',
          500: '#717171',
          700: '#404040',
          900: '#171717',
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        full: '9999px',
        card: '8px',
        chip: '20px',
        btn:  '8px',
      },
      fontSize: {
        xs:    ['12px', { lineHeight: '1.5' }],
        sm:    ['13px', { lineHeight: '1.6' }],
        base:  ['14px', { lineHeight: '1.7' }],
        body:  ['16px', { lineHeight: '1.5' }],
        lg:    ['18px', { lineHeight: '1.4' }],
        xl:    ['22px', { lineHeight: '1.3' }],
        '2xl': ['28px', { lineHeight: '1.2' }],
        '3xl': ['36px', { lineHeight: '1.1' }],
        hero:  ['clamp(28px,4vw,52px)', { lineHeight: '1.1' }],
      },
      fontFamily: {
        sans:  ['YekanBakh', 'Tahoma', 'sans-serif'],
        yekan: ['YekanBakh', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 1px 4px rgba(0,0,0,0.06)',
        hover: '0 6px 24px rgba(0,0,0,0.10)',
        modal: '0 16px 48px rgba(0,0,0,0.16)',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}

export default config
