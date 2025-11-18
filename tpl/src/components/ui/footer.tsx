import { NavLink } from "react-router-dom"
import React from "react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-10 py-8 bg-white text-gray-900">
      <div className="max-w-5xl mx-auto flex items-start justify-between gap-8">
        {/* Brand (left) */}
        <div className="flex-shrink-0">
          <NavLink to="/" className="font-extrabold text-2xl text-inherit no-underline">
            ThePortfolioLab
          </NavLink>
          <p className="text-sm text-gray-600 mt-1">ThePortfolioLab 2025</p>
        </div>

        {/* Nav columns (anchored to right) */}
        <div className="ml-auto flex text-right">
          <FooterColumn title="Pages">
            <FooterNavLink to="/tutorials">Tutorials</FooterNavLink>
            <FooterNavLink to="/articles">Articles</FooterNavLink>
            <FooterNavLink to="/about">About</FooterNavLink>
          </FooterColumn>

          <FooterColumn title="Follow">
            <FooterExternalLink href="https://github.com">GitHub</FooterExternalLink>
            <FooterExternalLink href="https://linkedin.com">LinkedIn</FooterExternalLink>
          </FooterColumn>
        </div>
      </div>
    </footer>
  )
}

/* Helper: column wrapper */
function FooterColumn({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="min-w-[120px]">
      <div className="font-semibold text-sm mb-3">{title}</div>
      <div className="flex flex-col space-y-2 text-sm">{children}</div>
    </div>
  )
}

/* Internal link */
function FooterNavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className="text-gray-600 hover:underline hover:text-gray-900 no-underline"
    >
      {children}
    </NavLink>
  )
}

/* External link */
function FooterExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-600 hover:underline hover:text-gray-900"
    >
      {children}
    </a>
  )
}
