// src/components/layout/PageContainer.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export function PageContainer({
                                  children,
                                  className,
                              }: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn("max-w-6xl mx-auto px-xl", className)}>
            {children}
        </div>
    )
}
