import { cn } from "@/app/lib/helpers";
import * as React from "react";


interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl"| "3xl" | "4xl" | "5xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  color?: "default" | "muted" | "primary" | "destructive";
  truncate?: boolean;
}

const sizeStyles = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
};

const weightStyles = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const colorStyles = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  destructive: "text-destructive",
};

export const Span = React.forwardRef<HTMLSpanElement, SpanProps>(
  (
    {
      size = "md",
      weight = "normal",
      color = "default",
      truncate = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          sizeStyles[size],
          weightStyles[weight],
          colorStyles[color],
          truncate && "truncate",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Span.displayName = "Span";