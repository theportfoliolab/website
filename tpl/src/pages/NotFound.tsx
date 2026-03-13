import { NavLink } from "react-router-dom"
import { Container } from "@/components/layout/pagecontainer"

export default function NotFound() {
    return (
        <Container className="py-2xl md:py-3xl">
            <section className="mx-auto flex max-w-2xl flex-col items-start gap-md rounded-xl border border-border bg-background/70 p-xl shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-60">404</p>
                <h1 className="text-sectionTitle font-sectionTitle">Page not found</h1>
                <p className="max-w-prose text-body opacity-80">
                    The page you requested does not exist or may have moved.
                </p>
                <NavLink
                    to="/"
                    className="inline-flex items-center rounded-md bg-primary px-md py-sm text-primary-foreground no-underline transition-opacity hover:opacity-90"
                >
                    Return home
                </NavLink>
            </section>
        </Container>
    )
}
