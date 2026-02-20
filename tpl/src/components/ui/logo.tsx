import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import logoLightUrl from "@/assets/logo.svg";
import logoDarkUrl from "@/assets/logo-dark.svg";

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <Link
            to="/"
            aria-label="Home"
            className={cn("inline-flex items-center shrink-0 leading-none", className)}
        >
            <img
                src={logoLightUrl}
                alt="ThePortfolioLab Logo"
                className="h-full w-auto md:-translate-y-1 dark:hidden"
            />
            <img
                src={logoDarkUrl}
                alt="ThePortfolioLab Logo"
                className="h-full w-auto md:-translate-y-1 hidden dark:inline"
            />
        </Link>
    );
}