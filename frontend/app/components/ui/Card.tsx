import { cn } from "@/app/lib/helpers";
import * as React from "react";
import { twMerge } from "tailwind-merge";



interface BaseProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Card = React.forwardRef<HTMLDivElement, BaseProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge(
                cn(
                    "rounded-2xl",
                    "border border-outline-variant",
                    "bg-surface",
                    "text-on-surface",
                    "shadow-sm",
                    "transition-all duration-200",
                    className
                )
            )}
            {...props}
        />
    )
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, BaseProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge(cn("flex flex-col gap-2 p-6", className))}
            {...props}
        />
    )
);

CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={twMerge(
            cn(
                "text-xl font-semibold tracking-tight text-on-surface",
                className
            )
        )}
        {...props}
    />
));

CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={twMerge(
            cn("text-sm text-on-surface-variant", className)
        )}
        {...props}
    />
));

CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, BaseProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge(cn("px-6 pb-6", className))}
            {...props}
        />
    )
);

CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, BaseProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge(
                cn(
                    "flex items-center justify-end gap-3",
                    "px-6 pb-6",
                    className
                )
            )}
            {...props}
        />
    )
);

CardFooter.displayName = "CardFooter";