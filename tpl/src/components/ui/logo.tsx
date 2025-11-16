import {cn} from "@/lib/utils"
import { Link } from "react-router-dom"

interface LogoProps {
    className?: string
}

export function Logo({className}: LogoProps) {
    return (
        <Link to="/" className={cn("text-2xl font-bold tracking-tight inline-flex items-center", className)} aria-label="Home">
            <span className="text-primary">The</span>
            <span className="text-muted-foreground">PortfolioLab</span>
        </Link>
    )
}