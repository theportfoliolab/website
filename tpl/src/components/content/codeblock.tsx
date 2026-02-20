import { cn } from "@/lib/utils"

interface CodeBlockProps {
    code: string
    className?: string
}

export default function CodeBlock({ code, className }: CodeBlockProps) {
    return (
        <pre
            className={cn(
                `
        bg-muted text-muted-foreground
        font-mono text-sm
        leading-relaxed
        rounded-md
        px-md py-md
        overflow-x-auto
        border border-border/20
        `,
                className
            )}
        >
      <code>{code}</code>
    </pre>
    )
}