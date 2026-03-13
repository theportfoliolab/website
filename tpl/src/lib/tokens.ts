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
        destructive: {
            light: { bg: "#464F54", fg: "#FDFBF7" },
            dark: { bg: "#EEEFE6", fg: "#0E0C21" },
        },
        semantic: {
            light: {
                background: "#FDFBF7",
                foreground: "#0E0C21",
                card: "#FDFBF7",
                cardForeground: "#0E0C21",
                popover: "#FDFBF7",
                popoverForeground: "#0E0C21",
                primary: "#3FC083",
                primaryForeground: "#0E0C21",
                secondary: "#EEEFE6",
                secondaryForeground: "#464F54",
                muted: "#EEEFE6",
                mutedForeground: "#464F54",
                accent: "#3FC083",
                accentForeground: "#0E0C21",
                border: "#464F54",
                input: "#464F54",
                ring: "#3FC083",
            },
            dark: {
                background: "#0E0C21",
                foreground: "#FDFBF7",
                card: "#0E0C21",
                cardForeground: "#FDFBF7",
                popover: "#0E0C21",
                popoverForeground: "#FDFBF7",
                primary: "#3FC083",
                primaryForeground: "#FDFBF7",
                secondary: "#464F54",
                secondaryForeground: "#EEEFE6",
                muted: "#464F54",
                mutedForeground: "#EEEFE6",
                accent: "#3FC083",
                accentForeground: "#FDFBF7",
                border: "#EEEFE6",
                input: "#EEEFE6",
                ring: "#3FC083",
            },
        },
    },

    typography: {
        pageTitle: { fontSize: "4.5rem", fontWeight: 800, fontStyle: "normal", letterSpacing: "normal", textTransform: "none", opacity: 1, lineHeight: 1.1 },
        subheading: { fontSize: "3.2rem", fontWeight: 500, fontStyle: "normal", letterSpacing: "normal", textTransform: "none", opacity: 1, lineHeight: 1.2 },
        kicker: { fontSize: "0.8rem", fontWeight: 400, fontStyle: "normal", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6, lineHeight: 1.4 },
        sectionTitle: { fontSize: "2.6rem", fontWeight: 700, fontStyle: "normal", letterSpacing: "normal", textTransform: "none", opacity: 1, lineHeight: 1.25 },
        lead: { fontSize: "1.6rem", fontWeight: 300, fontStyle: "italic", letterSpacing: "normal", textTransform: "none", opacity: 0.7, lineHeight: 1.6 },
        body: { fontSize: "1rem", fontWeight: 400, fontStyle: "normal", letterSpacing: "normal", textTransform: "none", opacity: 1, lineHeight: 1.7 },
        code: { fontSize: "1rem", fontWeight: 400, fontStyle: "normal", fontFamily: "monospace", letterSpacing: "normal", textTransform: "none", opacity: 0.7, lineHeight: 1.6 },
        tiny: { fontSize: "0.8rem", fontWeight: 500, fontStyle: "normal", letterSpacing: "normal", textTransform: "none", opacity: 0.6, lineHeight: 1.4 },
    },
    typographyMobile: {
        pageTitle: { fontSize: "2.1rem" },
        subheading: { fontSize: "1.55rem" },
        sectionTitle: { fontSize: "1.35rem" },
        lead: { fontSize: "1.1rem" },
        body: { fontSize: "0.95rem" },
        tiny: { fontSize: "0.75rem" },
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
