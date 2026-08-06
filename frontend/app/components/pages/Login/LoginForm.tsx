
"use client";

import { FaGithub } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

import { Input } from "../../Inputs/InputText";
import { Button } from "../../ui/Button";
import { Label } from "../../typography/Label";
import { useGithubLogin, useGoogleLogin, useLogin } from "@/app/lib/auth/hooks";
import { useAuth } from "@/app/lib/auth/context";


export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  // React Query mutations
  const { mutate: login, isPending: loginPending } = useLogin();
  const { mutate: googleLogin, isPending: googlePending } = useGoogleLogin();
  const { mutate: githubLogin, isPending: githubPending } = useGithubLogin();
  const{setUser}=useAuth();

  const isPending = loginPending || googlePending || githubPending;

  

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      login(
        { email: form.email, password: form.password },
        {
          onSuccess: () => router.push("/bulk-audio/generator"),
          onError: (err) => {
            // Handle error (show toast)
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // GitHub OAuth redirect
  const handleGithubLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
    const scope = "user:email";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  return (

  
    <div className="space-y-6">
      {/* Local Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
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
          <Label htmlFor="password">Password</Label>
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
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer text-on-surface-variant transition hover:text-primary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
          />
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-outline text-primary focus:ring-primary"
            />
            <span className="text-sm text-on-surface-variant">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-primary transition-colors hover:text-primary-container"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          loading={loading || loginPending}
          fullWidth
          size="lg"
          className="rounded-2xl"
        >
          Sign In
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-surface px-2 text-on-surface-variant">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Login */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const token = credentialResponse.credential;
            if (token) {
              googleLogin(token, {
                onSuccess: (data) => {
                  setUser(data)
                 
                  router.push("/");
                },
                onError: () => {
                  // Show error
                },
              });
            }
          }}
          onError={() => {
            console.error("Google login failed");
          }}
         
          shape="rectangular"
          size="large"
          width="300"
        />
      </div>

      {/* GitHub Login */}
      <Button
        onClick={handleGithubLogin}
        disabled={isPending}
        variant="outline"
        fullWidth
        size="lg"
        className="flex items-center justify-center gap-2 rounded-2xl"
      >
        <FaGithub size={20} />
        Sign in with GitHub
      </Button>
    </div>
  );
};