import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Articles from "./pages/Articles.tsx"
import Tutorials from "./pages/Tutorials.tsx"
import Contact from "./pages/Contact.tsx"
import { Header } from "@/components/ui/header.tsx";

function App() {
    return (
        <div>
            <Header/>

            {/* Route definitions */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </div>
    )
}

export default App