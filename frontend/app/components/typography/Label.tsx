import { cn } from "@/app/lib/helpers";
import * as React from "react";


interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: "xs" | "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "destructive";
  required?: boolean;
}

const sizeStyles = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const weightStyles = {
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

export const Label = React.forwardRef<
  HTMLLabelElement,
  LabelProps
>(
  (
    {
      size = "sm",
      weight = "medium",
      color = "default",
      required = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <label
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1",
          sizeStyles[size],
          weightStyles[weight],
          colorStyles[color],
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span
            aria-hidden="true"
            className="text-destructive"
          >
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";