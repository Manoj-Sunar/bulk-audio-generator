// app/components/pages/home/Step.tsx
// ✅ Server Component

import { STEPS } from "@/app/lib/constants";
import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";
import { Card } from "../../ui/Card";
import { Background } from "../../ui/Background";

export const HowToUse = () => {
  return (
    <section
      className="relative py-16 lg:py-24 overflow-hidden"
      aria-labelledby="how-to-use-heading"
    >
      <Background />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="animate-slideInBottom mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed/30 px-5 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="text-sm font-semibold text-primary">
              🚀 Simple Workflow
            </span>
          </div>

          {/* ✅ H2 — Secondary keyword */}
          <h2
            id="how-to-use-heading"
            className="text-3xl font-extrabold leading-tight text-on-background sm:text-4xl"
          >
            How to Generate Bulk AI Voices in{" "}
            <Span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              6 Simple Steps
            </Span>
          </h2>

          <Paragraph
            size="lg"
            className="mx-auto mt-5 max-w-2xl leading-relaxed text-on-surface-variant/80"
          >
            From creating your ElevenLabs or Google AI Studio API key to
            downloading hundreds of generated voices — the entire bulk
            text-to-speech workflow takes only a few minutes.
          </Paragraph>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="animate-slideInBottom group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="relative h-full overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-xl shadow-primary/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-3 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/15">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Step number */}
                <div className="pointer-events-none absolute -right-2 -top-2 select-none text-8xl font-black text-primary/5 transition-colors duration-500 group-hover:text-primary/10">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="relative space-y-5 p-8">
                  <div className="relative inline-block">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary shadow-inner transition-all duration-300 group-hover:scale-105 group-hover:from-primary/20 group-hover:to-secondary/20">
                      <Icon
                        size={30}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* ✅ H3 for each step */}
                  <h3 className="text-xl font-bold text-on-surface transition-colors duration-300 group-hover:text-primary">
                    {title}
                  </h3>

                  <Paragraph className="leading-7 text-on-surface-variant/80">
                    {description}
                  </Paragraph>

                  {index === 0 && (
                    <div className="flex gap-2 pt-2">
                      <span className="rounded-full border border-primary/10 bg-primary-fixed/30 px-3 py-1 text-xs font-medium text-primary">
                        ElevenLabs
                      </span>
                      <span className="rounded-full border border-secondary/10 bg-secondary-fixed/30 px-3 py-1 text-xs font-medium text-secondary">
                        Google AI Studio
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};