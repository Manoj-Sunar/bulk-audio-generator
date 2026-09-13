"use client";

import { Card, CardContent } from "../../ui/Card";
import { LoginFooter } from "./LoginFooter";
import { LoginForm } from "./LoginForm";
import { LoginHeader } from "./LoginHeader";

export const LoginCard = () => {
  return (
    <Card className="overflow-hidden rounded-[32px] border border-primary/10 bg-white/80 shadow-2xl shadow-primary/5 backdrop-blur-xl transition-all duration-300 hover:shadow-primary/10">
      <CardContent className="space-y-8 p-6 sm:p-8 md:p-10">
        <LoginHeader />
        <LoginForm />
        <LoginFooter />
      </CardContent>
    </Card>
  );
};