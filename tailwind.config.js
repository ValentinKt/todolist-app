/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './utils/**/*.{js,ts}',  // Added utils directory
    './app.vue',
    './error.vue',  // Added error page
    './nuxt.config.{js,ts}'  // Added Nuxt config file
  ],
  darkMode: 'class',  // Enables dark mode with class strategy
  theme: {
    extend: {
      screens: {
        xs: '475px',  // Added extra small screen breakpoint
        pwa: { raw: "(display-mode: standalone)" },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        slate: {
          500: "hsl(240, 3%, 55%)",
          600: "#6a6a71",
          700: "#1e1e25",
          800: "#101014",
          900: "#0b0b0d",
        },
        brand: {
          50: "#ebfef7",
          100: "#cefdea",
          200: "#a1f9da",
          300: "#64f1c8",
          400: "#27e0b1",
          500: "#02e1af",
          600: "#00a27f",
          700: "#008269",
          800: "#006654",
          900: "#005447",
        },
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
        slideDownAndFade: {
          from: { opacity: 0, transform: "translateY(-2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: "translateY(2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: "translateX(-2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "shine-r": {
          "0%": { right: "100%", opacity: 0 },
          "50%": { opacity: 1 },
          "90%": { right: "-10%" },
          "100%": { opacity: 0 },
        },
        "shine-b": {
          "0%": { bottom: "100%", opacity: 0 },
          "50%": { opacity: 1 },
          "90%": { bottom: "-10%" },
          "100%": { opacity: 0 },
        },
        "shine-l": {
          "0%": { left: "100%", opacity: 0 },
          "50%": { opacity: 1 },
          "90%": { left: "-10%" },
          "100%": { opacity: 0 },
        },
        "shine-t": {
          "0%": { top: "100%", opacity: 0 },
          "50%": { opacity: 1 },
          "90%": { top: "-10%" },
          "100%": { opacity: 0 },
        },
        // Added pulse animation for loading states
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade: "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Added shine animations
        'shine-right': 'shine-r 2s infinite',
        'shine-bottom': 'shine-b 2s infinite',
        'shine-left': 'shine-l 2s infinite',
        'shine-top': 'shine-t 2s infinite',
      },
      // Added useful utilities
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(2, 225, 175, 0.4)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.brand.500'),
              '&:hover': {
                color: theme('colors.brand.600'),
              },
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.slate.400'),
            a: {
              color: theme('colors.brand.400'),
              '&:hover': {
                color: theme('colors.brand.300'),
              },
            },
            h1: {
              color: theme('colors.white'),
            },
            h2: {
              color: theme('colors.white'),
            },
            h3: {
              color: theme('colors.white'),
            },
            h4: {
              color: theme('colors.white'),
            },
            code: {
              color: theme('colors.white'),
            },
            strong: {
              color: theme('colors.white'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("tailwindcss-easing"),
    require("@tailwindcss/typography"),
    // Optional plugin format if you need custom configuration
    // function({ addUtilities }) {
    //   const newUtilities = {
    //     '.text-shadow-brand': {
    //       textShadow: '0 0 5px rgba(2, 225, 175, 0.5)',
    //     },
    //   }
    //   addUtilities(newUtilities)
    // }
  ],
};
