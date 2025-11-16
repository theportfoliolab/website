import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { Logo } from "@/components/ui/logo.tsx"
import {Button} from "@/components/ui/button.tsx";
import { Link } from "react-router-dom"

export function Header() {
    return (
        <header className="w-full flex items-center justify-between px-8 py-4 border-b">
            <Logo/>
            <NavigationMenu className="relative">
                <NavigationMenuList>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/about">About</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link to="/contact" aria-label="Contact">
                            <Button>Contact</Button>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
                <NavigationMenuViewport/>
            </NavigationMenu>
        </header>
    )
}