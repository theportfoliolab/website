// src/components/layout/pagecontainer.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

type ContainerProps = {
    children: React.ReactNode
    className?: string
}

export function Container({ children, className }: ContainerProps) {
    return (
        <div className={cn("w-full mx-auto max-w-6xl px-md md:px-xl", className)}>
            {children}
        </div>
    )
}

export const PageContainer = Container
