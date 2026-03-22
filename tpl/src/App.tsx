// src/App.tsx
import { Routes, Route } from "react-router-dom"
import "@fontsource/merriweather/700.css"
import "@fontsource/merriweather/300.css"

import Home from "./pages/Home"
import About from "./pages/About"
import Articles from "./pages/Articles"
import Tutorials from "./pages/Tutorials"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"

import { MainLayout } from "@/components/layout/MainLayout"
import { DocumentMetadata } from "@/components/DocumentMetadata"
import { ScrollToTop } from "@/components/ScrollToTop"

function App() {
    return (
        <MainLayout>
            <DocumentMetadata />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:slug" element={<Articles />} />

                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/tutorials/:slug" element={<Tutorials />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </MainLayout>
    )
}

export default App
