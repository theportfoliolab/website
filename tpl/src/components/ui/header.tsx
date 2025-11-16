import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuContent,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router-dom"

export function Header() {
    return (
        <header className=" w-full
                            flex
                            justify-between
                            px-10
                            py-6
                            border-b
                            border-b-secondary
                            shadow-none
                            bg-background">
            <Logo />
            <NavigationMenu viewport={false}>
                <NavigationMenuList className="flex gap-6">

                    {/* Articles dropdown */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Articles</NavigationMenuTrigger>
                        <NavigationMenuContent className="absolute left-0 top-full">
                            <ul>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <NavLink to="/articles">All Articles</NavLink>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <NavLink to="/articles/ma-crossovers">MA Crossovers</NavLink>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <NavLink to="/articles/uncorrelated">Uncorrelated Strategies</NavLink>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Tutorials dropdown */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Tutorials</NavigationMenuTrigger>
                        <NavigationMenuContent className="absolute left-0 top-full">
                            <ul>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <NavLink to="/tutorials">All Tutorials</NavLink>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <NavLink to="/tutorials/csv-dataframes">CSV Dataframes</NavLink>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <NavLink to="/tutorials/data-cleaning">Cleaning Data</NavLink>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* About */}
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            asChild
                            className={navigationMenuTriggerStyle()}>
                            <NavLink to="/about">About</NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* Contact button */}
                    <NavigationMenuItem>
                        <Button asChild>
                            <NavLink to="/contact">Contact</NavLink>
                        </Button>
                    </NavigationMenuItem>
                </NavigationMenuList>

            </NavigationMenu>
        </header>
    )
}