import { cn } from "@/lib/utils"

interface ImageBlockProps {
    src: string
    alt: string
    title?: string
    caption?: string
    className?: string
}

export default function ImageBlock({ src, alt, title, caption, className }: ImageBlockProps) {
    return (
        <figure className={cn("w-full h-auto rounded-md border border-border/20", className)}>
            {title && <h3 className="text-sectionTitle">{title}</h3>}

            <img src={src} alt={alt} className="rounded-md object-cover w-full" />

            {caption && <figcaption className="text-tiny">{caption}</figcaption>}
        </figure>
    )
}