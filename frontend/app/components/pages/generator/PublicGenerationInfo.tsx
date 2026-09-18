// app/components/pages/generator/PublicGeneratorInfo.tsx

export const PublicGeneratorInfo = () => {
  return (
    <section
      className="sr-only"
      aria-label="Bulk AI Voice Generator Information"
    >
      <h1>
        Bulk AI Voice Generator — Generate 100+ AI Voices with ElevenLabs &amp;
        Google AI Studio
      </h1>

      <p>
        This is a free bulk AI voice generator that converts hundreds of text
        scripts into natural-sounding AI voices using the{" "}
        <strong>ElevenLabs API</strong> or{" "}
        <strong>Google AI Studio (Gemini) Text-to-Speech</strong>. Generate up to
        100 audio files in a single batch, in 70+ languages, with voice cloning
        and emotional inflections. Download all MP3 files as a ZIP archive.
      </p>

      <p>
        <strong>Login required:</strong> You must create a free account to use
        the generator. Your ElevenLabs or Google AI Studio API key is encrypted
        with Fernet symmetric encryption and stored securely — never exposed in
        the browser.
      </p>

      <h2>How to Generate Bulk AI Voice Files</h2>
      <ol>
        <li>Login or create a free account</li>
        <li>Enter your ElevenLabs or Google AI Studio API key</li>
        <li>
          Paste your text scripts — separate each with a blank line. Every blank
          line becomes a separate audio file.
        </li>
        <li>
          Choose from thousands of AI voices in 70+ languages. Select voice
          profile, language, and emotional tone.
        </li>
        <li>
          Click Generate. Files stream in real-time — up to 100 files per batch.
        </li>
        <li>Download all MP3 files as a single ZIP archive.</li>
      </ol>

      <h2>Supported TTS Providers</h2>

      <h3>ElevenLabs</h3>
      <ul>
        <li>Ultra-realistic, human-like voices</li>
        <li>70+ languages via eleven_multilingual_v2 model</li>
        <li>Voice cloning for custom voice output</li>
        <li>Natural pauses, emotional inflections, contextual emphasis</li>
        <li>Best for professional content creation</li>
      </ul>

      <h3>Google AI Studio (Gemini)</h3>
      <ul>
        <li>WaveNet and Studio quality voices</li>
        <li>Excellent multilingual support</li>
        <li>SSML support for advanced speech control</li>
        <li>Generous free tier</li>
        <li>Best for high-volume, cost-sensitive projects</li>
      </ul>

      <h2>Use Cases for Bulk AI Voice Generation</h2>
      <ul>
        <li>YouTube video narration and Shorts voiceovers</li>
        <li>TikTok and Instagram Reels audio</li>
        <li>Faceless YouTube channel narration</li>
        <li>Audiobook and chapter narration</li>
        <li>Podcast intros, outros, and full episodes</li>
        <li>E-learning course narration</li>
        <li>Multi-character storytelling</li>
        <li>Product demo voiceovers</li>
        <li>Marketing and ad voiceovers in multiple languages</li>
      </ul>

      <h2>Why Choose This Bulk Voice Generator?</h2>
      <p>
        Unlike Murf AI, ElevenLabs Studio, or Google Cloud TTS — which focus on
        single-file generation — this tool is built for{" "}
        <strong>batch text-to-speech</strong>. Paste 100 scripts, get 100 files
        in one batch, download everything together as a ZIP. It's the fastest
        way to generate AI voiceovers at scale.
      </p>

      <h2>Frequently Asked Questions</h2>

      <h3>Do I need to login to use this tool?</h3>
      <p>
        Yes. Bulk Audio Generator requires a free account to use. Login ensures
        your API keys are stored securely and your generation history is
        preserved.
      </p>

      <h3>Is Bulk Audio Generator free?</h3>
      <p>
        Yes, the tool itself is completely free. You only pay for what you use
        through your own ElevenLabs or Google AI Studio account.
      </p>

      <h3>How many AI voice files can I generate at once?</h3>
      <p>
        You can generate up to 100 AI voice files per batch. Each script
        produces a separate audio file.
      </p>

      <h3>What languages are supported?</h3>
      <p>
        70+ languages including English, Spanish, French, German, Hindi,
        Japanese, Korean, Arabic, Portuguese, Italian, Russian, and many more.
      </p>

      <h3>Does it support voice cloning?</h3>
      <p>
        Yes. When using ElevenLabs, you can access thousands of pre-made voices
        and use voice cloning for custom voice output.
      </p>
    </section>
  );
};