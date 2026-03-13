import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { SiteLogoSvg } from "@/components/ui/site-logo-svg";

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
            <SiteLogoSvg className="h-full w-auto md:-translate-y-1 text-primary-light-fg dark:text-primary-dark-fg" />
        </Link>
    );
}
