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
    >
      <Card className="hover:shadow-xl hover:shadow-indigo-200/20 transition-all duration-500">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
            <Music className="w-10 h-10 text-indigo-500" />
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
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35"
            >
              Start Generating
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};