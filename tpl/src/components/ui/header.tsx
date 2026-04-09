import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "react-router-dom";
import { useTheme } from "@/lib/theme";
import { formatIsoDate } from "@/lib/date";

const NAV_PAGES = [
    { label: "Browse", href: "/browse" },
    { label: "About", href: "/about" },
] as const;

export function Header() {
    const { toggleTheme } = useTheme()

    return (
        <header
            className="
        w-full
        border-b border-secondary-light-fg dark:border-secondary-dark-fg
        bg-primary-light-bg dark:bg-primary-dark-bg
        shadow-none
      "
        >
            {/* Inner container (matches content/footer width on widescreen) */}
            <div
                className="
          mx-auto max-w-6xl
          px-md md:px-xl
          pt-md pb-sm md:pt-xl md:pb-lg
          flex flex-col gap-xs md:gap-sm
          md:flex-row md:items-center md:justify-between md:gap-lg
        "
            >
                {/* Logo */}
                <Logo className="h-10 sm:h-11 md:h-16 self-start md:self-auto" />

                {/* Navigation */}
                <NavigationMenu viewport={false} className="self-stretch md:self-auto">
                    <NavigationMenuList
                        className="
              flex w-full items-center justify-between
              md:w-auto md:justify-end
              gap-sm md:gap-md font-medium text-body tracking-[0.02em]
              md:translate-y-[1px]
            "
                    >
                        {NAV_PAGES.map((page) => (
                            <NavigationMenuItem key={page.href} className="flex-1 md:flex-none">
                                <NavigationMenuLink
                                    asChild
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        "w-full md:w-auto min-h-12 px-md py-sm md:px-lg md:py-sm text-center whitespace-normal leading-snug"
                                    )}
                                >
                                    <NavLink
                                        to={page.href}
                                        className="
                      text-primary-light-fg dark:text-primary-dark-fg
                      hover:text-primary-light-accent dark:hover:text-primary-dark-accent
                    "
                                    >
                                        {page.label}
                                    </NavLink>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="
            self-start md:self-auto
            cursor-pointer rounded-md border border-border
            bg-background px-sm py-xs text-tiny font-tiny
            hover:bg-muted transition-colors
          "
                    aria-label="Cycle theme mode"
                >
                    Toggle theme
                </button>
            </div>
        </header>
    );
}

interface ContentHeaderProps {
    title: string;
    description: string;
    date: string;
    tags?: string[];
}

export function ContentHeader({ title, description, date, tags }: ContentHeaderProps) {
    return (
        <div className="mb-3xl">
            <h1 className="text-pageTitle font-pageTitle my-sm leading-[1.1]">{title}</h1>
            <h4 className="text-subheading font-subheading text-secondary-light-fg dark:text-secondary-dark-fg mb-lg">
                {description}
            </h4>
            <p className="text-tiny font-tiny text-secondary-light-fg dark:text-secondary-dark-fg opacity-80 my-xs">
                Published on {formatIsoDate(date)}
            </p>

            {tags && (
                <div className="flex gap-sm mt-sm">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-sm py-xs bg-secondary-light-accent dark:bg-secondary-dark-accent rounded-sm text-tiny font-tiny"
                        >
              {tag}
            </span>
                    ))}
                </div>
            )}
        </div>
    );
}
