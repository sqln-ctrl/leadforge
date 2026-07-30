/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14171F",
          50: "#F4F5F7",
          100: "#E6E8EC",
          200: "#C7CBD4",
          300: "#9AA1B0",
          400: "#6B7280",
          500: "#4B5160",
          600: "#363B48",
          700: "#262A34",
          800: "#1A1D24",
          900: "#14171F",
        },
        forge: {
          50: "#FFF4ED",
          100: "#FFE4D2",
          200: "#FFC5A3",
          300: "#FF9D66",
          400: "#F97331",
          500: "#E8511D",
          600: "#C43F13",
          700: "#9C3110",
          800: "#7A2810",
          900: "#5F2110",
        },
        ember: {
          cold: "#3B82F6",
          cool: "#64748B",
          warm: "#D97706",
          hot: "#E8511D",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(20, 23, 31, 0.04), 0 1px 3px 0 rgba(20, 23, 31, 0.06)",
      },
    },
  },
  plugins: [],
};
