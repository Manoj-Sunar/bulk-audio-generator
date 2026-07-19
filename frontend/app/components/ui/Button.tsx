"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { cn } from "@/app/lib/helpers";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";

  size?: "sm" | "md" | "lg" | "icon";

  loading?: boolean;

  fullWidth?: boolean;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;
}

const variants = {
  primary:
    "bg-primary text-on-primary hover:opacity-90 focus-visible:ring-primary shadow-sm",

  secondary:
    "bg-secondary text-on-secondary hover:opacity-90 focus-visible:ring-secondary shadow-sm",

  outline:
    "border border-outline bg-surface text-on-surface hover:bg-surface-container focus-visible:ring-outline",

  ghost:
    "bg-transparent text-on-surface hover:bg-surface-container focus-visible:ring-surface-container",

  destructive:
    "bg-error text-on-error hover:opacity-90 focus-visible:ring-error shadow-sm",
};

const sizes = {
  sm: "h-9 px-3 text-sm",

  md: "h-11 px-5 text-sm",

  lg: "h-12 px-6 text-base",

  icon: "h-11 w-11 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading}
        className={twMerge(
          cn(
            "inline-flex items-center justify-center gap-2 rounded-xl",
            "font-medium whitespace-nowrap",
            "transition-all duration-200",
            "select-none",
            "outline-none",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "active:scale-[0.98]",
            variants[variant],
            sizes[size],
            fullWidth && "w-full"
          ),
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2
            size={18}
            className="animate-spin shrink-0"
          />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        {size !== "icon" && children}

        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}

        {size === "icon" &&
          !children &&
          !leftIcon &&
          !rightIcon &&
          !loading && (
            <span className="sr-only">Button</span>
          )}
      </button>
    );
  }
);

Button.displayName = "Button";