
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4E77E4", // base color for buttons etc.
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#FBCB0A",
          foreground: "#1E293B"
        },
        accent: "#FF5C8D",
        muted: "#8892B0",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        danger: "#EF4444",
        success: "#10B981",
        neutral: "#F1F5F9",
        dark: "#1E293B"
      }
    }
  },
  plugins: []
};

export default config;
