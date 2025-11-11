export default function ImageBlock({ src, alt, caption }) {
    return (
        <figure className="image_block">
            <img src={src} alt={alt} />
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    )
}
