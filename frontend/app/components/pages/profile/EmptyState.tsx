// app/components/pages/profile/EmptyState.tsx
'use client';

import { motion } from 'framer-motion';
import { Music, Sparkles, ArrowRight, Wand2, Mic, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Heading } from '@/app/components/typography/Heading';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { Button } from '@/app/components/ui/Button';

export const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden rounded-2xl bg-white">
        <CardContent className="p-12 text-center">
          {/* Animated Icon */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-6 border border-blue-200/50"
          >
            <div className="relative">
              <Music className="w-12 h-12 text-blue-500" />
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
              </motion.div>
            </div>
          </motion.div>

          <Heading as="h3" size="2xl" weight="bold" className="text-slate-800 mb-2">
            No Generations Yet
          </Heading>
          
          <Paragraph className="text-slate-500 max-w-sm mx-auto mb-8">
            Start creating amazing AI voices with ElevenLabs or Gemini.
            <br />
            <span className="text-slate-400">It only takes a few clicks!</span>
          </Paragraph>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/bulk-audio/generator">
              <Button
                size="lg"
                leftIcon={<Wand2 className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 rounded-xl px-6 py-5 text-sm font-semibold"
              >
                Create Your First Generation
              </Button>
            </Link>
            
            <Link href="/bulk-audio/documentation">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Mic className="w-4 h-4" />}
                className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 rounded-xl px-6 py-5 text-sm font-medium"
              >
                Learn How It Works
              </Button>
            </Link>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mt-8">
            {[
              { icon: '🚀', label: 'Bulk Generation' },
              { icon: '🎙️', label: 'Premium Voices' },
              { icon: '📦', label: 'Instant ZIP' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center"
              >
                <div className="text-xl mb-0.5">{feature.icon}</div>
                <Paragraph size="xs" className="text-slate-600 font-medium">
                  {feature.label}
                </Paragraph>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};