import { cn } from "@/lib/utils"
import { Link as RouterLink } from "react-router-dom"

interface LinkProps {
    href: string
    children: React.ReactNode
    className?: string
}

export default function Link({ href, children, className }: LinkProps) {
    const isExternal = href.startsWith("http")

    const baseStyles = `
    font-body
    text-primary-light-link dark:text-primary-dark-link
    underline underline-offset-4
    hover:opacity-80
    transition-opacity
  `

    if (isExternal) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={cn(baseStyles, className)}>
                {children}
            </a>
        )
    }

    return (
        <RouterLink to={href} className={cn(baseStyles, className)}>
            {children}
        </RouterLink>
    )
}