import Footer from './Footer'
import Header from "./Header.jsx";

export default function PageLayout({ children }) {
    return (
        <div className="page_layout">
            <Header />
            <main className="page_content">{children}</main>
            <Footer />
        </div>
    )
}
