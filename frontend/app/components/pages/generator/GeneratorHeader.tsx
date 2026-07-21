"use client";

import { motion } from "framer-motion";
import { AudioLines, Sparkles, Zap, Download } from "lucide-react";
import { Paragraph } from "../../typography/Paragraph";
import { Heading } from "../../typography/Heading";
import { Span } from "../../typography/Span";
import { Card } from "../../ui/Card";
import { fadeInUp, staggerContainer, scaleUp, floatAnimation } from "@/app/lib/animations";

const STATS = [
  {
    icon: AudioLines,
    title: "Unlimited",
    subtitle: "Audio Generation",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0.1,
  },
  {
    icon: Zap,
    title: "Parallel",
    subtitle: "Voice Processing",
    gradient: "from-purple-500 to-pink-500",
    delay: 0.2,
  },
  {
    icon: Download,
    title: "ZIP",
    subtitle: "One Click Download",
    gradient: "from-green-500 to-emerald-500",
    delay: 0.3,
  },
];

export const GeneratorHeader = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          variants={floatAnimation}
          initial="initial"
          animate="animate"
          className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]"
        />
        <motion.div
          variants={floatAnimation}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute bottom-0 right-0 h-[480px] w-[480px] rounded-full bg-secondary/10 blur-[160px]"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-fixed/40 blur-[120px]"
        />
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center"
      >
        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-fixed/50 px-5 py-2 shadow-sm backdrop-blur-sm"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles size={18} className="text-primary" />
          </motion.div>
          <Paragraph size="sm" className="font-semibold text-primary">
            Powered by ElevenLabs API
          </Paragraph>
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeInUp}>
          <Heading as="h1" size="4xl" weight="extrabold" className="max-w-5xl leading-tight">
            Generate
            <Span
              className="mx-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
              weight="extrabold"
            >
              Bulk AI Voices
            </Span>
            in Seconds
          </Heading>
        </motion.div>

        {/* Description */}
        <motion.div 
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <Paragraph
            size="lg"
            className="mt-8 max-w-3xl leading-8 text-on-surface-variant"
          >
            Convert hundreds of text scripts into natural sounding AI voices
            using your own ElevenLabs API key. Generate multiple audio files
            simultaneously and automatically download everything as a ZIP archive.
          </Paragraph>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={staggerContainer}
          className="mt-14 grid w-full gap-6 md:grid-cols-3"
        >
          {STATS.map(({ icon: Icon, title, subtitle, gradient, delay }) => (
            <motion.div
              key={title}
              variants={scaleUp}
              transition={{ delay }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <Card className="group rounded-3xl border-outline-variant bg-white/50 backdrop-blur-sm transition-all duration-500 hover:border-primary hover:shadow-2xl">
                <div className="flex flex-col items-center p-8">
                  <motion.div
                    className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white`}
                    whileHover={{ 
                      rotate: 15,
                      scale: 1.1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon size={30} />
                  </motion.div>

                  <Heading as="h3" size="xl" weight="bold">
                    {title}
                  </Heading>

                  <Paragraph className="mt-2 text-center text-on-surface-variant">
                    {subtitle}
                  </Paragraph>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};