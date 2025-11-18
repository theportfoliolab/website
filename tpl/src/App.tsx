import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Articles from "./pages/Articles.tsx"
import Tutorials from "./pages/Tutorials.tsx"
import Contact from "./pages/Contact.tsx"
import { Header } from "@/components/ui/header.tsx";
import Footer from "@/components/ui/footer.tsx";

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>


            {/* Route definitions */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/tutorials/:slug" element={<Tutorials />} />
            </Routes>
            {/* Main content grows to fill space */}
            <main className="flex-1">

            </main>

            <Footer/>
        </div>
    )
}

export default App