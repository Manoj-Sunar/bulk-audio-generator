"use client";

import { Button } from "../../ui/Button";


interface CopyEmailButtonProps {
  email: string;
}

export const CopyEmailButton = ({ email }: CopyEmailButtonProps) => {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-primary hover:bg-primary/10"
      onClick={() => {
        navigator.clipboard.writeText(email);
      }}
    >
      Copy
    </Button>
  );
};