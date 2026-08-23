// app/components/pages/profile/StatsCard.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, XCircle, 
  BarChart3, FileAudio, Layers 
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
      label: 'Total', 
      value: stats.total, 
      icon: Layers, 
      gradient: 'from-blue-50 to-blue-100/50',
      border: 'border-blue-200',
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    { 
      label: 'Completed', 
      value: stats.completed, 
      icon: CheckCircle, 
      gradient: 'from-emerald-50 to-emerald-100/50',
      border: 'border-emerald-200',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100'
    },
    { 
      label: 'Processing', 
      value: stats.processing, 
      icon: Clock, 
      gradient: 'from-amber-50 to-amber-100/50',
      border: 'border-amber-200',
      color: 'text-amber-600',
      bg: 'bg-amber-100'
    },
    { 
      label: 'Failed', 
      value: stats.failed, 
      icon: XCircle, 
      gradient: 'from-red-50 to-red-100/50',
      border: 'border-red-200',
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    { 
      label: 'Audio Files', 
      value: stats.totalSegments, 
      icon: FileAudio, 
      gradient: 'from-purple-50 to-purple-100/50',
      border: 'border-purple-200',
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl bg-white">
        <CardContent className="p-5 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 md:p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <Heading as="h3" size="md" weight="bold" className="text-slate-800">
                  Analytics
                </Heading>
                <Paragraph size="xs" className="text-slate-500">
                  Real-time stats
                </Paragraph>
              </div>
            </div>
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Span size="xs" className="text-emerald-700 font-medium hidden sm:inline">Live</Span>
            </motion.div>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {statItems.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -3, scale: 1.03 }}
                className={`p-3 md:p-4 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} transition-all duration-300 group cursor-default shadow-sm hover:shadow-md`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-1.5 md:p-2 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </motion.div>
                  </div>
                  <div>
                    <Span size="xl" weight="extrabold" className="text-slate-900 block leading-tight">
                      {item.value}
                    </Span>
                    <Paragraph size="xs" className="text-slate-500 font-medium mt-0.5 truncate">
                      {item.label}
                    </Paragraph>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-5 pt-5 border-t border-slate-200"
          >
            <div className="flex items-center justify-between text-sm">
              <Span size="sm" className="text-slate-500">Completion Rate</Span>
              <Span size="sm" weight="bold" className="text-blue-600">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </Span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mt-2">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};