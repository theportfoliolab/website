interface ImageBlockProps {
    src: string
    alt: string
    title?: string
    caption?: string
    className?: string
}

export default function ImageBlock({ src, alt, title, caption, className }: ImageBlockProps) {
    return (
        <figure className={className ?? "image_block"}>
            {title && <h3>{title}</h3>}
            <img src={src} alt={alt} />
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    )
}
