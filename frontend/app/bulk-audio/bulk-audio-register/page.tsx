import { Register } from "@/app/components/pages/Registration/Register";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Create Account | Bulk Audio Generator",

  description:
    "Create your Bulk Audio Generator account and start generating hundreds of AI voice files with ElevenLabs.",

  keywords: [
    "register",
    "signup",
    "bulk audio generator",
    "ai voice generator",
    "elevenlabs",
    "text to speech",
    "bulk text to speech",
    "bulk ai voice",
  ],

  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return <Register />;
}