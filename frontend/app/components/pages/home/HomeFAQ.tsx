// app/components/pages/home/HomeFAQ.tsx
// ✅ Server Component

import { HelpCircle } from "lucide-react";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Card } from "../../ui/Card";

const FAQ_ITEMS = [
  {
    q: "What is Bulk Audio Generator?",
    a: "Bulk Audio Generator is a free web tool that converts hundreds of text scripts into AI voices simultaneously using ElevenLabs or Google AI Studio APIs. You paste multiple scripts, generate all audio files at once, and download them as a ZIP archive.",
  },
  {
    q: "How many AI voices can I generate at once?",
    a: "You can generate up to 100 AI voice files in a single batch. Each script produces a separate audio file, and all files are bundled into a single ZIP archive for download.",
  },
  {
    q: "Do I need an ElevenLabs API key?",
    a: "Yes. Bulk Audio Generator uses your own ElevenLabs or Google AI Studio API key. Your key is encrypted with Fernet symmetric encryption and stored securely in our database — it is never exposed in the browser.",
  },
  {
    q: "Is Bulk Audio Generator free?",
    a: "Yes, Bulk Audio Generator is completely free to use. You only pay for what you use through your own ElevenLabs or Google AI Studio account.",
  },
  {
    q: "How long does bulk audio generation take?",
    a: "Generation happens in real-time as each script is processed. Most batches of 10-50 audio files complete in under 2 minutes, depending on the length of your scripts and your provider's API speed.",
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