// app/components/pages/home/HomeSEOContent.tsx
// ✅ Server Component

export const HomeSEOContent = () => {
  return (
    <section
      className="relative py-16 lg:py-24"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto max-w-4xl px-6">
        <div className="animate-slideInBottom">
          {/* ===== PRIMARY H2 ===== */}
          <h2
            id="about-heading"
            className="text-3xl font-extrabold leading-tight text-on-background sm:text-4xl"
          >
            Free AI Voice Generator — Generate Bulk AI Voice Files with
            ElevenLabs &amp; Google AI Studio
          </h2>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            <strong>Bulk Audio Generator</strong> is a free, browser-based AI
            voice generator that converts hundreds of text scripts into
            natural-sounding AI voices in a single click. Powered by the{" "}
            <strong>ElevenLabs API</strong> and{" "}
            <strong>Google AI Studio (Gemini) Text-to-Speech</strong>, it's built
            for creators who need to generate <strong>bulk AI voice files</strong>{" "}
            — from 10 to 100+ audio clips per batch — without the manual
            copy-paste grind of traditional TTS tools.
          </p>

          <p className="mt-4 text-lg leading-8 text-on-surface-variant">
            Unlike <strong>Murf AI</strong>, ElevenLabs Studio, or Google Cloud
            TTS — which focus on one file at a time — Bulk Audio Generator is
            designed for <strong>batch text-to-speech</strong>. Paste hundreds
            of scripts, choose from thousands of voices across 70+ languages,
            and download everything together as a ZIP archive. It's the fastest
            way to generate AI voiceovers for YouTube videos, TikTok Shorts,
            audiobooks, podcasts, ads, and e-learning content.
          </p>

          {/* ===== H2: HOW BULK GENERATION WORKS ===== */}
          <h2 className="mt-14 text-2xl font-bold text-on-background sm:text-3xl">
            How Bulk AI Voice Generation Works
          </h2>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Bulk AI voice generation combines three things: <strong>API access</strong>{" "}
            to a text-to-speech provider, <strong>batch processing</strong> of
            multiple scripts, and <strong>ZIP export</strong> for one-click
            download. Here's how it works end-to-end:
          </p>

          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-primary">
                1. API Access — ElevenLabs or Google AI Studio
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                Send multiple text scripts programmatically using the{" "}
                <strong>ElevenLabs API</strong> or{" "}
                <strong>Google AI Studio's Gemini TTS API</strong>. Your API key
                is encrypted with Fernet symmetric encryption and stored
                securely — it's never exposed in the browser.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-primary">
                2. Projects &amp; Studio — Paste Hundreds of Scripts
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                Paste or upload long-form content — book chapters, multiple ad
                lines, YouTube Shorts scripts, or dozens of product descriptions
                — directly into the script editor. Separate each script with a
                blank line, and every blank line becomes a separate audio file.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-primary">
                3. Batch Export — Download All Files Together
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                Process hundreds of lines or distinct audio files and download
                them all together as a single ZIP archive. Each MP3 is named
                based on your script title, ready to import into CapCut,
                Premiere Pro, Final Cut, or DaVinci Resolve.
              </p>
            </div>
          </div>

          {/* ===== H2: KEY FEATURES ===== */}
          <h2 className="mt-14 text-2xl font-bold text-on-background sm:text-3xl">
            Key Platform Features
          </h2>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Bulk Audio Generator combines the best of ElevenLabs and Google AI
            Studio into one streamlined workflow:
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-primary">
                🌍 70+ Languages
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                Generate realistic AI voices in over <strong>70 different languages</strong>{" "}
                — English, Spanish, French, German, Hindi, Japanese, Korean,
                Arabic, Portuguese, Italian, and many more. Perfect for
                multilingual YouTube channels and global ad campaigns.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-primary">
                🎭 Emotions &amp; Natural Speech
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                Capture <strong>natural pauses, emotional inflections, and
                contextual emphasis</strong>. ElevenLabs' multilingual v2 model
                delivers human-like narration — ideal for storytelling,
                audiobooks, and emotional YouTube content.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-primary">
                🎤 Thousands of Voices + Voice Cloning
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                Choose from <strong>thousands of pre-made voices</strong> or use{" "}
                <strong>voice cloning</strong> to create a custom voice from
                your own audio sample. Match any character, brand, or accent.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-primary">
                ⚡ Real-Time Streaming
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                Every file streams to your browser as soon as it's ready — no
                waiting for the whole batch. Watch live progress, then download
                everything as a <strong>ZIP archive</strong> with one click.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-primary">
                🔒 Enterprise-Grade Security
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                API keys are encrypted with <strong>Fernet symmetric encryption</strong>{" "}
                and stored in the database. The raw key is never persisted in
                your browser or exposed to any third party.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-primary">
                📦 Instant ZIP Download
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                Download all generated MP3 files as a single ZIP archive. Each
                file is named based on your script title — no manual renaming
                required.
              </p>
            </div>
          </div>

          {/* ===== H2: USE CASES ===== */}
          <h2 className="mt-14 text-2xl font-bold text-on-background sm:text-3xl">
            Who Uses Bulk Audio Generator?
          </h2>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Our free AI voice generator is trusted by creators across different
            industries:
          </p>

          <ul className="mt-6 list-disc space-y-3 pl-6 text-lg leading-8 text-on-surface-variant">
            <li>
              <strong>YouTube creators</strong> — produce narration for faceless
              channels, YouTube Shorts, and long-form videos. Generate 75+ audio
              clips in minutes instead of hours.
            </li>
            <li>
              <strong>TikTok &amp; Instagram creators</strong> — generate
              voiceovers for Reels and TikToks in bulk, in any language.
            </li>
            <li>
              <strong>E-learning developers</strong> — convert course materials
              and training documents into audio lessons.
            </li>
            <li>
              <strong>Podcasters &amp; audiobook producers</strong> — generate
              intros, outros, chapter narrations, and multi-language versions.
            </li>
            <li>
              <strong>AI video producers</strong> — create perfectly timed
              voiceovers for AI-generated video scenes.
            </li>
            <li>
              <strong>Marketing agencies</strong> — deliver voiceover projects
              for multiple clients faster and at lower cost.
            </li>
          </ul>

          {/* ===== H2: ELEVENLABS VS GOOGLE AI STUDIO ===== */}
          <h2 className="mt-14 text-2xl font-bold text-on-background sm:text-3xl">
            ElevenLabs vs Google AI Studio — Which Should You Choose?
          </h2>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Bulk Audio Generator supports both major text-to-speech providers,
            so you can pick the one that best fits your project:
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-primary/10 bg-primary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-primary">
                ElevenLabs (Recommended)
              </h3>
              <ul className="mt-4 space-y-2 text-on-surface-variant">
                <li>✓ Ultra-realistic, human-like voices</li>
                <li>✓ 70+ languages via eleven_multilingual_v2</li>
                <li>✓ Voice cloning for custom output</li>
                <li>✓ Emotional inflections &amp; natural pauses</li>
                <li>✓ Best for professional content</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-secondary/10 bg-secondary-fixed/20 p-6">
              <h3 className="text-lg font-bold text-secondary">
                Google AI Studio (Gemini)
              </h3>
              <ul className="mt-4 space-y-2 text-on-surface-variant">
                <li>✓ WaveNet and Studio quality voices</li>
                <li>✓ Excellent multilingual support</li>
                <li>✓ SSML for advanced speech control</li>
                <li>✓ Competitive pricing with generous free tier</li>
                <li>✓ Great for high-volume, cost-sensitive projects</li>
              </ul>
            </div>
          </div>

          {/* ===== H2: BEST FREE MURF AI ALTERNATIVE ===== */}
          <h2 className="mt-14 text-2xl font-bold text-on-background sm:text-3xl">
            The Best Free Murf AI Alternative for Bulk Voice Generation
          </h2>

          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            If you're searching for a <strong>Murf AI alternative</strong> that
            handles bulk generation, Bulk Audio Generator is built exactly for
            that. Murf AI is excellent for single-file editing, but when you
            need to generate 50+ voice files for a video or audiobook, its
            workflow becomes slow and repetitive.
          </p>

          <p className="mt-4 text-lg leading-8 text-on-surface-variant">
            Bulk Audio Generator is <strong>completely free</strong> — no
            subscription, no credit card. You only pay for what you use through
            your own ElevenLabs or Google AI Studio account. Combine that with
            100-file batch processing, 70+ language support, and instant ZIP
            download, and you get the most efficient bulk voice workflow
            available.
          </p>

          {/* ===== H2: HOW TO USE ===== */}
          <h2 className="mt-14 text-2xl font-bold text-on-background sm:text-3xl">
            How to Generate Bulk AI Voice Files (Step-by-Step)
          </h2>

          <ol className="mt-6 list-decimal space-y-3 pl-6 text-lg leading-8 text-on-surface-variant">
            <li>
              <strong>Get your API key</strong> — Sign up at ElevenLabs or
              Google AI Studio and create an API key. Free tiers are available
              on both.
            </li>
            <li>
              <strong>Paste your scripts</strong> — Separate each script with a
              blank line. Every blank line = one audio file.
            </li>
            <li>
              <strong>Choose voice, language &amp; emotions</strong> — Pick from
              thousands of voices across 70+ languages.
            </li>
            <li>
              <strong>Click Generate</strong> — Files stream in real-time, up to
              100 per batch.
            </li>
            <li>
              <strong>Download ZIP</strong> — One click downloads all files,
              ready for CapCut, Premiere Pro, or Final Cut.
            </li>
          </ol>

          <p className="mt-8 text-lg leading-8 text-on-surface-variant">
            Bulk Audio Generator is completely free — you only pay for what you
            use through your own ElevenLabs or Google AI Studio account. No
            subscription, no hidden fees, no credit card required. Start
            generating hundreds of high-quality AI voices today.
          </p>
        </div>
      </div>
    </section>
  );
};