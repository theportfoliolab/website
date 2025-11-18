import { NavLink } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 px-4 py-6 text-gray-900">
            <div className="w-[50vw] mx-auto flex flex-row gap-6 items-end justify-between
                      max-sm:flex-col max-sm:items-start max-sm:gap-4">

                {/* Brand */}
                <div className="flex flex-col items-center max-sm:items-start">
                    <NavLink
                        to="/"
                        className="font-extrabold text-2xl no-underline text-inherit"
                    >
                        ThePortfolioLab
                    </NavLink>
                    <p className="text-sm mt-1 text-gray-700">ThePortfolioLab 2025</p>
                </div>

                {/* Navigation Columns */}
                <nav
                    aria-label="Footer Navigation"
                    className="flex gap-6 flex-[2_1_420px] justify-end w-full max-sm:justify-between"
                >

                    {/* --- Pages Column --- */}
                    <div className="flex flex-col min-w-[120px]">
                        <div className="font-bold text-sm mb-2">Pages</div>

                        <FooterNavLink to="/tutorials">Tutorials</FooterNavLink>
                        <FooterNavLink to="/articles">Articles</FooterNavLink>
                        <FooterNavLink to="/about">About</FooterNavLink>
                        <FooterNavLink to="/contact">Contact</FooterNavLink>
                    </div>

                    {/* --- Help Column --- */}
                    <div className="flex flex-col min-w-[120px]">
                        <div className="font-bold text-sm mb-2">Help</div>

                        <FooterNavLink to="/faq">FAQ</FooterNavLink>
                        <FooterNavLink to="/ask">Ask</FooterNavLink>
                    </div>

                    {/* --- Follow Column --- */}
                    <div className="flex flex-col min-w-[120px]">
                        <div className="font-bold text-sm mb-2">Follow</div>

                        {/* External links stay <a> */}
                        <FooterExternalLink href="https://github.com">GitHub</FooterExternalLink>
                        <FooterExternalLink href="https://linkedin.com">LinkedIn</FooterExternalLink>
                    </div>

                </nav>
            </div>
        </footer>
    )
}


/* -------------------------
   Helper Components
------------------------- */

function FooterNavLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <NavLink
            to={to}
            className="text-gray-600 text-sm no-underline hover:underline hover:text-gray-900"
        >
            {children}
        </NavLink>
    )
}

function FooterExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 text-sm no-underline hover:underline hover:text-gray-900"
        >
            {children}
        </a>
    )
}
