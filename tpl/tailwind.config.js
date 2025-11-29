module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: { extend: {
            fontFamily: {
                serif: ['"Merriweather"', "serif"]
            }
        } },
    plugins: [require("@tailwindcss/typography")],
}