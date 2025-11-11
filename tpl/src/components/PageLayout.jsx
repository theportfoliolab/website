import Footer from './Footer'

export default function PageLayout({ children }) {
    return (
        <div className="page_layout">
            <main className="page_content">{children}</main>
            <Footer />
        </div>
    )
}
