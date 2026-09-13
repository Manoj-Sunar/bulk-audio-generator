// app/components/pages/generator/LiveProgress.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle, Square, Activity, Waves, Gauge, Zap, Clock } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { Heading } from '../../typography/Heading';
import { Paragraph } from '../../typography/Paragraph';
import { fadeInUp, listItemVariants } from '@/app/lib/animations';
import { GenerationLog } from '@/app/types/generator';

interface ProgressLog{
  id: number;
  time: string;
  message: string;
  status: 'success' | 'processing' | 'error';
}

interface LiveProgressProps {
  total: number;
  completed: number;
  running: boolean;
  logs: ProgressLog[];
  onCancel?: () => void;
  estimatedTimePerFile?: number;
  currentFile?: string;
}

export const LiveProgress = ({
  total,
  completed,
  running,
  logs,
  onCancel,
  estimatedTimePerFile = 2.5,
  currentFile = '',
}: LiveProgressProps) => {
  const progress = total === 0 ? 0 : (completed / total) * 100;
  const [elapsed, setElapsed] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const stats = useMemo(() => ({
    successCount: logs.filter(l => l.status === 'success').length,
    errorCount: logs.filter(l => l.status === 'error').length,
    processingCount: logs.filter(l => l.status === 'processing').length,
  }), [logs]);

  // Timer for elapsed time
  useEffect(() => {
    if (!running) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsed((Date.now() - startTime) / 1000);
    }, 100);
    return () => clearInterval(timer);
  }, [running]);

  const eta = useMemo(() => {
    if (!running || completed === 0) return 'Calculating...';
    const remaining = total - completed;
    if (remaining <= 0) return '✨ Complete!';
    const speed = completed / Math.max(elapsed, 1);
    const estimatedSeconds = remaining / Math.max(speed, 0.1);
    const adjusted = Math.max(estimatedSeconds, remaining * estimatedTimePerFile);
    if (adjusted < 60) return `${Math.ceil(adjusted)}s`;
    const mins = Math.floor(adjusted / 60);
    const secs = Math.ceil(adjusted % 60);
    return `~${mins}m ${secs}s`;
  }, [running, completed, total, elapsed, estimatedTimePerFile]);

  const processingSpeed = useMemo(() => {
    return completed / Math.max(elapsed, 1);
  }, [completed, elapsed]);

  useEffect(() => {
    if (completed === total && total > 0 && !running) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [completed, total, running]);

  const formatElapsed = () => {
    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <Card className="group overflow-hidden rounded-2xl border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-indigo-200/20 transition-all duration-500">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="space-y-5 py-5 px-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <motion.div animate={running ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                <Activity size={20} className="text-indigo-600" />
              </motion.div>
              <Heading as="h3" size="md" weight="semibold" className="text-slate-800">Live Progress</Heading>
            </div>
            <motion.div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
              running ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/80' :
              stats.errorCount > 0 ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200/80' :
              'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200/80'
            }`} animate={running ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 1, repeat: Infinity }}>
              {running ? <><Loader2 size={12} className="animate-spin" /> Processing</> :
               stats.errorCount > 0 ? <><XCircle size={12} /> Failed</> :
               <><CheckCircle2 size={12} /> Complete</>}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Progress</span>
                {running && <motion.span animate={{ opacity: [0.5,1,0.5] }} transition={{ duration:0.8, repeat:Infinity }} className="text-xs text-indigo-400">● Live</motion.span>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-indigo-600">{completed} / {total}</span>
                <span className="text-sm font-medium text-slate-400">({Math.round(progress)}%)</span>
              </div>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-slate-100/80">
              <motion.div className="relative h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                {progress > 0 && progress < 100 && (
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" animate={{ x: ['-100%','100%'] }} transition={{ duration:1.5, repeat:Infinity, ease:'linear' }} />
                )}
                {progress > 0 && progress < 100 && (
                  <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white/40 rounded-full blur-sm" animate={{ scale: [1,1.5,1] }} transition={{ duration:0.8, repeat:Infinity }} />
                )}
              </motion.div>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="flex items-center gap-1.5"><div className="p-1 rounded bg-emerald-100/50"><CheckCircle2 size={12} className="text-emerald-600" /></div><span className="text-xs font-medium text-slate-600">{stats.successCount}</span></div>
              <div className="flex items-center gap-1.5"><div className="p-1 rounded bg-amber-100/50"><Loader2 size={12} className="text-amber-600 animate-spin" /></div><span className="text-xs font-medium text-slate-600">{stats.processingCount}</span></div>
              <div className="flex items-center gap-1.5"><div className="p-1 rounded bg-red-100/50"><XCircle size={12} className="text-red-600" /></div><span className="text-xs font-medium text-slate-600">{stats.errorCount}</span></div>
              <div className="flex items-center gap-1.5"><div className="p-1 rounded bg-indigo-100/50"><Zap size={12} className="text-indigo-600" /></div><span className="text-xs font-medium text-slate-600">{processingSpeed ? `${processingSpeed.toFixed(1)}/s` : '0/s'}</span></div>
            </div>
          </div>

          {/* ETA and Time */}
          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-50/80 to-indigo-50/80 border border-slate-200/60 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /><span className="text-xs text-slate-500">ETA</span></div>
              <motion.span key={eta} initial={{ opacity:0, y:-5 }} animate={{ opacity:1, y:0 }} className="text-sm font-semibold text-indigo-600">{eta}</motion.span>
            </div>
            <div className="flex items-center gap-1.5"><Gauge size={14} className="text-slate-400" /><span className="text-xs text-slate-500">Elapsed: {formatElapsed()}</span></div>
          </div>

          {/* Current file */}
          {running && currentFile && (
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-2 rounded-lg bg-indigo-50/50 border border-indigo-100/50 px-3 py-2">
              <Waves size={14} className="text-indigo-500 animate-pulse" />
              <span className="text-xs text-slate-600 truncate flex-1">Generating: <span className="font-medium text-indigo-700">{currentFile}</span></span>
            </motion.div>
          )}

          {/* Logs */}
          <div className="relative">
            <div className="max-h-56 space-y-0.5 overflow-y-auto rounded-xl bg-slate-50/80 border border-slate-200/60 p-2">
              <AnimatePresence mode="popLayout">
                {logs.slice().reverse().map((log) => (
                  <motion.div key={log.id} variants={listItemVariants} initial="hidden" animate="visible" layout className="flex items-start gap-2.5 text-xs py-1.5 px-2.5 rounded-lg hover:bg-white/50 transition-colors group">
                    <div className="mt-0.5">
                      {log.status === 'success' && <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300 }}><CheckCircle2 size={14} className="shrink-0 text-emerald-500" /></motion.div>}
                      {log.status === 'processing' && <Loader2 size={14} className="shrink-0 text-amber-500 animate-spin" />}
                      {log.status === 'error' && <XCircle size={14} className="shrink-0 text-red-500" />}
                    </div>
                    <span className="flex-1 text-slate-600 leading-relaxed">{log.message}</span>
                    <span className="text-slate-400 whitespace-nowrap font-mono text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">{log.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {logs.length > 3 && <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50/80 to-transparent pointer-events-none" />}
          </div>

          {/* Cancel Button */}
          <AnimatePresence>
            {running && (
              <motion.div initial={{ opacity:0, y:10, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.95 }}>
                <Button variant="destructive" fullWidth leftIcon={<Square size={16} />} onClick={onCancel} className="rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/35 transition-all duration-300">
                  Cancel Generation
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Celebration */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }} className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
                <div className="text-center">
                  <motion.div animate={{ scale: [1,1.2,1], rotate: [0,10,-10,0] }} transition={{ duration:0.5 }}>
                    <span className="text-6xl">🎉</span>
                  </motion.div>
                  <Heading as="h4" size="md" className="mt-2 text-slate-800">All {total} files generated!</Heading>
                  <Paragraph className="text-slate-500">Ready for download</Paragraph>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};