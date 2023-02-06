/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        loader: "loader 1.2s linear infinite",
      },
    },
    fontFamily: {
      Inter: ["Inter", "Arial", "sans-serif"],
      OpenSans: ["OpenSans", "Arial", "sans-serif"],
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require("@tailwindcss/forms")],
};
