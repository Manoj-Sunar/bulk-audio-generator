"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  XCircle,
  Square,
} from "lucide-react";

import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { fadeInUp, staggerContainer, listItemVariants } from "@/app/lib/animations";

interface ProgressLog {
  id: number;
  time: string;
  message: string;
  status: "success" | "processing" | "error";
}

interface LiveProgressProps {
  total: number;
  completed: number;
  eta: string;
  running: boolean;
  logs: ProgressLog[];
  onCancel?: () => void;
}

export const LiveProgress = ({
  total,
  completed,
  eta,
  running,
  logs,
  onCancel,
}: LiveProgressProps) => {
  const progress = total === 0 ? 0 : (completed / total) * 100;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden rounded-xl border-gray-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Heading as="h3" size="lg" weight="bold">
              ⚡ Live Progress
            </Heading>

            <motion.div
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                running
                  ? "bg-primary-fixed text-primary"
                  : "bg-green-100 text-green-700"
              }`}
              animate={running ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 1, repeat: running ? Infinity : 0 }}
            >
              {running && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={14} />
                </motion.div>
              )}
              {!running && <CheckCircle2 size={14} />}
              {running ? "Running" : "Completed"}
            </motion.div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Paragraph size="sm" className="text-on-surface-variant">
                Files Generated
              </Paragraph>
              <motion.div
                key={completed}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Paragraph size="sm" className="font-semibold text-primary">
                  {completed} / {total}
                </Paragraph>
              </motion.div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-surface-container">
              <motion.div
                className="relative h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>

            <motion.div
              key={eta}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paragraph size="sm" className="text-on-surface-variant">
                ETA • {eta}
              </Paragraph>
            </motion.div>
          </div>

          {/* Logs */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-outline-variant bg-surface-container/50 p-4"
          >
            <AnimatePresence mode="popLayout">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="flex items-start gap-3 text-sm"
                >
                  {log.status === "success" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-600" />
                    </motion.div>
                  )}
                  {log.status === "processing" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    </motion.div>
                  )}
                  {log.status === "error" && (
                    <XCircle size={16} className="mt-0.5 shrink-0 text-error" />
                  )}

                  <div className="flex flex-1 items-center justify-between gap-4">
                    <Paragraph
                      size="sm"
                      className={log.status === "processing" ? "animate-pulse" : ""}
                    >
                      {log.message}
                    </Paragraph>
                    <span className="text-xs text-on-surface-variant whitespace-nowrap">
                      {log.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <AnimatePresence>
            {running && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="destructive"
                    fullWidth
                    leftIcon={<Square size={16} />}
                    onClick={onCancel}
                  >
                    Cancel Generation
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};