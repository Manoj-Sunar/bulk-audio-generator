// app/components/pages/profile/EmptyState.tsx
'use client';

import { motion } from 'framer-motion';
import { Music, Sparkles, ArrowRight, Wand2, Mic } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Heading } from '@/app/components/typography/Heading';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { Button } from '@/app/components/ui/Button';

export const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl bg-gradient-to-br from-white to-blue-50/30">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <CardContent className="p-16 text-center">
          {/* Animated icon */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mb-6 border border-blue-200/30"
          >
            <div className="relative">
              <Music className="w-14 h-14 text-blue-500" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-amber-500" />
              </motion.div>
            </div>
          </motion.div>
          
          <Heading as="h3" size="3xl" weight="extrabold" className="text-slate-800 mb-3 tracking-tight">
            No Generations Yet
          </Heading>
          
          <Paragraph size="lg" className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            You haven't created any audio generations yet. 
            <br />
            <span className="text-slate-400">Start generating amazing AI voices now!</span>
          </Paragraph>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/bulk-audio">
              <Button
                size="lg"
                leftIcon={<Wand2 className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 rounded-2xl px-8 py-6 text-base font-semibold group"
              >
                <span className="flex items-center gap-2">
                  Create Your First Generation
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </Button>
            </Link>
            
            <Link href="/documentation">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Mic className="w-5 h-5" />}
                className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 rounded-2xl px-8 py-6 text-base font-medium transition-all duration-300"
              >
                Learn How It Works
              </Button>
            </Link>
          </div>
          
          {/* Feature highlights */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: '🚀', label: 'Bulk Generation', desc: 'Generate 100+ files at once' },
              { icon: '🎙️', label: 'Premium Voices', desc: 'ElevenLabs & Gemini AI' },
              { icon: '📦', label: 'Instant ZIP', desc: 'Download all files together' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="p-4 rounded-xl bg-white/80 border border-slate-200/60 shadow-sm"
              >
                <div className="text-2xl mb-1">{feature.icon}</div>
                <Paragraph size="sm" weight="semibold" className="text-slate-700">
                  {feature.label}
                </Paragraph>
                <Paragraph size="xs" className="text-slate-400">
                  {feature.desc}
                </Paragraph>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};