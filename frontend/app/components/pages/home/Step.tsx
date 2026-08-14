"use client";

import { motion } from "framer-motion";
import { STEPS } from "@/app/lib/constants";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";
import { Card } from "../../ui/Card";
import { fadeInUp, staggerContainer, scaleUp } from "@/app/lib/animations";
import { Background } from "../../ui/Background";

export const HowToUse = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Premium Background Pattern */}
      <Background/>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header with animation */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed/30 backdrop-blur-sm px-5 py-1.5 mb-4 shadow-sm">
              <span className="text-sm font-semibold text-primary">🚀 Simple Workflow</span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center justify-center">
            <Heading as="h2" size="4xl" weight="extrabold" className="leading-tight">
              Get Started in{" "}
              <Span size="5xl" weight="extrabold" className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%] bg-clip-text text-transparent animate-shimmer font-extrabold">
                6 Simple Steps
              </Span>
            </Heading>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Paragraph size="lg" className="mt-5 text-on-surface-variant/80 max-w-2xl mx-auto leading-relaxed text-center">
              From creating your ElevenLabs API key to downloading hundreds of generated voices,
              the entire workflow takes only a few minutes.
            </Paragraph>
          </motion.div>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              variants={scaleUp}
              whileHover={{ y: -12 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative"
            >
              <Card className="relative h-full rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-xl shadow-primary/5 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/15 overflow-hidden">
                {/* Glass overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Step Number - Large background */}
                <div className="absolute -right-2 -top-2 text-8xl font-black text-primary/5 group-hover:text-primary/10 transition-colors duration-500 select-none">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Content */}
                <div className="relative p-8 space-y-5">
                  {/* Icon Container */}
                  <div className="relative inline-block">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary shadow-inner group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/10">
                      <Icon size={30} className="group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    {/* Glow behind icon */}
                    <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10" />
                  </div>

                  {/* Title */}
                  <Heading as="h3" size="xl" weight="bold" className="text-on-surface group-hover:text-primary transition-colors duration-300">
                    {title}
                  </Heading>

                  {/* Description */}
                  <Paragraph className="leading-7 text-on-surface-variant/80 group-hover:text-on-surface-variant transition-colors duration-300">
                    {description}
                  </Paragraph>

                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500 pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};