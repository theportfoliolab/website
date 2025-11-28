import type { ReactNode } from "react"

interface SectionProps {
    title: string
    children: ReactNode
    className?: string
}

export default function Section({ title, children, className }: SectionProps) {
    return (
        <section className={className ?? "section"}>
            <h2>{title}</h2>
            <div className="section_content">{children}</div>
        </section>
    )
}
