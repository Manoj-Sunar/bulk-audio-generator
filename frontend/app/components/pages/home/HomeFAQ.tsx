// app/components/pages/home/HomeFAQ.tsx
// ✅ Server Component

import { HelpCircle } from "lucide-react";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Card } from "../../ui/Card";
const FAQ_ITEMS = [
  {
    q: "What is the best free AI voice generator for bulk generation?",
    a: "Bulk Audio Generator is a popular free AI voice generator built specifically for bulk generation. It uses the ElevenLabs API and Google AI Studio (Gemini) TTS to convert up to 100 text scripts into AI voices in one batch, then downloads everything as a ZIP archive. No subscription or credit card is required.",
  },
  {
    q: "How do I generate bulk AI voice files with ElevenLabs?",
    a: "Get an ElevenLabs API key from your dashboard, paste it into Bulk Audio Generator, then paste your scripts separated by blank lines. Click Generate — each script becomes a separate MP3 file, and all files are bundled into a ZIP for download. You can generate up to 100 files per batch using the eleven_multilingual_v2 model.",
  },
  {
    q: "Is Bulk Audio Generator a good Murf AI alternative?",
    a: "Yes — Bulk Audio Generator is one of the best free Murf AI alternatives for bulk voice generation. Unlike Murf AI, which focuses on single-file editing, Bulk Audio Generator processes 100+ audio files per batch and downloads everything as a ZIP. It's completely free, with no subscription required.",
  },
  {
    q: "How many languages does the AI voice generator support?",
    a: "Bulk Audio Generator supports 70+ languages including English, Spanish, French, German, Hindi, Japanese, Korean, Arabic, Portuguese, Italian, Russian, and many more. Language support comes from ElevenLabs' multilingual v2 model and Google AI Studio's WaveNet voices.",
  },
  {
    q: "Does it support voice cloning and emotions?",
    a: "Yes. When using ElevenLabs, you can access thousands of pre-made voices and use voice cloning for a custom voice. The platform captures natural pauses, emotional inflections, and contextual emphasis — ideal for storytelling, YouTube narration, ads, and audiobooks.",
  },
  {
    q: "How many AI voice files can I generate at once?",
    a: "You can generate up to 100 AI voice files in a single batch. Each script produces a separate audio file, and all files are bundled into a single ZIP archive for download.",
  },
  {
    q: "Is Bulk Audio Generator free to use?",
    a: "Yes, Bulk Audio Generator is completely free. There are no subscriptions, no hidden fees, and no credit card required. You only pay for what you use through your own ElevenLabs or Google AI Studio account.",
  },
  {
    q: "Can I use this for YouTube and TikTok voiceovers?",
    a: "Absolutely. Bulk Audio Generator is designed for AI video creators. Generate voiceovers for YouTube videos, YouTube Shorts, TikTok videos, Instagram Reels, faceless channels, podcasts, and audiobooks. Download all MP3 files as a ZIP and import directly into CapCut, Premiere Pro, or Final Cut.",
  },
  {
    q: "How long does bulk audio generation take?",
    a: "Generation happens in real-time as each script is processed. Most batches of 10–50 audio files complete in under 2 minutes, depending on script length and your provider's API speed.",
  },
  {
    q: "Is my API key stored securely?",
    a: "Yes. Your ElevenLabs or Google AI Studio API key is encrypted with Fernet symmetric encryption and stored in our database. The raw key is never persisted in your browser or exposed to any third party.",
  },
] as const;
export const HomeFAQ = () => {
  return (
    <section
      className="relative py-16 lg:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto max-w-4xl px-6">
        <div className="animate-slideInBottom mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/60 px-5 py-2 backdrop-blur-sm shadow-sm">
            <HelpCircle size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              Frequently Asked Questions
            </span>
          </div>

          <h2
            id="faq-heading"
            className="text-3xl font-extrabold leading-tight text-on-background sm:text-4xl"
          >
            Bulk Audio Generation —{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Common Questions
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <Card
              key={item.q}
              className="animate-slideInBottom overflow-hidden rounded-2xl border border-outline-variant bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Heading as="h3" size="lg" weight="bold" className="text-on-surface">
                {item.q}
              </Heading>
              <Paragraph className="mt-3 leading-7 text-on-surface-variant">
                {item.a}
              </Paragraph>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};