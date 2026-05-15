import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        primary: "#FFF2C3",
        primaryBlue: "#03a9f4a8",
        purle:"#3f51b5",
        secondary: "#FFE699",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        rolling: "rolling 0.1s linear infinite",
        gradient: 'pulseGradient 3s ease infinite',
        slideIn: 'textSlideIn 1s ease-out',
        fadeIn: 'fadeIn 1s ease-out forwards',
        zoomIn: 'zoomIn 0.8s ease-out forwards',
        zoomin: 'zoom-in 1s ease-in-out 0.25s 1',
      },
      keyframes: {
        rolling: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        pulseGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
      },
        textSlideIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          '0%': { opacity: "0", transform: 'translateY(20px)' },
          '100%': { opacity: "1", transform: 'translateY(0)' },
      },
      zoomIn: {
        '0%': { opacity: "0", transform: 'scale(0.5)' },
        '100%': { opacity: "1", transform: 'scale(1)' },
    },
    "zoom-in": {
            "0%": {
              opacity: "0",
              transform: "scale3d(0.3, 0.3, 0.3)",
            },
            "80%": {
              opacity: "0.8",
              transform: "scale3d(1.1, 1.1, 1.1)",
            },
            "100%": {
              opacity: "1",
            },
          },
      },
    },
  },
  plugins: [],
};
export default config;
