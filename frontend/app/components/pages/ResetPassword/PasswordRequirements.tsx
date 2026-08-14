"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Paragraph } from "@/app/components/typography/Paragraph";

interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const checks = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "Contains a number",
      met: /[0-9]/.test(password),
    },
    {
      label: "Contains a special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password), // ✅ fixed
    },
  ];

  return (
    <div className="rounded-lg bg-surface-container-low p-4 border border-outline-variant/20 space-y-2">
      <Paragraph size="xs" weight="medium" className="text-on-surface-variant/80">
        Password must contain:
      </Paragraph>
      <ul className="space-y-1">
        {checks.map((check) => (
          <li key={check.label} className="flex items-center gap-2 text-sm text-on-surface-variant">
            {check.met ? (
              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            ) : (
              <XCircle size={16} className="text-outline-variant shrink-0" />
            )}
            <span className={check.met ? "text-on-surface" : "text-on-surface-variant/60"}>
              {check.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};