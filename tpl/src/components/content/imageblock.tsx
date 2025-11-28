interface ImageBlockProps {
    src: string
    alt: string
    caption?: string
    className?: string
}

export default function ImageBlock({ src, alt, caption, className }: ImageBlockProps) {
    return (
        <figure className={className ?? "image_block"}>
            <img src={src} alt={alt} />
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    )
}
