"use client";

import { Card, CardContent } from "../../ui/Card";

import { RegisterHeader } from "./RegisterHeader";
import { RegisterForm } from "./RegisterForm";
import { SocialRegister } from "./SocialRegister";
import { RegisterFooter } from "./RegisterFooter";


interface RegisterCardProps {
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

  onGoogleRegister?: () => void;
  onGithubRegister?: () => void;

  googleLoading?: boolean;
  githubLoading?: boolean;
}

export const RegisterCard = ({
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
  onGoogleRegister,
  onGithubRegister,
  googleLoading = false,
  githubLoading = false,
}: RegisterCardProps) => {
  return (
    <Card
      className="
        overflow-hidden
        rounded-[32px]
        border
        border-outline-variant
        bg-surface-container-lowest/90
        shadow-2xl
        backdrop-blur-xl
      "
    >
      <CardContent className="space-y-10 p-8 md:p-10 lg:p-12">
        {/* Header */}

        <RegisterHeader />

        {/* Form */}

        <RegisterForm
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          loading={loading}
          onNameChange={onNameChange}
          onEmailChange={onEmailChange}
          onPasswordChange={onPasswordChange}
          onConfirmPasswordChange={onConfirmPasswordChange}
          onSubmit={onSubmit}
        />

        {/* OAuth */}

        <SocialRegister
          onGoogleRegister={onGoogleRegister}
          onGithubRegister={onGithubRegister}
          googleLoading={googleLoading}
          githubLoading={githubLoading}
        />

        {/* Footer */}

        <RegisterFooter />
      </CardContent>
    </Card>
  );
};