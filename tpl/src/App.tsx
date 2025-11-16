import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Articles from "./pages/Articles.tsx"
import Tutorials from "./pages/Tutorials"

function App() {
    return (
        <div>
            {/* Simple nav bar */}
            <nav className="flex gap-4 p-4 border-b">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/articles">Articles</Link>
                <Link to="/tutorials">Tutorials</Link>
            </nav>

            {/* Route definitions */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/tutorials" element={<Tutorials />} />
            </Routes>
        </div>
    )
}

export default App