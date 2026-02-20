// src/components/content/tagpill.tsx
import React from "react"
import { cn } from "@/lib/utils"

interface TagPillProps {
    children: React.ReactNode
    className?: string
}

export function TagPill({ children, className }: TagPillProps) {
    return (
        <span
            className={cn(
                `
        inline-flex items-center
        px-sm py-xs
        rounded-full
        text-tiny
        bg-muted
        text-muted-foreground
        border border-border/20
        `,
                className
            )}
        >
      {children}
    </span>
    )
}

export default TagPill