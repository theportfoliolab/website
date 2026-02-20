import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BodyProps {
    children: ReactNode
    className?: string
}

export default function Body({ children, className }: BodyProps) {
    return (
        <article
            className={cn(
                `
        w-full
        flex flex-col
        gap-lg
        font-body text-body
        text-foreground
        leading-relaxed
        `,
                className
            )}
        >
            {children}
        </article>
    )
}