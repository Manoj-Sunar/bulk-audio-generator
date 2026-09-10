"use client";
import { Suspense } from "react";
import { Background } from "../../ui/Background";
import { LoginCard } from "./LoginCard";

import { motion } from "framer-motion";
import { OAuthHandler } from "./OAuthHandler";

export const Login = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:py-16">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Suspense fallback={null}>
          <OAuthHandler />
        </Suspense>
        <LoginCard />
      </motion.div>
    </main>
  );
};