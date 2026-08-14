// app/profile/components/EmptyState.tsx
'use client';

import { motion } from 'framer-motion';
import { Music, Sparkles, ArrowRight } from 'lucide-react';
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
      transition={{ duration: 0.2 }}
    >
      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Music className="w-10 h-10 text-slate-400" />
          </div>
          
          <Heading as="h3" size="lg" weight="semibold" className="text-slate-800 mb-2">
            No Generations Yet
          </Heading>
          
          <Paragraph className="text-slate-500 max-w-md mx-auto mb-6">
            You haven't created any audio generations yet. Start generating amazing AI voices now!
          </Paragraph>
          
          <Link href="/bulk-audio">
            <Button
              size="lg"
              leftIcon={<Sparkles className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              Start Generating
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};