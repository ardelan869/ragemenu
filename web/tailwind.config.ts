import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        signpainter: ['Signpainter', 'sans-serif'],
        chalet: ['Chalet Paris', 'sans-serif']
      },
      backgroundImage: {
        'header-gradient':
          'linear-gradient(103deg, #093A76 29.51%, #2B66B2 70.49%)',
        'description-gradient':
          'linear-gradient(180deg, #0A0A0A 0%, rgba(10, 10, 10, 0.47) 100%)',
        'selected-item-gradient':
          'linear-gradient(90deg, #FFF 0%, rgba(255, 255, 255, 0.70) 100%)'
      }
    }
  },
  plugins: []
} as Config;
