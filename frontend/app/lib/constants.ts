// app/lib/constants.ts
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import type { IconType } from "react-icons";
import {
  LogIn,
  KeyRound,
  ClipboardPaste,
  FileText,
  AudioLines,
  Download,
  Home,
  BookOpen,
  Mic,
} from "lucide-react";

// Navigation Links
export interface NavLink {
  name: string;
  href: string;
  icon?: IconType;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Documentation", href: "/bulk-audio/documentation", icon: BookOpen },
  { name: "Generator", href: "/bulk-audio/generator", icon: Mic },
  {
    name: "GitHub",
    href: "https://github.com/Manoj-Sunar",
    icon: FaGithub,
    external: true,
  },
];

// Steps for home page
export const STEPS = [
  {
    icon: LogIn,
    title: "Sign in to ElevenLabs",
    description:
      "Create an ElevenLabs account or sign in to your existing account before using the generator.",
  },
  {
    icon: KeyRound,
    title: "Create an API Key",
    description:
      "Open your ElevenLabs dashboard, navigate to API Keys, and create a new API key for this application.",
  },
  {
    icon: ClipboardPaste,
    title: "Paste Your API Key",
    description:
      "Copy the generated API key and paste it into the API Key field inside this application.",
  },
  {
    icon: FileText,
    title: "Paste Your Scripts",
    description:
      "Paste multiple scripts into the editor. Separate each script with a blank line.",
  },
  {
    icon: AudioLines,
    title: "Generate Voices",
    description:
      "Choose your preferred voice and click Generate. The application processes all scripts.",
  },
  {
    icon: Download,
    title: "Download ZIP",
    description:
      "When generation finishes, all audio files are bundled into a ZIP archive ready to download.",
  },
];

// Social Links
export const SOCIAL_LINKS = [
  { icon: FaGithub, href: "https://github.com/Manoj-Sunar", label: "GitHub" },
  { icon: FaTwitter, href: "https://x.com/home", label: "Twitter" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/feed/", label: "LinkedIn" },
];

// Route Constants
export const ROUTES = {
  HOME: "/",
  LOGIN: "/bulk-audio/bulk-audio-login",
  REGISTER: "/bulk-audio/bulk-audio-register",
  GENERATOR: "/bulk-audio/generator",
  PROFILE: "/bulk-audio/profile",
  DOCUMENTATION: "/bulk-audio/documentation",
  FORGOT_PASSWORD: "/bulk-audio/forgot-password",
  RESET_PASSWORD: "/bulk-audio/reset-password",
  GITHUB_CALLBACK: "/github/callback",
  GOOGLE_CALLBACK: "/google/callback",
} as const;

// API Routes
export const API_ROUTES = {
  USER_ME: "/user/me",
  USER_LOGIN: "/user/login",
  USER_REGISTER: "/user/register",
  USER_LOGOUT: "/user/logout",
  USER_REFRESH: "/user/refresh",
  USER_GOOGLE: "/user/google",
  USER_GITHUB: "/user/github",
  USER_REQUEST_PASSWORD_RESET: "/user/request-password-reset",
  USER_VERIFY_OTP: "/user/verify-otp",
  USER_RESET_PASSWORD: "/user/reset-password",
  AUDIO_GENERATE: "/audio/generate",
  AUDIO_GENERATE_STREAM: "/audio/generate-stream",
  AUDIO_GENERATE_PLAY: "/audio/generate-play",
  AUDIO_GENERATIONS: "/audio/generations",
  AUDIO_GENERATION: "/audio/generation",
} as const;

// Voice Options
export const ELEVENLABS_VOICES = [
  { value: "pNInz6obpgDQGcFmaJgB", label: "🎙️ Adam (Default)" },
  { value: "21m00Tcm4TlvDq8ikWAM", label: "🎙️ Rachel" },
  { value: "AZnzlk1XvdvUeBnXmlld", label: "🎙️ Domi" },
  { value: "EXAVITQu4vrIxn12LM3J", label: "🎙️ Bella" },
  { value: "yoZ06aMxZJJ28mfd3POQ", label: "🎙️ Sam" },
];

export const GEMINI_VOICES = [
  { value: "Kore", label: "🗣️ Kore" },
  { value: "Charon", label: "🗣️ Charon" },
  { value: "Fenrir", label: "🗣️ Fenrir" },
  { value: "Aoede", label: "🗣️ Aoede" },
  { value: "Puck", label: "🗣️ Puck" },
  { value: "Leda", label: "🗣️ Leda" },
];

// Provider Info
export const PROVIDERS = {
  ELEVENLABS: "elevenlabs" as const,
  GEMINI: "gemini" as const,
} as const;

export const PROVIDER_LABELS = {
  [PROVIDERS.ELEVENLABS]: "ElevenLabs",
  [PROVIDERS.GEMINI]: "Gemini",
} as const;

// File Formats
export const AUDIO_FORMATS = {
  MP3: "mp3" as const,
  WAV: "wav" as const,
} as const;

export const MIME_TYPES = {
  [AUDIO_FORMATS.MP3]: "audio/mpeg",
  [AUDIO_FORMATS.WAV]: "audio/wav",
} as const;

// Password Requirements
export const PASSWORD_REQUIREMENTS = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Contains a number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Contains a special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];