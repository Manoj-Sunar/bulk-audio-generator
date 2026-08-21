// app/components/pages/generator/GeneratedFilesTable.tsx - Simplified version
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Archive, CheckCircle2, Download, Loader2, Pause, Play, Trash2, XCircle, Music, Globe, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Heading } from '../../typography/Heading';
import { Button } from '../../ui/Button';
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

// Helper to get provider label and color
const getProviderInfo = (provider: string) => {
  switch (provider) {
    case 'elevenlabs':
      return { label: 'ElevenLabs', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: <Globe size={12} /> };
    case 'gemini':
      return { label: 'Gemini', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <Sparkles size={12} /> };
    default:
      return { label: provider, color: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
  }
};

export const GeneratedFilesTable = ({ files, currentlyPlaying, onPlay, onDownload, onDelete, onDownloadZip }: GeneratedFilesTableProps) => {
  const successCount = files.filter(f => f.status === 'success').length;
  const hasSuccess = successCount > 0;

  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading as="h2" size="lg" weight="semibold" className="text-slate-800">
            Generated Files
          </Heading>
          <p className="text-sm text-slate-500">{successCount} of {files.length} ready</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 border border-slate-200">
            {files.length} Files
          </span>
          <Button
            leftIcon={<Archive size={16} />}
            disabled={!hasSuccess}
            onClick={onDownloadZip}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-60"
          >
            Download ZIP
          </Button>
        </div>
      </div>

      <CardContent className="p-0">
        {files.length === 0 ? (
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <Archive size={32} className="mx-auto text-slate-300" />
              <p className="mt-2 text-slate-600 font-medium">No files yet</p>
              <p className="text-sm text-slate-400">Generated files will appear here</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Preview</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Filename</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Provider / Format</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {files.map((file) => {
                    const isPlaying = currentlyPlaying === file.id;
                    const providerInfo = getProviderInfo(file.provider || 'elevenlabs');
                    
                    return (
                      <motion.tr
                        key={file.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-4 py-3">
                          {file.status === 'processing' ? (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                              <Loader2 size={16} className="animate-spin text-slate-400" />
                            </div>
                          ) : (
                            <button
                              onClick={() => onPlay?.(file)}
                              disabled={!file.audioUrl}
                              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                                isPlaying
                                  ? 'bg-red-500 text-white hover:bg-red-600'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              } disabled:opacity-50`}
                            >
                              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} className="ml-0.5" fill="currentColor" />}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Music size={15} className="text-slate-400" />
                            <span className="font-medium text-slate-700 text-sm truncate max-w-[160px]">{file.fileName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${providerInfo.color}`}>
                              {providerInfo.icon}
                              {providerInfo.label}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                              {file.format?.toUpperCase() || 'MP3'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium ${
                            file.status === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                            file.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {file.status === 'success' && <CheckCircle2 size={12} />}
                            {file.status === 'processing' && <Loader2 size={12} className="animate-spin" />}
                            {file.status === 'failed' && <XCircle size={12} />}
                            {file.status === 'success' ? 'Ready' : file.status === 'processing' ? 'Generating' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              disabled={file.status !== 'success'}
                              onClick={() => onDownload?.(file)}
                              className={`p-1.5 rounded transition ${
                                file.status === 'success' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'
                              }`}
                            >
                              <Download size={16} />
                            </button>
                            <button
                              disabled={file.status === 'processing'}
                              onClick={() => onDelete?.(file)}
                              className={`p-1.5 rounded transition ${
                                file.status === 'processing' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:bg-red-50 hover:text-red-600'
                              }`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};