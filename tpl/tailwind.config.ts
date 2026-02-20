import typography from "@tailwindcss/typography";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    plugins: [typography],
} as const;
