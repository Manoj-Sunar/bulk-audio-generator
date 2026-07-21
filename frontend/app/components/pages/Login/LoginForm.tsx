"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { Input } from "../../Inputs/InputText";
import { Button } from "../../ui/Button";
import { Label } from "../../typography/Label";

export const LoginForm = () => {
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [rememberMe, setRememberMe] = useState(true);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange =
        (field: keyof typeof form) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setForm((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                }));
            };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            /**
             * TODO:
             * Replace this with your FastAPI authentication.
             *
             * await login({
             *   email: form.email,
             *   password: form.password,
             *   rememberMe,
             * });
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 1500)
            );

            console.log({
                ...form,
                rememberMe,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Email */}

            <div className="space-y-2">
                <Label htmlFor="email">
                    Email Address
                </Label>

                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    leftIcon={<Mail size={18} />}
                    required
                />
            </div>

            {/* Password */}

            <div className="space-y-2">
                <Label htmlFor="password">
                    Password
                </Label>

                <Input
                    id="password"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange("password")}
                    leftIcon={<LockKeyhole size={18} />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((prev) => !prev)
                            }
                            className="cursor-pointer text-on-surface-variant transition hover:text-primary"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    }
                    required
                />
            </div>

            {/* Remember */}

            <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) =>
                            setRememberMe(e.target.checked)
                        }
                        className="
              h-4
              w-4
              rounded
              border-outline
              text-primary
              focus:ring-primary
            "
                    />

                    <span className="text-sm text-on-surface-variant">
                        Remember me
                    </span>
                </label>

                <Link
                    href="/forgot-password"
                    className="
            text-sm
            font-semibold
            text-primary
            transition-colors
            hover:text-primary-container
          "
                >
                    Forgot password?
                </Link>
            </div>

            {/* Login */}

            <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                className="rounded-2xl"
            >
                Sign In
            </Button>
        </form>
    );
};