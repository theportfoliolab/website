import * as React from "react"

export type ThemePreference = "light" | "dark" | "auto"
export type ResolvedTheme = "light" | "dark"

const THEME_STORAGE_KEY = "tpl-theme"
const DEFAULT_THEME: ThemePreference = "auto"
const AUTO_DARK_START_HOUR = 18
const AUTO_DARK_END_HOUR = 6

type ThemeContextValue = {
    theme: ThemePreference
    resolvedTheme: ResolvedTheme
    setTheme: (theme: ThemePreference) => void
    toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function resolveTheme(theme: ThemePreference): ResolvedTheme {
    if (theme === "auto") {
        const hour = new Date().getHours()
        const isDark = hour >= AUTO_DARK_START_HOUR || hour < AUTO_DARK_END_HOUR
        return isDark ? "dark" : "light"
    }
    return theme
}

function applyResolvedTheme(theme: ResolvedTheme) {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.dataset.theme = theme
}

function getInitialTheme(): ThemePreference {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "light" || stored === "dark" || stored === "auto") {
        return stored
    }
    if (stored === "system") return "auto"
    return DEFAULT_THEME
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = React.useState<ThemePreference>(() => getInitialTheme())
    const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(() => resolveTheme(getInitialTheme()))

    React.useEffect(() => {
        const nextResolved = resolveTheme(theme)
        setResolvedTheme(nextResolved)
        applyResolvedTheme(nextResolved)
        window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    }, [theme])

    React.useEffect(() => {
        if (theme !== "auto") return
        const interval = window.setInterval(() => {
            const nextResolved = resolveTheme("auto")
            setResolvedTheme(nextResolved)
            applyResolvedTheme(nextResolved)
        }, 60_000)
        return () => window.clearInterval(interval)
    }, [theme])

    const setTheme = React.useCallback((nextTheme: ThemePreference) => {
        setThemeState(nextTheme)
    }, [])

    const toggleTheme = React.useCallback(() => {
        setThemeState((current) => {
            if (current === "auto") return "dark"
            if (current === "dark") return "light"
            return "auto"
        })
    }, [])

    const contextValue = React.useMemo(
        () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
        [theme, resolvedTheme, setTheme, toggleTheme]
    )

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = React.useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
