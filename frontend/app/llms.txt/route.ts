// app/llms.txt/route.ts
const content = `# Bulk Audio Generator

> Bulk Audio Generator converts hundreds of text scripts into natural-sounding AI voiceovers in one click, producing perfectly timed audio clips for AI video creation, YouTube automation, TikTok, and audiobook production.

## About
- URL: https://bulk-audio-generator.vercel.app
- Canonical home: https://bulk-audio-generator.vercel.app/bulk-audio/where
- Category: AI Audio Generation, Text-to-Speech, Voice Synthesis
- Tech: ElevenLabs API, Google Gemini, Next.js

## Key Pages
- [Home](https://bulk-audio-generator.vercel.app/bulk-audio/where): Overview of bulk audio generation for AI videos
- [Generator](https://bulk-audio-generator.vercel.app/generator): Main tool to generate 100+ audio clips at once
- [Documentation](https://bulk-audio-generator.vercel.app/bulk-audio/documentation): Usage guide and API reference

## Features
- Generate up to 100 AI voice clips simultaneously
- Support for ElevenLabs and Google Gemini voices (40+ voices)
- One-click ZIP export for CapCut, Premiere Pro, Final Cut
- Smart script parsing with auto-formatting
- Perfect audio-video sync for AI video creators

## Use Cases
- YouTube automation and Shorts
- TikTok and Instagram Reels voiceovers
- Multi-character story narration
- Podcast and audiobook production
- E-learning and course narration

## Pricing
- Free to start, no credit card required
`;

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}