// app/profile/components/StatsCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Music, CheckCircle, Clock, XCircle, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Heading } from '@/app/components/typography/Heading';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { Span } from '@/app/components/typography/Span';

interface StatsCardProps {
  stats: {
    total: number;
    completed: number;
    processing: number;
    failed: number;
    totalSegments: number;
  };
}

export const StatsCard = ({ stats }: StatsCardProps) => {
  const statItems = [
    { label: 'Total', value: stats.total, icon: Music, colorClass: 'bg-slate-100 text-slate-600' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, colorClass: 'bg-emerald-100 text-emerald-600' },
    { label: 'Processing', value: stats.processing, icon: Clock, colorClass: 'bg-blue-100 text-blue-600' },
    { label: 'Failed', value: stats.failed, icon: XCircle, colorClass: 'bg-red-100 text-red-600' },
    { label: 'Audio Files', value: stats.totalSegments, icon: TrendingUp, colorClass: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Heading as="h3" size="sm" weight="semibold" className="text-slate-700">
              Analytics
            </Heading>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
              <Activity className="w-3 h-3 text-slate-500" />
              <Span size="xs" className="text-slate-600">Live</Span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {statItems.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${item.colorClass}`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <Span size="lg" weight="bold" className="text-slate-800 block leading-none">
                      {item.value}
                    </Span>
                    <Paragraph size="xs" className="text-slate-500 mt-0.5">
                      {item.label}
                    </Paragraph>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};