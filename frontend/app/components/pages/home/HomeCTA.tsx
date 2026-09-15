// app/components/pages/home/HomeCTA.tsx
// ✅ Server Component

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../../ui/Button";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Card } from "../../ui/Card";

export const HomeCTA = () => {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="animate-slideInBottom">
          <Card className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-fixed via-white to-secondary-fixed p-10 text-center shadow-2xl shadow-primary/10 sm:p-16">
            {/* Decorative glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30">
                <Sparkles size={32} />
              </div>

              <Heading as="h2" size="3xl" weight="extrabold" className="text-on-background">
                Ready to Generate{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  100+ AI Voices
                </span>
                ?
              </Heading>

              <Paragraph size="lg" className="mx-auto mt-5 max-w-2xl text-on-surface-variant">
                Sign up free and start generating high-quality AI audio in bulk
                with ElevenLabs and Google AI Studio. No credit card required.
              </Paragraph>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/bulk-audio/generator">
                  <Button
                    size="lg"
                    className="group rounded-full bg-gradient-to-r from-primary to-secondary px-8 text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40"
                  >
                    Start Generating Free
                    <ArrowRight
                      size={18}
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </Button>
                </Link>
                <Link href="/bulk-audio/documentation">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-primary/20 px-8"
                  >
                    Read Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};