"use client";

import { Card, CardContent } from "../../ui/Card";
import { LoginFooter } from "./LoginFooter";
import { LoginForm } from "./LoginForm";


import { LoginHeader } from "./LoginHeader";
import { SocialLogin } from "./SocialLogin";

export const LoginCard = () => {
    return (
        <Card
            className="
        overflow-hidden
        rounded-[28px]
        border-outline-variant
        bg-surface-container-lowest
        shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-primary/10
      "
        >
            <CardContent className="space-y-8 p-8 sm:p-10">
                <LoginHeader />

                <LoginForm />

                <SocialLogin />

                <LoginFooter />
            </CardContent>
        </Card>
    );
};