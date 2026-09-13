"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";


import { Label } from "../typography/Label";
import { Paragraph } from "../typography/Paragraph";
import { cn } from "@/app/lib/helpers";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  requiredIndicator?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      containerClassName,
      inputClassName,
      requiredIndicator = false,
      type = "text",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";

    const inputType =
      isPassword && showPassword ? "text" : type;

    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {label && (
          <Label
            htmlFor={inputId}
            className="flex items-center gap-1"
          >
            {label}

            {requiredIndicator && (
              <span className="text-error">*</span>
            )}
          </Label>
        )}

        <div
          className={cn(
            "group flex h-12 items-center rounded-xl border bg-surface transition-all duration-200",
            error
              ? "border-error"
              : "border-outline-variant hover:border-primary focus-within:border-primary",
            disabled &&
              "cursor-not-allowed opacity-60",
            "focus-within:ring-4 focus-within:ring-primary/10"
          )}
        >
          {leftIcon && (
            <div className="pl-4 text-on-surface-variant">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            className={cn(
              "h-full w-full bg-transparent px-4 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70",
              leftIcon && "pl-3",
              (rightIcon || isPassword) && "pr-3",
              inputClassName
            )}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="mr-3 text-on-surface-variant transition-colors hover:text-primary"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          ) : (
            rightIcon && (
              <div className="mr-4 text-on-surface-variant">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {error ? (
          <Paragraph
            id={`${inputId}-error`}
            size="sm"
            className="text-error"
          >
            {error}
          </Paragraph>
        ) : helperText ? (
          <Paragraph
            id={`${inputId}-helper`}
            size="sm"
            className="text-on-surface-variant"
          >
            {helperText}
          </Paragraph>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";