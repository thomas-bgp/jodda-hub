import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Paleta institucional BGP; indigo/purple remapeados para rebrand sem tocar cada tela.
      colors: {
        primary: {
          50: "#F4F7F7",
          100: "#E3E9EA",
          200: "#C9D8DA",
          300: "#ABC7C9",
          400: "#7FA3AA",
          500: "#4F7A86",
          600: "#244C5A",
          700: "#20424E",
          800: "#1C3842",
          900: "#1C2B31",
          950: "#111C20",
        },
        indigo: {
          50: "#F4F7F7",
          100: "#E3E9EA",
          200: "#C9D8DA",
          300: "#ABC7C9",
          400: "#7FA3AA",
          500: "#4F7A86",
          600: "#244C5A",
          700: "#20424E",
          800: "#1C3842",
          900: "#1C2B31",
          950: "#111C20",
        },
        purple: {
          50: "#F4F7F7",
          100: "#E3E9EA",
          200: "#C9D8DA",
          300: "#ABC7C9",
          400: "#7FA3AA",
          500: "#4F7A86",
          600: "#244C5A",
          700: "#20424E",
          800: "#1C3842",
          900: "#1C2B31",
          950: "#111C20",
        },
      },
    },
  },
  plugins: [],
};
export default config;
