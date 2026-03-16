/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                "primary": "#1a355b",
                "accent": "#f97316",
                "background-light": "#f8fafc",
                "background-dark": "#0f172a",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.375rem", "lg": "0.75rem", "xl": "1rem", "2xl": "1.25rem", "full": "9999px" },
        },
    },
    plugins: [],
};
