// app/profile/components/StatsCard.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Music, 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp,
  Activity,
  Sparkles,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react';
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
    {
      label: 'Total Generations',
      value: stats.total,
      icon: Music,
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-200/50',
      gradient: 'from-indigo-500/10 to-purple-500/10'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'emerald',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200/50',
      gradient: 'from-emerald-500/10 to-green-500/10'
    },
    {
      label: 'Processing',
      value: stats.processing,
      icon: Clock,
      color: 'amber',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200/50',
      gradient: 'from-amber-500/10 to-orange-500/10'
    },
    {
      label: 'Failed',
      value: stats.failed,
      icon: XCircle,
      color: 'red',
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200/50',
      gradient: 'from-red-500/10 to-rose-500/10'
    },
    {
      label: 'Audio Files',
      value: stats.totalSegments,
      icon: TrendingUp,
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200/50',
      gradient: 'from-purple-500/10 to-pink-500/10'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-indigo-200/20 transition-all duration-500">
        <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading as="h3" size="sm" weight="semibold" className="text-slate-700">
              📊 Analytics
            </Heading>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/50">
              <Activity className="w-3 h-3 text-indigo-600" />
              <Span size="xs" weight="medium" className="text-indigo-700">
                Live
              </Span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {statItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} border ${item.border} hover:scale-[1.02] transition-all duration-300 cursor-default`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${item.bg}`}>
                    <item.icon className={`w-3.5 h-3.5 ${item.text}`} />
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