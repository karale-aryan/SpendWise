/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#1B4332', // Dark Green
                    light: '#2D6A4F',   // Soft Green
                    accent: '#95D5B2',  // Light Green Accent
                },
                surface: '#FFFFFF',
                background: '#F8F9FA',
            }
        },
    },
    plugins: [],
}
