"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, XCircle, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { fadeInUp, listItemVariants } from "@/app/lib/animations";

interface ProgressLog {
  id: number;
  time: string;
  message: string;
  status: "success" | "processing" | "error";
}

interface LiveProgressProps {
  total: number;
  completed: number;
  running: boolean;
  logs: ProgressLog[];
  onCancel?: () => void;
}

export const LiveProgress = ({
  total,
  completed,
  running,
  logs,
  onCancel,
}: LiveProgressProps) => {
  const progress = total === 0 ? 0 : (completed / total) * 100;
  const [eta, setEta] = useState("Calculating...");

  // Dynamic ETA Calculation
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const remaining = total - completed;
      if (remaining <= 0) setEta("Done!");
      else {
        const seconds = Math.max(1, remaining * 1.2);
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        setEta(`~${mins}m ${secs}s`);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [running, total, completed]);

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <Card className="overflow-hidden rounded-xl border-gray-100 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Heading as="h3" size="lg" weight="bold">
              ⚡ Live Progress
            </Heading>

            <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                running ? "bg-primary-fixed text-primary" : "bg-green-100 text-green-700"
              }`}
            >
              {running && <Loader2 size={14} className="animate-spin" />}
              {!running && logs[logs.length - 1]?.status === 'success' && <CheckCircle2 size={14} />}
              {!running && logs[logs.length - 1]?.status === 'error' && <XCircle size={14} />}
              {running ? "Processing" : logs[logs.length - 1]?.status === 'error' ? "Failed" : "Ready"}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Paragraph size="sm" className="text-on-surface-variant">Files Generated</Paragraph>
              <Paragraph size="sm" className="font-semibold text-primary">
                {completed} / {total}
              </Paragraph>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-surface-container">
              <motion.div
                className="relative h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            <Paragraph size="xs" className="text-on-surface-variant text-right">
              ETA • {eta}
            </Paragraph>
          </div>

          {/* Logs */}
          <div className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-outline-variant bg-surface-container/50 p-3">
            <AnimatePresence mode="popLayout">
              {logs.slice().reverse().map((log) => (
                <motion.div
                  key={log.id}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  layout
                  className="flex items-start gap-2 text-xs border-b border-gray-100/50 py-1.5 last:border-0"
                >
                  {log.status === "success" && <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-green-600" />}
                  {log.status === "processing" && <Loader2 size={14} className="mt-0.5 shrink-0 text-primary animate-spin" />}
                  {log.status === "error" && <XCircle size={14} className="mt-0.5 shrink-0 text-red-600" />}
                  
                  <span className="flex-1 text-gray-700">{log.message}</span>
                  <span className="text-gray-400 whitespace-nowrap">{log.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Cancel Button */}
          <AnimatePresence>
            {running && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                <Button variant="destructive" fullWidth leftIcon={<Square size={16} />} onClick={onCancel}>
                  Cancel Generation
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};