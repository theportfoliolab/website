import Link from "@/components/content/link"
import { cn } from "@/lib/utils"

interface DisclaimerProps {
    children: React.ReactNode
    linkHref?: string
    linkLabel?: React.ReactNode
    className?: string
}

export default function Disclaimer({
    children,
    linkHref,
    linkLabel,
    className,
}: DisclaimerProps) {
    const linkClasses =
        "font-body text-primary-light-link underline underline-offset-4 transition-opacity hover:opacity-80 dark:text-primary-dark-link"

    return (
        <section
            className={cn(
                "flex flex-col gap-sm rounded-md border border-muted/40 bg-secondary-light-bg/40 p-md dark:bg-secondary-dark-bg/40",
                className
            )}
        >
            <p className="text-lead text-primary-light-fg dark:text-primary-dark-fg">
                {children}{" "}
                {linkHref && linkLabel
                    ? linkHref.startsWith("#")
                        ? (
                            <a href={linkHref} className={linkClasses}>
                                {linkLabel}
                            </a>
                        )
                        : (
                            <Link href={linkHref} className={linkClasses}>
                                {linkLabel}
                            </Link>
                        )
                    : null}
            </p>
        </section>
    )
}
