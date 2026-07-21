import { FaGithub } from "react-icons/fa";
import type { IconType } from "react-icons";
import {
  LogIn,
  KeyRound,
  ClipboardPaste,
  FileText,
  AudioLines,
  Download,
} from "lucide-react";


export interface NavLink {
  name: string;
  href: string;
  icon?: IconType;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Documentation",
    href: "/bulk-audio/documentation",
  },
  {
    name: "Generator",
    href: "/bulk-audio/generator",
  },
  {
    name: "GitHub",
    href: "https://github.com/Manoj-Sunar/bulk-audio-generator",
    icon: FaGithub,
    external: true,
  },
];





//  steps

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
      "Copy the generated API key and paste it into the API Key field inside this application. Your key is used only for your requests.",
  },
  {
    icon: FileText,
    title: "Paste Your Scripts",
    description:
      "Paste multiple scripts into the editor. Separate each script with a blank line (double line break) so every paragraph becomes a separate audio file.",
  },
  {
    icon: AudioLines,
    title: "Generate Voices",
    description:
      "Choose your preferred voice and click Generate. The application processes all scripts one by one and creates individual audio files.",
  },
  {
    icon: Download,
    title: "Download ZIP",
    description:
      "When generation finishes, all audio files are automatically bundled into a ZIP archive ready to download to your computer.",
  },
];

export type ProgressLogStatus = "success" | "processing" | "error";
export interface ProgressLog {
  id: number;
  time: string;
  message: string;
  status: ProgressLogStatus;
}
export const logs: ProgressLog[] = [
  {
    id: 1,
    time: "12:44",
    message: "Generated introduction_01.mp3",
    status: "success",
  },
  {
    id: 2,
    time: "12:45",
    message: "Generated heading_intro.mp3",
    status: "success",
  },
  {
    id: 3,
    time: "12:46",
    message: "Generated section_01.mp3",
    status: "success",
  },
  {
    id: 4,
    time: "",
    message: "Processing ending.mp3...",
    status: "processing",
  },
];