// app/components/pages/profile/StatsCard.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, XCircle, 
  BarChart3, FileAudio, TrendingUp,
  PieChart
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
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const successRate = stats.total > 0 ? Math.round(((stats.completed) / stats.total) * 100) : 0;

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden rounded-2xl bg-white">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <Heading as="h3" size="sm" weight="semibold" className="text-slate-800">
                Overview
              </Heading>
              <Paragraph size="xs" className="text-slate-500">
                Generation statistics
              </Paragraph>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Span size="xs" className="text-emerald-700 font-medium">Live</Span>
          </div>
        </div>

        {/* Main Stats - 3 Column */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/50 text-center">
            <Paragraph size="xs" className="text-blue-600 font-medium uppercase tracking-wider">
              Total
            </Paragraph>
            <Heading as="h4" size="2xl" weight="bold" className="text-blue-700">
              {stats.total}
            </Heading>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/50 text-center">
            <Paragraph size="xs" className="text-emerald-600 font-medium uppercase tracking-wider">
              Completed
            </Paragraph>
            <Heading as="h4" size="2xl" weight="bold" className="text-emerald-700">
              {stats.completed}
            </Heading>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/50 text-center">
            <Paragraph size="xs" className="text-purple-600 font-medium uppercase tracking-wider">
              Audio Files
            </Paragraph>
            <Heading as="h4" size="2xl" weight="bold" className="text-purple-700">
              {stats.totalSegments}
            </Heading>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <Span size="sm" className="text-slate-600 font-medium">Completion Rate</Span>
            </div>
            <Span size="sm" weight="bold" className="text-blue-600">
              {completionRate}%
            </Span>
          </div>
          
          <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>

          {/* Status Breakdown */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <Span size="xs" className="text-slate-600">
                {stats.completed} done
              </Span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <Span size="xs" className="text-slate-600">
                {stats.processing} running
              </Span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <Span size="xs" className="text-slate-600">
                {stats.failed} failed
              </Span>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-200/60">
          <div className="text-center">
            <Span size="xs" className="text-slate-400 block">Success Rate</Span>
            <Span size="sm" weight="bold" className="text-emerald-600">
              {successRate}%
            </Span>
          </div>
          <div className="text-center">
            <Span size="xs" className="text-slate-400 block">Avg Files/Gen</Span>
            <Span size="sm" weight="bold" className="text-slate-700">
              {stats.total > 0 ? (stats.totalSegments / stats.total).toFixed(1) : '0'}
            </Span>
          </div>
          <div className="text-center">
            <Span size="xs" className="text-slate-400 block">Status</Span>
            <Span size="sm" weight="bold" className="text-emerald-600">
              {stats.processing > 0 ? 'Running' : 'Idle'}
            </Span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};