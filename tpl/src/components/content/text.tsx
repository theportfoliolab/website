import ImageBlock from "@/components/content/imageblock.tsx";
import CodeBlock from "@/components/content/codeblock.tsx";

interface TextProps {
    title?: string
    heading?: string
    lead?: string
    code?: string
    content?: string
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
        <section className={className ?? "my-4 space-y-6"}>
            {title && (
                <h2 className="text-4xl font-extrabold mb-2 mt-20">{title}</h2>
            )}
            {heading && (
                <h4 className="text-2xl my-4 font-bold leading-8 mt-14">{heading}</h4>
            )}
            {lead && (
                <p className="my-4 text-xl font-light leading-8">{lead}</p>
            )}
            {quote && (
                <blockquote className="text-2xl font-serif italic opacity-90">
                    {quote}
                </blockquote>
            )}
            {content && (
                <p className="mt-4 leading-7">{content}</p>
            )}
            {code && (
                <CodeBlock code={code} />
            )}

            {bullets && bullets.length > 0 && (
                <ul className="text-xl font-light leading-8 list-disc list-outside my-4 space-y-4 px-6">
                    {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                    ))}
                </ul>
            )}

            {image && (
                <ImageBlock className="mb-12" src={image.src} alt={image.alt ?? ""} />
            )}
        </section>
    )
}
