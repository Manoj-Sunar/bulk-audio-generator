"use client";

import * as React from "react";


import { Label } from "../typography/Label";
import { Paragraph } from "../typography/Paragraph";
import { cn } from "@/app/lib/helpers";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  textareaClassName?: string;
  requiredIndicator?: boolean;
  showCharacterCount?: boolean;
  maxCharacters?: number;
}

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      label,
      helperText,
      error,
      containerClassName,
      textareaClassName,
      requiredIndicator = false,
      showCharacterCount = false,
      maxCharacters,
      id,
      disabled,
      value,
      defaultValue,
      rows = 10,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
        ? defaultValue.length
        : 0;

    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {label && (
          <div className="flex items-center justify-between">
            <Label
              htmlFor={textareaId}
              className="flex items-center gap-1"
            >
              {label}

              {requiredIndicator && (
                <span className="text-error">*</span>
              )}
            </Label>

            {showCharacterCount && (
              <Paragraph
                size="xs"
                className="text-on-surface-variant"
              >
                {currentLength}
                {maxCharacters ? ` / ${maxCharacters}` : ""} characters
              </Paragraph>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxCharacters}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          className={cn(
            "min-h-[220px] w-full resize-y rounded-xl border bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200",
            "placeholder:text-on-surface-variant/70",
            "focus:border-primary focus:ring-4 focus:ring-primary/10",
            error
              ? "border-error"
              : "border-outline-variant hover:border-primary",
            disabled &&
              "cursor-not-allowed opacity-60",
            textareaClassName
          )}
          {...props}
        />

        {error ? (
          <Paragraph
            id={`${textareaId}-error`}
            size="sm"
            className="text-error"
          >
            {error}
          </Paragraph>
        ) : helperText ? (
          <Paragraph
            id={`${textareaId}-helper`}
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

Textarea.displayName = "Textarea";