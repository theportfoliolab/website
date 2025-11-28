import type { ReactNode } from "react"

interface BodyProps {
    children: ReactNode
    className?: string
}

export default function Body({ children, className }: BodyProps) {
    return (
        <article className={className}>
            {children}
        </article>
    )
}
