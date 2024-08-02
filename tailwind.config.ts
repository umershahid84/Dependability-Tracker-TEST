import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {

    extend: {
      backgroundColor: {
        // slate-900
        primary: 'rgb(15 23 42)',
        //slate-800
        secondary: 'rgb(30 41 59)',
        //slate-700
        tertiary: 'rgb(51 65 85)',
        //slate-600
        quaternary: 'rgb(71 85 105)',
        // slate-500
        quinary: 'rgb(100 116 139)',
        accent: {
          // SeaTac Green
          primary: 'var(--green)',
        },

      },
      textColor: {
        // gray-200
        primary: 'rgb(229 231 235)',
        // gray-300
        secondary: 'rgb(209 213 219)',
        // gray-400
        tertiary: 'rgb(156 163 175)',
        // gray-500
        muted: 'rgb(107 114 128)',
        // SeaTac Green
        accent: 'var(--green)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: []
};
export default config;
