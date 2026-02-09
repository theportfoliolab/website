module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: { extend: {
            fontFamily: {
                serif: ['"Merriweather"', "serif"]
            }
        } },
    plugins: [require("@tailwindcss/typography")],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // your source files
    ],
    theme: {
        extend: {
            colors: {
                brandGreen: "#99ff00", // your green
            },
        },
    },
    plugins: [],
};
