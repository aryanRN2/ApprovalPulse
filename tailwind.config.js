/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0F0F0F',
        accent: '#1D4ED8',
        'accent-light': '#EFF6FF',
        border: '#E5E5E5',
        muted: '#6B7280',
        surface: '#F9FAFB',
        danger: '#DC2626',
        warning: '#D97706',
        success: '#16A34A',
      },
      fontSize: {
        xs: ['14px', '20px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['28px', '36px'],
        '3xl': ['40px', '48px'],
      },
      spacing: {
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '2.5': '20px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '8': '64px',
        '10': '80px',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '4px',
        md: '4px',
        lg: '4px',
        xl: '4px',
      },
      maxWidth: {
        content: '1100px',
      },
    },
  },
  plugins: [],
}
