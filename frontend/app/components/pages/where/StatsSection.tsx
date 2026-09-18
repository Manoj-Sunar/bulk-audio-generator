// app/components/pages/landing/StatsSection.tsx
"use client";

import { motion } from "framer-motion";
import { Clock, FileAudio, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Heading } from "@/app/components/typography/Heading";
import { Paragraph } from "@/app/components/typography/Paragraph";

const STATS = [
  {
    icon: Clock,
    value: "47h",
    label: "Hours Saved",
    description: "Average time saved per video",
  },
  {
    icon: FileAudio,
    value: "75",
    label: "Audio Clips",
    description: "Generated for a 10-minute video",
  },
  {
    icon: Users,
    value: "500+",
    label: "Creators",
    description: "Trusted by content creators worldwide",
  },
  {
    icon: TrendingUp,
    value: "80%",
    label: "Faster",
    description: "Reduction in production time",
  },
];

export const StatsSection = () => {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="h-full border-0 bg-white/80 backdrop-blur-sm shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                  <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
                      <Icon size={24} />
                    </div>
                    <Heading
                      as="h3"
                      size="2xl"
                      weight="bold"
                      align="center"
                      className="text-slate-800"
                    >
                      {stat.value}
                    </Heading>
                    <Paragraph
                      weight="semibold"
                      align="center"
                      className="text-slate-600"
                    >
                      {stat.label}
                    </Paragraph>
                    <Paragraph
                      size="sm"
                      align="center"
                      className="mt-1 text-slate-400"
                    >
                      {stat.description}
                    </Paragraph>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};