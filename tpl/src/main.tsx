import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { StrictMode } from "react"
import "./index.css"
import App from "./App"
import { ThemeProvider } from "@/lib/theme"

const container = document.getElementById("root")!
const app = (
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
)

if (container.hasChildNodes()) {
    hydrateRoot(container, app)
} else {
    createRoot(container).render(app)
}
