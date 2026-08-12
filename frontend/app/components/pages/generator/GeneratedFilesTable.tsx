// src/app/components/pages/generator/GeneratedFilesTable.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Archive,
  CheckCircle2,
  Download,
  Loader2,
  Pause,
  Play,
  Trash2,
  XCircle,
  Music,
} from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Heading } from '../../typography/Heading';
import { Button } from '../../ui/Button';
import { staggerContainer, listItemVariants } from '@/app/lib/animations';
import { GeneratedAudioFile } from '@/app/types/generator';
import { memo } from 'react';

interface GeneratedFilesTableProps {
  files: GeneratedAudioFile[];
  currentlyPlaying: string | null;
  onPlay?: (file: GeneratedAudioFile) => void;
  onDownload?: (file: GeneratedAudioFile) => void;
  onDelete?: (file: GeneratedAudioFile) => void;
  onDownloadZip?: () => void;
}

const statusStyles = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  processing: 'bg-amber-50 text-amber-700 border-amber-200/80 animate-pulse',
  failed: 'bg-red-50 text-red-700 border-red-200/80',
};

const statusLabel = {
  success: '✓ Ready',
  processing: '⟳ Generating',
  failed: '✗ Failed',
};

const TableRow = memo(({
  file,
  currentlyPlaying,
  onPlay,
  onDownload,
  onDelete
}: {
  file: GeneratedAudioFile;
  currentlyPlaying: string | null;
  onPlay?: (file: GeneratedAudioFile) => void;
  onDownload?: (file: GeneratedAudioFile) => void;
  onDelete?: (file: GeneratedAudioFile) => void;
}) => {
  const isPlaying = currentlyPlaying === file.id;

  return (
    <motion.tr
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="border-b border-slate-100 transition-all duration-300 hover:bg-slate-50/80 group"
    >
      <td className="px-4 py-3">
        {file.status === 'processing' ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
            <Loader2 size={18} className="animate-spin text-amber-500" />
          </div>
        ) : (
          <button
            onClick={() => onPlay?.(file)}
            disabled={!file.audioUrl}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/25'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} className="ml-0.5" fill="currentColor" />
            )}
          </button>
        )}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Music size={16} className="text-slate-400" />
          <p className="font-medium text-slate-700 truncate max-w-[200px] text-sm">
            {file.fileName}
          </p>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[file.status]}`}>
          {file.status === 'success' && <CheckCircle2 size={12} />}
          {file.status === 'processing' && <Loader2 size={12} className="animate-spin" />}
          {file.status === 'failed' && <XCircle size={12} />}
          {statusLabel[file.status]}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1.5">
          <button
            disabled={file.status !== 'success'}
            onClick={() => onDownload?.(file)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              file.status === 'success'
                ? 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:scale-110'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <Download size={18} />
          </button>

          <button
            disabled={file.status === 'processing'}
            onClick={() => onDelete?.(file)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              file.status === 'processing'
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-400 hover:bg-red-50 hover:text-red-600 hover:scale-110'
            }`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
});

TableRow.displayName = 'TableRow';

export const GeneratedFilesTable = ({
  files,
  currentlyPlaying,
  onPlay,
  onDownload,
  onDelete,
  onDownloadZip,
}: GeneratedFilesTableProps) => {
  const hasSuccessFiles = files.some(f => f.status === 'success');
  const successCount = files.filter(f => f.status === 'success').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="group overflow-hidden rounded-2xl border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-indigo-200/20 transition-all duration-500">
        {/* Top gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex flex-col gap-4 border-b border-slate-200/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Heading as="h2" size="lg" weight="semibold" className="text-slate-800">
              🎵 Generated Files
            </Heading>
            <p className="mt-1 text-sm text-slate-500">
              {successCount} of {files.length} files ready for download
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-1.5 text-sm font-semibold text-indigo-700 border border-indigo-100/50">
              {files.length} Files
            </span>

            <Button
              leftIcon={<Archive size={18} />}
              disabled={!hasSuccessFiles}
              onClick={onDownloadZip}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 transition-all duration-300"
            >
              Download ZIP
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            {files.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex h-64 items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <Archive size={36} className="text-slate-300" />
                  </div>
                  <p className="text-slate-600 font-medium">No files generated yet</p>
                  <p className="text-sm text-slate-400 mt-1">Start generating to see results</p>
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
                  <thead>
                    <tr className="border-b border-slate-200/60 bg-slate-50/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Preview</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Filename</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {files.map((file) => (
                        <TableRow
                          key={file.id}
                          file={file}
                          currentlyPlaying={currentlyPlaying}
                          onPlay={onPlay}
                          onDownload={onDownload}
                          onDelete={onDelete}
                        />
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