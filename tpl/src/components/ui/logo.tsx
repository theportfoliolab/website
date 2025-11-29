import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import logoUrl from "@/assets/logo.svg"

interface LogoProps {
    className?: string
}

export function Logo({ className }: LogoProps) {
    return (
        <Link
            to="/"
            aria-label="Home"
            className={cn("inline-flex items-center", className)}
        >
            <img
                src={logoUrl}
                alt="ThePortfolioLab Logo"
                className="h-[40px] w-auto -translate-y-1.5"
            />
        </Link>
    )
}
