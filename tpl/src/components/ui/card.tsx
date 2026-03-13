import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card"
            className={cn(
                `
        bg-secondary-light-bg dark:bg-secondary-dark-bg
        text-secondary-light-fg dark:text-secondary-dark-fg
        flex flex-col
        rounded-lg border border-secondary-light-fg dark:border-secondary-dark-fg
        shadow-sm dark:shadow-smDark
        overflow-hidden
        `,
                className
            )}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                `
        @container/card-header
        grid auto-rows-min grid-rows-[auto_auto]
        items-start
        gap-sm
        px-xl pt-xl pb-md
        has-data-[slot=card-action]:grid-cols-[1fr_auto]
        `,
                className
            )}
            {...props}
        />
    );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-title"
            className={cn("leading-tight text-sectionTitle font-sectionTitle", className)}
            {...props}
        />
    );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-description"
            className={cn(
                `
        text-secondary-light-fg dark:text-secondary-dark-fg
        text-[0.9rem] leading-relaxed font-body opacity-80
        `,
                className
            )}
            {...props}
        />
    );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-action"
            className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
            {...props}
        />
    );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-content"
            className={cn("px-xl pb-lg", className)}
            {...props}
        />
    );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn(
                `
        flex items-center
        px-xl pb-xl
        `,
                className
            )}
            {...props}
        />
    );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
