"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGithubLogin, useGoogleLogin } from "@/app/lib/auth/hooks";

export const OAuthHandler = () => {
  const searchParams = useSearchParams();
  const githubLogin = useGithubLogin();
  const googleLogin = useGoogleLogin();

  useEffect(() => {
    const code = searchParams.get("code");
    const provider = searchParams.get("provider");
    if (code && provider === "github") githubLogin.mutate(code);
    else if (code && provider === "google") googleLogin.mutate(code);
  }, [searchParams, githubLogin, googleLogin]);

  return null;
};