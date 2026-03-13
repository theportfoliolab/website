"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
    code: string
    className?: string
}

const PREVIEW_LINES = 20

export default function CodeBlock({ code, className }: CodeBlockProps) {
    const lines = useMemo(() => code.split(/\r?\n/), [code])
    const isCollapsible = lines.length > PREVIEW_LINES
    const [isExpanded, setIsExpanded] = useState(false)
    const [copied, setCopied] = useState(false)
    const copyResetTimer = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (copyResetTimer.current !== null) {
                window.clearTimeout(copyResetTimer.current)
            }
        }
    }, [])

    const previewCode = useMemo(() => lines.slice(0, PREVIEW_LINES).join("\n"), [lines])
    const displayedCode = isCollapsible && !isExpanded ? previewCode : code

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)

            if (copyResetTimer.current !== null) {
                window.clearTimeout(copyResetTimer.current)
            }

            copyResetTimer.current = window.setTimeout(() => {
                setCopied(false)
            }, 1500)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div
            className={cn(
                `
                bg-muted text-muted-foreground
                border border-border/20
                rounded-md
                `,
                className
            )}
        >
            <div className="flex items-center justify-end px-md pt-sm">
                <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded border border-border/40 bg-background/40 px-sm py-1 text-xs hover:bg-background/60"
                    aria-label="Copy code to clipboard"
                >
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>

            <pre className="overflow-x-auto px-md pb-md font-mono text-sm leading-relaxed">
                <code>{displayedCode}</code>
            </pre>

            {isCollapsible ? (
                <div className="flex items-center justify-end px-md pb-sm">
                    <button
                        type="button"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="rounded border border-border/40 bg-background/40 px-sm py-1 text-xs hover:bg-background/60"
                    >
                        {isExpanded ? "Collapse" : `Expand (${lines.length} lines)`}
                    </button>
                </div>
            ) : null}
        </div>
    )
}
