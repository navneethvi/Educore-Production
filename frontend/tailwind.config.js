/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    backgroundImage: {
      'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
    },
    fontFamily: {
      'reem-kufi': ['Reem Kufi', 'sans-serif'],
    },
    keyframes: {
      shimmer: {
        "0%": { left: "-150%" },
        "100%": { left: "150%" },
      },
    },
    animation: {
      shimmer: "shimmer 2s infinite",
    },
  },
};
export const plugins = [];
