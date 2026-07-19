import { cn } from "@/app/lib/helpers";
import * as React from "react";




// Headings Components
type HeadingElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingElement;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  weight?:
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold";
  align?: "left" | "center" | "right";
  color?: "default" | "muted" | "primary" | "destructive";
  truncate?: boolean;
}

const sizeStyles = {
  xs: "text-sm",
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
  "2xl": "text-4xl",
  "3xl": "text-5xl",
  "4xl": "text-6xl",
  "5xl": "text-7xl",
};

const weightStyles = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const alignStyles = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const colorStyles = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  destructive: "text-destructive",
};

export const Heading = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps
>(
  (
    {
      as: Component = "h2",
      size = "lg",
      weight = "bold",
      align = "left",
      color = "default",
      truncate = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "scroll-m-20 tracking-tight",
          sizeStyles[size],
          weightStyles[weight],
          alignStyles[align],
          colorStyles[color],
          truncate && "truncate",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";




