import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { Logo } from "@/components/ui/logo"
import { NavLink } from "react-router-dom"


export function Header() {
    return (
        <header className=" w-full
                            flex
                            gap-16
                            justify-between
                            py-6
                            px-8
                            border-b
                            border-b-secondary
                            shadow-none
                            bg-background">
            <Logo />
            <NavigationMenu viewport={false}>
                <NavigationMenuList className="flex gap-0">

                    {/* Articles dropdown */}
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <NavLink to="/articles">Articles</NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* Tutorials dropdown */}
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <NavLink to="/tutorials">Tutorials</NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* About */}
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            asChild
                            className={navigationMenuTriggerStyle()}>
                            <NavLink to="/about">About</NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>

            </NavigationMenu>
        </header>
    )
}

interface ContentHeaderProps {
    title: string
    description: string
    date: string
    tags?: string[]
}

export function ContentHeader({title, description, date, tags}: ContentHeaderProps){
    return (
        <div className="mb-12">
            <h1 className="text-5xl font-extrabold my-5 leading-14">{title}</h1>
            <h4 className="text-xl font-medium text-muted-foreground mb-8">{description}</h4>
            <p className="text-sm text-muted-foreground opacity-80 my-2">
                Published on {new Date(date).toLocaleDateString()}
            </p>

            {tags && (
                <div className="flex gap-2 mt-3">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-secondary rounded text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}