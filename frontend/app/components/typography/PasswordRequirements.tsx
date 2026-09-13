// app/components/typography/PasswordRequirements.tsx
'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Paragraph } from './Paragraph';
import { PASSWORD_REQUIREMENTS } from '@/app/lib/constants';

interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  return (
    <div className="rounded-lg bg-surface-container-low p-4 border border-outline-variant/20 space-y-2">
      <Paragraph size="xs" weight="medium" className="text-on-surface-variant/80">
        Password must contain:
      </Paragraph>
      <ul className="space-y-1">
        {PASSWORD_REQUIREMENTS.map((check) => {
          const met = check.test(password);
          return (
            <li key={check.label} className="flex items-center gap-2 text-sm text-on-surface-variant">
              {met ? (
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
              ) : (
                <XCircle size={16} className="text-outline-variant shrink-0" />
              )}
              <span className={met ? 'text-on-surface' : 'text-on-surface-variant/60'}>
                {check.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};