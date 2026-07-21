"use client";

import Link from "next/link";
import { AtSign, Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";

import { Input } from "../../Inputs/InputText";
import { Button } from "../../ui/Button";
import { Paragraph } from "../../typography/Paragraph";

interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;

  loading?: boolean;

  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;

  onSubmit: () => void;
}

export const RegisterForm = ({
  name,
  email,
  password,
  confirmPassword,
  loading = false,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  return (
    <div className="space-y-7">
      {/* Name */}

      <Input
        label="Full Name"
        placeholder="John Doe"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        leftIcon={<User size={18} />}
      />

      {/* Email */}

      <Input
        type="email"
        label="Email Address"
        placeholder="john@example.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        leftIcon={<AtSign size={18} />}
      />

      {/* Password */}

      <Input
        label="Password"
        placeholder="Create a strong password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        leftIcon={<Lock size={18} />}
        rightIcon={
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="text-on-surface-variant transition hover:text-primary"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        }
      />

      {/* Confirm Password */}

      <Input
        label="Confirm Password"
        placeholder="Confirm your password"
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) =>
          onConfirmPasswordChange(e.target.value)
        }
        leftIcon={<Lock size={18} />}
        rightIcon={
          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            className="text-on-surface-variant transition hover:text-primary"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        }
      />

      {/* Terms */}

      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-outline accent-primary"
        />

        <Paragraph
          size="sm"
          className="leading-6 text-on-surface-variant"
        >
          I agree to the{" "}
          <Link
            href="/terms"
            className="font-medium text-primary hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-primary hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </Paragraph>
      </div>

      {/* Register Button */}

      <Button
        loading={loading}
        fullWidth
        size="lg"
        onClick={onSubmit}
        className="rounded-2xl"
      >
        Create Account
      </Button>

      {/* Login */}

      <Paragraph
        size="sm"
        className="text-center text-on-surface-variant"
      >
        Already have an account?{" "}
        <Link
          href="/bulk-audio/bulk-audio-login"
          className="font-semibold text-primary hover:underline"
        >
          Sign In
        </Link>
      </Paragraph>
    </div>
  );
};