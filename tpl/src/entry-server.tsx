import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router"
import App from "./App"
import { ThemeProvider } from "@/lib/theme"
import { notFoundRoute, prerenderRoutes } from "@/prerender-routes"

export { notFoundRoute, prerenderRoutes }

export function render(url: string) {
    return renderToString(
        <StrictMode>
            <ThemeProvider>
                <StaticRouter location={url}>
                    <App />
                </StaticRouter>
            </ThemeProvider>
        </StrictMode>
    )
}
