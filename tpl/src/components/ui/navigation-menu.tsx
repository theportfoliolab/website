import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function NavigationMenu({
                            className,
                            children,
                            viewport = true,
                            ...props
                        }: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & { viewport?: boolean }) {
    return (
        <NavigationMenuPrimitive.Root
            data-slot="navigation-menu"
            data-viewport={viewport}
            className={cn(
                "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
                className
            )}
            {...props}
        >
            {children}
            {viewport && <NavigationMenuViewport />}
        </NavigationMenuPrimitive.Root>
    );
}

function NavigationMenuList({
                                className,
                                ...props
                            }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
    return (
        <NavigationMenuPrimitive.List
            data-slot="navigation-menu-list"
            className={cn("group flex flex-1 list-none items-center justify-center gap-0", className)}
            {...props}
        />
    );
}

function NavigationMenuItem({
                                className,
                                ...props
                            }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
    return (
        <NavigationMenuPrimitive.Item
            data-slot="navigation-menu-item"
            className={cn("relative", className)}
            {...props}
        />
    );
}

// Static Tailwind classes for trigger style
const navigationMenuTriggerStyle = cva(
    "cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-md " +
    "px-md py-sm text-sm font-medium transition-all outline-none " +
    "bg-primary-light-bg text-primary-light-fg hover:bg-primary-light-accent hover:text-primary-light-fg " +
    "focus:bg-primary-light-accent focus:text-primary-light-fg disabled:pointer-events-none disabled:opacity-50 " +
    "dark:bg-primary-dark-bg dark:text-primary-dark-fg dark:hover:bg-primary-dark-accent dark:hover:text-primary-dark-fg"
);

function NavigationMenuTrigger({
                                   className,
                                   children,
                                   ...props
                               }: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
    return (
        <NavigationMenuPrimitive.Trigger
            data-slot="navigation-menu-trigger"
            className={cn(navigationMenuTriggerStyle(), className)}
            {...props}
        >
            {children}{" "}
            <ChevronDownIcon
                className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
                aria-hidden="true"
            />
        </NavigationMenuPrimitive.Trigger>
    );
}

function NavigationMenuContent({
                                   className,
                                   ...props
                               }: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
    return (
        <NavigationMenuPrimitive.Content
            data-slot="navigation-menu-content"
            className={cn(
                "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out top-0 left-0 w-full p-sm md:absolute md:w-auto " +
                "bg-primary-light-bg dark:bg-primary-dark-bg rounded-md border shadow",
                className
            )}
            {...props}
        />
    );
}

function NavigationMenuViewport({
                                    className,
                                    ...props
                                }: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
    return (
        <div className="absolute top-full isolate z-50">
            <NavigationMenuPrimitive.Viewport
                data-slot="navigation-menu-viewport"
                className={cn(
                    "origin-top-center bg-primary-light-bg dark:bg-primary-dark-bg " +
                    "text-primary-light-fg dark:text-primary-dark-fg relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full " +
                    "overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
                    className
                )}
                {...props}
            />
        </div>
    );
}

function NavigationMenuLink({
                                className,
                                ...props
                            }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
    return (
        <NavigationMenuPrimitive.Link
            data-slot="navigation-menu-link"
            className={cn(
                "flex flex-col gap-1 rounded-sm p-2 text-sm outline-none transition-all " +
                "text-primary-light-fg dark:text-primary-dark-fg " +
                "hover:bg-primary-light-accent hover:text-primary-light-fg " +
                "dark:hover:bg-primary-dark-accent dark:hover:text-primary-dark-fg " +
                "focus:bg-primary-light-accent focus:text-primary-light-fg focus-visible:ring-primary-light-accent/50 focus-visible:ring-3",
                className
            )}
            {...props}
        />
    );
}

function NavigationMenuIndicator({
                                     className,
                                     ...props
                                 }: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
    return (
        <NavigationMenuPrimitive.Indicator
            data-slot="navigation-menu-indicator"
            className={cn(
                "data-[state=visible]:animate-in data-[state=hidden]:animate-out top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
        </NavigationMenuPrimitive.Indicator>
    );
}

export {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
};
