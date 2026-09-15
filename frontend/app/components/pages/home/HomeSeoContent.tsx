// app/components/pages/home/HomeSEOContent.tsx
// ✅ Server Component

import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";

export const HomeSEOContent = () => {
  return (
    <section
      className="relative py-16 lg:py-24"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto max-w-4xl px-6">
        <div className="animate-slideInBottom">
          <h2
            id="about-heading"
            className="text-3xl font-extrabold leading-tight text-on-background sm:text-4xl"
          >
            What is Bulk Audio Generator?
          </h2>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            <strong>Bulk Audio Generator</strong> is a free, browser-based tool
            that lets creators convert hundreds of text scripts into
            natural-sounding AI voices in a single click. Unlike traditional
            text-to-speech tools that generate one file at a time, our platform
            processes all your scripts in parallel and delivers every audio file
            together as a downloadable ZIP archive.
          </p>

          <p className="mt-4 text-lg leading-8 text-on-surface-variant">
            Whether you are a{" "}
            <strong>YouTube creator producing AI video content</strong>, a
            podcaster generating multiple intros, an e-learning developer
            converting lessons into audio, or an AI video producer who needs
            perfectly-timed voiceovers, Bulk Audio Generator helps you produce
            hundreds of high-quality voice files in minutes rather than hours.
          </p>

          <h3 className="mt-12 text-2xl font-bold text-on-background">
            Why Choose Bulk Audio Generation Over Manual Workflow?
          </h3>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Manually generating 100 audio files takes hours — you open your TTS
            dashboard, paste each script one by one, wait for each file, then
            download and rename each file individually. With bulk audio
            generation, the entire process happens in one streamlined workflow:
          </p>

          <ul className="mt-6 list-disc space-y-2 pl-6 text-lg leading-8 text-on-surface-variant">
            <li>
              <strong>Paste hundreds of scripts at once</strong> — separate them
              with a blank line and each becomes a separate audio file.
            </li>
            <li>
              <strong>Real-time streaming generation</strong> — every file is
              generated and streamed to your browser as soon as it is ready.
            </li>
            <li>
              <strong>Automatic naming and packaging</strong> — each file is
              named based on your script title and bundled into a ZIP archive.
            </li>
            <li>
              <strong>Choose your TTS provider</strong> — switch between
              ElevenLabs (premium voice quality) and Google AI Studio
              (multilingual support) with a single click.
            </li>
            <li>
              <strong>Secure API key storage</strong> — your key is encrypted
              with Fernet symmetric encryption and never exposed in the
              browser.
            </li>
          </ul>

          <h3 className="mt-12 text-2xl font-bold text-on-background">
            Who Uses Bulk Audio Generator?
          </h3>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Our platform is trusted by creators across different industries:
          </p>

          <ul className="mt-6 list-disc space-y-2 pl-6 text-lg leading-8 text-on-surface-variant">
            <li>
              <strong>Content creators</strong> — produce narration for faceless
              YouTube channels, TikTok videos, and Instagram Reels.
            </li>
            <li>
              <strong>E-learning developers</strong> — convert course materials
              and training documents into audio lessons.
            </li>
            <li>
              <strong>Podcasters</strong> — generate intros, outros, and
              multi-language versions of episodes.
            </li>
            <li>
              <strong>AI video producers</strong> — create perfectly timed
              voiceovers for AI-generated video scenes.
            </li>
            <li>
              <strong>Agencies</strong> — deliver voiceover projects for
              multiple clients faster and at lower cost.
            </li>
          </ul>

          <h3 className="mt-12 text-2xl font-bold text-on-background">
            ElevenLabs vs Google AI Studio — Which Should You Choose?
          </h3>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Bulk Audio Generator supports both major text-to-speech providers,
            so you can pick the one that best fits your project:
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h4 className="text-lg font-bold text-primary">ElevenLabs</h4>
              <ul className="mt-4 space-y-2 text-on-surface-variant">
                <li>✓ Ultra-realistic, human-like voices</li>
                <li>✓ Wide variety of voice profiles</li>
                <li>✓ Advanced emotion and accent control</li>
                <li>✓ Best for professional content</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-secondary/10 bg-secondary-fixed/20 p-6">
              <h4 className="text-lg font-bold text-secondary">
                Google AI Studio
              </h4>
              <ul className="mt-4 space-y-2 text-on-surface-variant">
                <li>✓ WaveNet and Studio quality voices</li>
                <li>✓ Excellent multilingual support</li>
                <li>✓ SSML for advanced speech control</li>
                <li>✓ Competitive pricing with free tier</li>
              </ul>
            </div>
          </div>

          <h3 className="mt-12 text-2xl font-bold text-on-background">
            Start Generating Bulk AI Voices Today
          </h3>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Bulk Audio Generator is completely free — you only pay for what you
            use through your own ElevenLabs or Google AI Studio account. No
            subscription, no hidden fees, no credit card required. Sign up in
            seconds, paste your scripts, and start generating hundreds of
            high-quality AI voices today.
          </p>
        </div>
      </div>
    </section>
  );
};