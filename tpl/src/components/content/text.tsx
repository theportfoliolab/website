import ImageBlock from "@/components/content/imageblock"
import CodeBlock from "@/components/content/codeblock"
import { cn } from "@/lib/utils"

interface TextProps {
    title?: string
    heading?: string
    lead?: string
    code?: string
    content?: string | React.ReactNode
    quote?: string
    bullets?: string[]
    image?: {
        src: string
        alt?: string
        className?: string
    }
    className?: string
}

export function Text({
                         title,
                         heading,
                         lead,
                         code,
                         content,
                         quote,
                         bullets,
                         image,
                         className,
                     }: TextProps) {
    return (
        <section className={cn("flex flex-col gap-md", className)}>
            {title && <h2 className="text-pageTitle">{title}</h2>}

            {heading && <h3 className="text-sectionTitle">{heading}</h3>}

            {lead && <p className="text-lead">{lead}</p>}

            {quote && (
                <blockquote className="pl-md border-l-4 border-muted text-body italic opacity-80">
                    {quote}
                </blockquote>
            )}

            {content && <p className="text-body">{content}</p>}

            {code && <CodeBlock code={code} />}

            {bullets?.length ? (
                <ul className="list-disc list-outside pl-lg flex flex-col gap-sm">
                    {bullets.map((b, i) => (
                        <li key={i} className="text-body">
                            {b}
                        </li>
                    ))}
                </ul>
            ) : null}

            {image && (
                <ImageBlock src={image.src} alt={image.alt ?? ""} className={image.className} />
            )}
        </section>
    )
}