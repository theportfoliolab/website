import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
    title?: React.ReactNode
    subtitle?: React.ReactNode
    children?: React.ReactNode
    className?: string
    image?: string | React.ReactNode
    imageAlt?: string
}

export function Subsection({
                               title,
                               subtitle,
                               children,
                               className,
                               image,
                               imageAlt,
                           }: SectionProps) {
    return (
        <section className={cn("flex flex-col gap-md", className)}>
            {title && (
                <h3 className="font-sectionTitle text-sectionTitle">
                    {title}
                </h3>
            )}

            {subtitle && (
                <p className="font-body text-body opacity-80">
                    {subtitle}
                </p>
            )}

            {image &&
                (typeof image === "string" ? (
                    <figure className="flex flex-col gap-sm">
                        <img
                            src={image}
                            alt={imageAlt ?? String(title ?? "")}
                            className="rounded-md object-cover"
                        />
                    </figure>
                ) : (
                    <div>{image}</div>
                ))}

            {children && (
                <div className="flex flex-col gap-sm">
                    {children}
                </div>
            )}
        </section>
    )
}

export default Subsection
