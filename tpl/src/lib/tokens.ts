// src/lib/tokens.ts
export const tokens = {
    colors: {
        primary: {
            light: { bg: "#FDFBF7", fg: "#0E0C21", accent: "#3FC083", link: "#0A95FF" },
            dark: { bg: "#0E0C21", fg: "#FDFBF7", accent: "#3FC083", link: "#0A95FF" },
        },
        secondary: {
            light: { bg: "#EEEFE6", fg: "#464F54", accent: "#98BD92", link: "#91A5F7" },
            dark: { bg: "#464F54", fg: "#EEEFE6", accent: "#98BD92", link: "#91A5F7" },
        },
    },

    typography: {
        pageTitle: { fontSize: "3.5rem", fontWeight: 800, fontStyle: "normal", letterSpacing: "normal", textTransform: "none", opacity: 1, lineHeight: 1.1 },
        subheading: { fontSize: "3rem", fontWeight: 500, fontStyle: "normal", letterSpacing: "normal", textTransform: "none", opacity: 1, lineHeight: 1.2 },
        kicker: { fontSize: "0.8rem", fontWeight: 400, fontStyle: "normal", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6, lineHeight: 1.4 },
        sectionTitle: { fontSize: "2.6rem", fontWeight: 700, fontStyle: "normal", letterSpacing: "normal", textTransform: "none", opacity: 1, lineHeight: 1.25 },
        lead: { fontSize: "1.6rem", fontWeight: 300, fontStyle: "italic", letterSpacing: "normal", textTransform: "none", opacity: 0.7, lineHeight: 1.6 },
        body: { fontSize: "1rem", fontWeight: 400, fontStyle: "normal", letterSpacing: "normal", textTransform: "none", opacity: 1, lineHeight: 1.7 },
        code: { fontSize: "1rem", fontWeight: 400, fontStyle: "normal", fontFamily: "monospace", letterSpacing: "normal", textTransform: "none", opacity: 0.7, lineHeight: 1.6 },
        tiny: { fontSize: "0.8rem", fontWeight: 500, fontStyle: "normal", letterSpacing: "normal", textTransform: "none", opacity: 0.6, lineHeight: 1.4 },
    },

    spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
    },

    radius: {
        sm: "6px",
        md: "12px",
        lg: "24px",
    },

    shadow: {
        sm: "0 2px 6px rgba(0, 0, 0, 0.04)",
        md: "0 8px 24px rgba(0, 0, 0, 0.06)",
    },

    shadowDark: {
        sm: "0 2px 6px rgba(0, 0, 0, 0.4)",
        md: "0 8px 24px rgba(0, 0, 0, 0.5)",
    },
} as const;
