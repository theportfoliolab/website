interface CodeBlockProps {
    code: string
    className?: string
}

export default function CodeBlock({ code, className }: CodeBlockProps) {
    return (
        <pre
            className={
                className ??
                "bg-accent text-foreground font-mono text-xs my-6 p-4 leading-6 rounded-md shadow-xs overflow-x-auto"
            }
        >
      <code>{code}</code>
    </pre>
    )
}
