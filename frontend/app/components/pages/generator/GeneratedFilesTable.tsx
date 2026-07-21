"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  CheckCircle2,
  Download,
  Loader2,
  Play,
  Square,
  Trash2,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Button } from "../../ui/Button";
import { staggerContainer, listItemVariants, scaleUp } from "@/app/lib/animations";

export interface GeneratedAudioFile {
  id: string;
  fileName: string;
  duration?: string;
  status: "success" | "processing" | "failed";
  audioUrl?: string;
}

interface GeneratedFilesTableProps {
  files: GeneratedAudioFile[];
  onPlay?: (file: GeneratedAudioFile) => void;
  onDownload?: (file: GeneratedAudioFile) => void;
  onDelete?: (file: GeneratedAudioFile) => void;
  onDownloadZip?: () => void;
}

const statusStyles = {
  success: "bg-green-100 text-green-700 border-green-200",
  processing: "bg-primary-fixed text-primary border-primary/20 animate-pulse",
  failed: "bg-error-container text-error border-error/20",
};

const statusLabel = {
  success: "SUCCESS",
  processing: "GENERATING",
  failed: "FAILED",
};

export const GeneratedFilesTable = ({
  files,
  onPlay,
  onDownload,
  onDelete,
  onDownloadZip,
}: GeneratedFilesTableProps) => {
  const hasSuccessFiles = files.some(f => f.status === "success");
  const successCount = files.filter(f => f.status === "success").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden rounded-xl border-gray-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-outline-variant px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Heading as="h2" size="xl" weight="bold">
              Generated Files
            </Heading>
            <motion.p 
              className="mt-1 text-sm text-on-surface-variant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {successCount} of {files.length} files are ready to download.
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            <motion.span 
              className="rounded-full bg-primary-fixed px-3 py-1 text-sm font-semibold text-primary"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {files.length} Files
            </motion.span>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                leftIcon={<Archive size={18} />}
                disabled={!hasSuccessFiles}
                onClick={onDownloadZip}
              >
                Download ZIP
              </Button>
            </motion.div>
          </div>
        </div>

        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            {files.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex h-64 items-center justify-center text-on-surface-variant"
              >
                <div className="text-center">
                  <Archive size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No generated files yet.</p>
                  <p className="text-sm">Start generating audio to see results here.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="overflow-x-auto"
              >
                <table className="min-w-full">
                  <thead className="bg-surface-container/50">
                    <tr className="border-b border-outline-variant">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Preview
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Filename
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {files.map((file) => (
                        <motion.tr
                          key={file.id}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="border-b border-outline-variant transition-all duration-300 hover:bg-surface-container-low"
                        >
                          {/* Preview */}
                          <td className="px-6 py-4">
                            {file.status === "processing" ? (
                              <motion.div 
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <Loader2 size={18} className="text-primary" />
                              </motion.div>
                            ) : (
                              <motion.button
                                onClick={() => onPlay?.(file)}
                                disabled={!file.audioUrl}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Play size={18} className="ml-0.5" fill="currentColor" />
                              </motion.button>
                            )}
                          </td>

                          {/* Name */}
                          <td className="px-6 py-4">
                            <p className="font-medium text-on-surface">
                              {file.fileName}
                            </p>
                          </td>

                          {/* Duration */}
                          <td className="px-6 py-4 text-on-surface-variant">
                            {file.duration ?? "--"}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <motion.span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[file.status]}`}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              {file.status === "success" && <CheckCircle2 size={14} />}
                              {file.status === "processing" && (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <Loader2 size={14} />
                                </motion.div>
                              )}
                              {file.status === "failed" && <XCircle size={14} />}
                              {statusLabel[file.status]}
                            </motion.span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  disabled={file.status !== "success"}
                                  onClick={() => onDownload?.(file)}
                                  className="transition-all duration-300 hover:text-primary"
                                >
                                  <Download size={18} />
                                </Button>
                              </motion.div>

                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  disabled={file.status === "processing"}
                                  onClick={() => onDelete?.(file)}
                                  className="transition-all duration-300 hover:text-red-500"
                                >
                                  {file.status === "processing" ? (
                                    <Square size={18} />
                                  ) : (
                                    <Trash2 size={18} />
                                  )}
                                </Button>
                              </motion.div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};