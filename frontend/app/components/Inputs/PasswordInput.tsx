// app/components/Inputs/PasswordInput.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './InputText';

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  autoComplete?: string;
}

export function PasswordInput({
  label = 'Password',
  placeholder = '••••••••',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  autoComplete = 'current-password',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      label={label}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      leftIcon={<Lock size={18} className="text-on-surface-variant/60" />}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="text-on-surface-variant transition hover:text-primary"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
      className={className}
    />
  );
}