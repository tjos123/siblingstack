/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#1C1815",
        surface: "#25201A",
        surface2: "#2E2820",
        ink: "#F3ECE0",
        "ink-muted": "#B5AA9A",
        childA: "#D98C5F",
        "childA-dim": "#3A2E22",
        childB: "#5FA39A",
        "childB-dim": "#1F2E2A",
        conflict: "#E54B4B",
        "conflict-dim": "#3A1F1C",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
