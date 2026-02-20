import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { tokens } from "@/lib/tokens.ts";

const buttonVariants = cva(
    `cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all
   disabled:pointer-events-none disabled:opacity-50
   [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0
   outline-none focus-visible:ring-3 focus-visible:ring-ring/50
   aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`,
    {
        variants: {
            variant: {
                default: `bg-primary-light-accent dark:bg-primary-dark-accent text-primary-light-fg dark:text-primary-dark-fg
                  hover:bg-primary-light-accent/90 dark:hover:bg-primary-dark-accent/90`,
                destructive: `bg-destructive text-white hover:bg-destructive/90
                      focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40`,
                outline: `border bg-secondary-light-bg dark:bg-secondary-dark-bg shadow-sm
                  hover:bg-secondary-light-accent/20 dark:hover:bg-secondary-dark-accent/20
                  border-secondary-light-fg dark:border-secondary-dark-fg`,
                secondary: `bg-secondary-light-accent dark:bg-secondary-dark-accent
                    text-secondary-light-fg dark:text-secondary-dark-fg
                    hover:bg-secondary-light-accent/80 dark:hover:bg-secondary-dark-accent/80`,
                ghost: `hover:bg-secondary-light-bg dark:hover:bg-secondary-dark-bg
                hover:text-secondary-light-fg dark:hover:text-secondary-dark-fg`,
                link: `text-primary-light-link dark:text-primary-dark-link underline-offset-4 hover:underline`,
            },
            size: {
                default: `h-[${tokens.spacing.xl}] px-[${tokens.spacing.md}] py-[${tokens.spacing.sm}] gap-[${tokens.spacing.sm}] has-[>svg]:px-[${tokens.spacing.sm}]`,
                sm:      `h-[${tokens.spacing.lg}] px-[${tokens.spacing.sm}] py-[${tokens.spacing.xs}] gap-[${tokens.spacing.xs}] has-[>svg]:px-[${tokens.spacing.xs}]`,
                lg:      `h-[${tokens.spacing['2xl']}] px-[${tokens.spacing.lg}] py-[${tokens.spacing.sm}]`,
                icon: `size-9`,
                "icon-sm": `size-8`,
                "icon-lg": `size-10`,
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Button({
                    className,
                    variant,
                    size,
                    asChild = false,
                    ...props
                }: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
