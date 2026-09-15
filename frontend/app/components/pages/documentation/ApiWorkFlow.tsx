// app/components/pages/documentation/ApiWorkFlow.tsx
import {
  ArrowRight,
  Brain,
  Download,
  ServerCog,
  Sparkles,
  Upload,
} from "lucide-react";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";

const WORKFLOW_STEPS = [
  {
    icon: Upload,
    title: "User Input",
    color: "bg-primary-fixed text-primary",
    description:
      "Paste your API key (ElevenLabs or Google AI Studio) and multiple scripts separated by blank lines.",
  },
  {
    icon: Sparkles,
    title: "Frontend Processing",
    color: "bg-secondary-fixed text-secondary",
    description:
      "Validates the input, prepares the request and sends it securely to the backend.",
  },
  {
    icon: ServerCog,
    title: "Backend Processing",
    color: "bg-primary-fixed text-primary",
    description:
      "Processes every script, manages requests, queues generation and communicates with the selected TTS provider.",
  },
  {
    icon: Brain,
    title: "TTS Provider API",
    color: "bg-secondary-fixed text-secondary",
    description:
      "Generates realistic AI voices using ElevenLabs or Google AI Studio's Text-to-Speech.",
  },
  {
    icon: Download,
    title: "ZIP Download",
    color: "bg-primary-fixed text-primary",
    description:
      "All generated MP3 files are compressed into a ZIP archive and downloaded instantly.",
  },
] as const;

export const ApiWorkflowSection = () => {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-5 py-2 text-primary">
            <ServerCog size={16} />
            <span className="text-sm font-semibold">System Workflow</span>
          </div>

          <Heading as="h2" size="3xl" weight="extrabold">
            How Audio Generation
            <span className="text-primary"> Works</span>
          </Heading>

          <Paragraph className="mt-5 text-on-surface-variant">
            Every request follows a secure workflow from your browser to the
            backend, then to your chosen TTS provider (ElevenLabs or Google AI
            Studio), before returning a ZIP containing all generated audio files.
          </Paragraph>
        </div>

        {/* Workflow Steps */}
        <div className="grid gap-8 lg:grid-cols-5">
          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <Card className="group h-full rounded-3xl border-outline-variant transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <CardContent className="flex h-full flex-col items-center p-8 text-center">
                    <div
                      className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${step.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={36} />
                    </div>
                    <Heading as="h4" size="lg" weight="bold">
                      {step.title}
                    </Heading>
                    <Paragraph className="mt-4 text-on-surface-variant">
                      {step.description}
                    </Paragraph>
                  </CardContent>
                </Card>

                {index !== WORKFLOW_STEPS.length - 1 && (
                  <div className="absolute -right-6 top-1/2 hidden -translate-y-1/2 lg:flex">
                    <div className="rounded-full bg-primary p-3 text-white shadow-lg">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="mt-20">
          <Card className="rounded-3xl border-primary/20 bg-primary-fixed shadow-sm">
            <CardContent className="p-10">
              <Heading as="h3" size="2xl" weight="bold">
                Complete Request Lifecycle
              </Heading>
              <Paragraph className="mt-6 leading-8 text-on-surface-variant">
                Your browser never generates audio directly. The frontend
                validates your scripts and securely sends them to the backend.
                The backend communicates with your chosen TTS provider
                (ElevenLabs or Google AI Studio), generates every audio file,
                bundles them into a ZIP archive, and returns the download to
                your browser. This architecture keeps the application secure,
                scalable and easy to maintain.
              </Paragraph>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};