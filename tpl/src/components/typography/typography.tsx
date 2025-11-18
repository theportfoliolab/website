import React from "react"
import { cn } from "@/lib/utils"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode
    className?: string
}

// Page Title — Extra Bold, 4.5rem
export function PageTitle({ children, className, ...props }: TypographyProps) {
    return (
        <h1
            className={cn(
                "text-[3.0rem] font-extrabold tracking-tight text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </h1>
    )
}

// Subheading — Medium, 3.2rem
export function Subheading({ children, className, ...props }: TypographyProps) {
    return (
        <h2
            className={cn(
                "text-[2.4rem] font-medium tracking-tight text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </h2>
    )
}

// Kicker — Regular, All Caps, 0.8rem, Alpha 0.6
export function Kicker({ children, className, ...props }: TypographyProps) {
    return (
        <p
            className={cn(
                "text-[0.8rem] font-normal uppercase tracking-wide text-foreground/60",
                className
            )}
            {...props}
        >
            {children}
        </p>
    )
}

// Section Title — Bold, 2.6rem
export function SectionTitle({ children, className, ...props }: TypographyProps) {
    return (
        <h3
            className={cn(
                "text-[2.2rem] font-bold tracking-tight text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </h3>
    )
}

// Lead — Light Italic, 1.6rem, Alpha 0.7
export function Lead({ children, className, ...props }: TypographyProps) {
    return (
        <p
            className={cn(
                "text-[1.4rem] font-light italic text-foreground/70",
                className
            )}
            {...props}
        >
            {children}
        </p>
    )
}

// Body — Regular, 1.0rem
export function Body({ children, className, ...props }: TypographyProps) {
    return (
        <p
            className={cn(
                "text-base font-normal leading-7 text-foreground [&:not(:first-child)]:mt-6",
                className
            )}
            {...props}
        >
            {children}
        </p>
    )
}

// Code — Regular Mono, 0.8rem, Alpha 0.7
export function Code({ children, className, ...props }: TypographyProps) {
    return (
        <code
            className={cn(
                "text-[0.8rem] font-mono font-normal bg-muted text-foreground/70 px-[0.3rem] py-[0.2rem] rounded",
                className
            )}
            {...props}
        >
            {children}
        </code>
    )
}

// CodeBlock — multi-line code block with language prop
export function CodeBlock({
    children,
    language,
    className,
    ...props
}: TypographyProps & { language?: string }) {
    return (
        <pre
            className={cn(
                "overflow-auto rounded bg-muted p-4 text-sm font-mono",
                className
            )}
            {...props}
            data-language={language}
        >
            <code className="whitespace-pre">{children}</code>
        </pre>
    )
}

// Tiny — Medium, 0.8rem, Alpha 0.6
export function Tiny({ children, className, ...props }: TypographyProps) {
    return (
        <p
            className={cn(
                "text-[0.8rem] font-medium text-foreground/60",
                className
            )}
            {...props}
        >
            {children}
        </p>
    )
}