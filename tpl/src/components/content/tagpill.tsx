// src/components/content/tagpill.tsx
import React from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

interface TagPillProps {
    children: React.ReactNode
    className?: string
    to?: string
}

const tagPillClassName = `
    inline-flex items-center
    px-sm py-xs
    rounded-full
    text-tiny
    bg-muted
    text-muted-foreground
    border border-border/20
    transition-colors
`

export function TagPill({ children, className, to }: TagPillProps) {
    if (to) {
        return (
            <NavLink
                to={to}
                className={cn(
                    tagPillClassName,
                    "hover:bg-primary hover:text-primary-foreground hover:border-primary/70 no-underline",
                    className
                )}
            >
                {children}
            </NavLink>
        )
    }

    return (
        <span className={cn(tagPillClassName, className)}>
            {children}
        </span>
    )
}

export default TagPill
