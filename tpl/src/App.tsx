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
      {/* Centered wrapper with max width applied to header, main and footer */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-5xl px-6">
          <Header />
        </div>
      </div>

      <main className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-5xl px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<Articles />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/tutorials/:slug" element={<Tutorials />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/tutorials/*" element={<Tutorials />} />
          </Routes>
        </div>
      </main>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-5xl px-6">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App