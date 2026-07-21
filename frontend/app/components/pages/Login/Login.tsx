"use client";

import { Background } from "../../ui/Background";
import { LoginCard } from "./LoginCard";


export const Login = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <Background />

      <div className="relative z-10 w-full max-w-md">
        <LoginCard />
      </div>
    </main>
  );
};