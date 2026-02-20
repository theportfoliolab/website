import { NavLink } from "react-router-dom";
import React from "react";

export default function Footer() {
    return (
        <footer className="border-t border-secondary-light-fg dark:border-secondary-dark-fg px-xl py-lg bg-primary-light-bg dark:bg-primary-dark-bg text-primary-light-fg dark:text-primary-dark-fg">
            <div className="max-w-5xl mx-auto flex items-start justify-between gap-lg">
                {/* Brand */}
                <div className="flex-shrink-0">
                    <NavLink
                        to="/"
                        className="font-pageTitle text-pageTitle no-underline text-inherit"
                    >
                        ThePortfolioLab
                    </NavLink>
                    <p className="text-tiny font-tiny text-secondary-light-fg dark:text-secondary-dark-fg mt-1">
                        ThePortfolioLab 2025
                    </p>
                </div>

                {/* Navigation columns */}
                <div className="ml-auto flex text-right gap-lg">
                    <FooterColumn title="Pages">
                        {["Tutorials", "Articles", "About"].map((page) => (
                            <FooterNavLink key={page} to={`/${page.toLowerCase()}`}>
                                {page}
                            </FooterNavLink>
                        ))}
                    </FooterColumn>

                    <FooterColumn title="Follow">
                        <FooterExternalLink href="https://github.com/theportfoliolab">
                            GitHub
                        </FooterExternalLink>
                        <FooterExternalLink href="https://www.linkedin.com/in/asher-mckee-9b0182392/">
                            LinkedIn
                        </FooterExternalLink>
                    </FooterColumn>
                </div>
            </div>
        </footer>
    );
}

/* Column wrapper */
function FooterColumn({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) {
    return (
        <div className="min-w-[120px]">
            <div className="font-subheading text-subheading mb-sm">{title}</div>
            <div className="flex flex-col gap-sm text-body font-body">{children}</div>
        </div>
    );
}

/* Internal link */
function FooterNavLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <NavLink
            to={to}
            className="text-secondary-light-fg dark:text-secondary-dark-fg hover:underline hover:text-primary-light-fg dark:hover:text-primary-dark-fg no-underline"
        >
            {children}
        </NavLink>
    );
}

/* External link */
function FooterExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-light-fg dark:text-secondary-dark-fg hover:underline hover:text-primary-light-fg dark:hover:text-primary-dark-fg"
        >
            {children}
        </a>
    );
}
