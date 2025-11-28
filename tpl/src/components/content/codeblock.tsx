interface CodeBlockProps {
    code: string
    className?: string
}

export default function CodeBlock({ code, className }: CodeBlockProps) {
    return (
        <pre className={className ?? "code_block"}>
            <code>{code}</code>
        </pre>
    )
}
