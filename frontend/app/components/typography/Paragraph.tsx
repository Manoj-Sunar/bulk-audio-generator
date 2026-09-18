// app/components/typography/Paragraph.tsx
import { cn } from "@/app/lib/helpers";
import * as React from "react";

interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "destructive";
  align?: "left" | "center" | "right" | "justify";
  leading?: "none" | "tight" | "normal" | "relaxed" | "loose";
  truncate?: boolean;
  pretty?: boolean;
}

const sizeStyles = {
  xs: "text-xs",
  sm: "text-sm sm:text-base",
  md: "text-base sm:text-lg",
  lg: "text-base sm:text-lg",
  xl: "text-lg sm:text-xl",
};

const weightStyles = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const colorStyles = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  destructive: "text-destructive",
};

const alignStyles = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

const leadingStyles = {
  none: "leading-none",
  tight: "leading-tight",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

export const Paragraph = React.forwardRef<
  HTMLParagraphElement,
  ParagraphProps
>(
  (
    {
      size = "md",
      weight = "normal",
      color = "default",
      align = "left",
      leading = "relaxed",
      truncate = false,
      pretty = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <p
        ref={ref}
        className={cn(
          sizeStyles[size],
          weightStyles[weight],
          colorStyles[color],
          alignStyles[align],
          leadingStyles[leading],
          truncate && "truncate",
          pretty && "text-pretty",
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Paragraph.displayName = "Paragraph";