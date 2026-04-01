import ReactMarkdown from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import { cn } from "@/lib/utils"
import "katex/dist/katex.min.css"

interface MathProps {
    formula: string
    className?: string
}

export function InlineMath({ formula, className }: MathProps) {
    return (
        <span className={cn("text-body text-primary-light-fg dark:text-primary-dark-fg", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    p: ({ children }) => <>{children}</>,
                }}
            >
                {`$${formula}$`}
            </ReactMarkdown>
        </span>
    )
}

export function BlockMath({ formula, className }: MathProps) {
    return (
        <div
            className={cn(
                "overflow-x-auto rounded-md border border-muted/40 bg-secondary-light-bg/30 px-md py-sm text-primary-light-fg dark:bg-secondary-dark-bg/30 dark:text-primary-dark-fg",
                className,
            )}
        >
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    p: ({ children }) => <>{children}</>,
                }}
            >
                {`$$${formula}$$`}
            </ReactMarkdown>
        </div>
    )
}
