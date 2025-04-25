/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3490dc",
        warning: "#FFC107",
        "background-color": "#F5FAFF",
        "card-color": "#E1EDFC",
        "divider-color": "#C0C0C0",
        "footer-color": "#4D9FFF",
        "link-color-footer": "#1E4F94",
        "link-color-footer-hover": "#4478c0",
        "primary-color": "#1677ff",
        "text-color": "#1E4F94",
        "text-color-hover": "#4478c0",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "gray-300 transparent",
        },
        "scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "2px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#1677ff",
            borderRadius: "20px",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
