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
                            justify-between
                            py-6
                            px-8
                            border-b
                            border-b-secondary
                            shadow-none
                            bg-background">
            <Logo />
            <NavigationMenu viewport={false}>
                <NavigationMenuList className="flex gap-6">

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