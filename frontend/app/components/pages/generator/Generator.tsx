// src/app/components/pages/generator/Generator.tsx
'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { useAuth } from '@/app/lib/auth/context';
import { useGenerateAndPlayAudio } from '@/app/lib/audio/hook';
import { GeneratedAudioFile, GenerationLog } from '@/app/types/generator';
import { ApiKeyCard } from './ApiKeyCard';
import { ScriptEditorCard } from './ScriptEditor';
import { LiveProgress } from './LiveProgress';
import { GeneratedFilesTable } from './GeneratedFilesTable';
import { Background } from '../../ui/Background';
import { fadeInLeft, fadeInRight, staggerContainer } from '@/app/lib/animations';
import { extractErrorMessage } from '@/app/lib/axios/client';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, Clock, Layers, Loader2 } from 'lucide-react';

const initialLogs: GenerationLog[] = [
  { id: 0, time: new Date().toLocaleTimeString(), message: '🚀 System ready. Waiting for scripts...', status: 'success' },
];

function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'audio/mp3';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export const Generator = () => {
  const { user, isLoading: authLoading } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const [apiKey, setApiKey] = useState('');
  const [scripts, setScripts] = useState('');
  const [voiceId, setVoiceId] = useState('pNInz6obpgDQGcFmaJgB');
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  const [logs, setLogs] = useState<GenerationLog[]>(initialLogs);
  const [files, setFiles] = useState<GeneratedAudioFile[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: generateAudio, isPending } = useGenerateAndPlayAudio();

  const stats = useMemo(() => {
    const completed = files.filter(f => f.status === 'success').length;
    return { total: files.length, completed };
  }, [files]);

  const handleGenerate = useCallback(() => {
    if (!scripts.trim()) {
      toast.error('Please enter some scripts');
      return;
    }

    const chunks = scripts.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    if (chunks.length === 0) {
      toast.error('No valid scripts found');
      return;
    }
    if (chunks.length > 100) {
      toast.error('Too many scripts (max 100)');
      return;
    }
    if (!apiKey.trim()) {
      toast.error('Please enter your ElevenLabs API key');
      return;
    }

    setStatus('generating');
    setLogs([]);
    setFiles([]);
    setErrorMessage(null);

    generateAudio(
      {
        script: scripts,
        api_keys: [apiKey],
        voice_id: voiceId,
        model_id: 'eleven_multilingual_v2',
      },
      {
        onSuccess: (data) => {
          if (data.segments && data.segments.length > 0) {
            const audioFiles = data.segments.map((seg) => ({
              id: seg.id.toString(),
              fileName: `${seg.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
              status: 'success' as const,
              audioUrl: `data:audio/mp3;base64,${seg.audio_data}`,
              blob: dataURLtoBlob(`data:audio/mp3;base64,${seg.audio_data}`),
              index: seg.index,
              created_at: seg.created_at || undefined,
            }));
            setFiles(audioFiles);
            setStatus('completed');

            const newLogs = audioFiles.map((file, index) => ({
              id: Date.now() + index,
              time: new Date().toLocaleTimeString(),
              message: `✅ Generated: ${file.fileName}`,
              status: 'success' as const,
            }));
            setLogs(prev => [...prev, ...newLogs]);
            toast.success(`✨ Generated ${audioFiles.length} audio files`);
          } else {
            setStatus('failed');
            toast.error('No audio segments were generated');
          }
        },
        onError: (error: any) => {
          setStatus('failed');
          const message = extractErrorMessage(error);
          setErrorMessage(message);
          toast.error(message);
        },
      }
    );
  }, [scripts, apiKey, voiceId, generateAudio]);

  const handleCancel = useCallback(() => {
    setStatus('failed');
    toast.info('Generation cancelled');
  }, []);

  const handlePlay = useCallback((file: GeneratedAudioFile) => {
    if (!file.audioUrl) return;

    if (currentlyPlaying === file.id) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    const audio = new Audio(file.audioUrl);
    audioRef.current = audio;
    audio.play().catch(console.error);
    setCurrentlyPlaying(file.id);

    audio.onended = () => {
      setCurrentlyPlaying(null);
      audioRef.current = null;
    };
  }, [currentlyPlaying]);

  const handleDownload = useCallback((file: GeneratedAudioFile) => {
    if (!file.audioUrl) return;
    const link = document.createElement('a');
    link.href = file.audioUrl;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  const handleDelete = useCallback((file: GeneratedAudioFile) => {
    setFiles(prev => prev.filter(f => f.id !== file.id));
    toast.info(`🗑️ Removed: ${file.fileName}`);
  }, []);

  const handleDownloadZip = useCallback(async () => {
    const successFiles = files.filter(f => f.status === 'success');
    if (successFiles.length === 0) {
      toast.error('No completed files to download');
      return;
    }

    try {
      toast.info(`📦 Zipping ${successFiles.length} files...`);
      const zip = new JSZip();

      for (const file of successFiles) {
        if (file.blob) {
          zip.file(file.fileName, file.blob);
        } else if (file.audioUrl) {
          const res = await fetch(file.audioUrl);
          const blob = await res.blob();
          zip.file(file.fileName, blob);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bulk-audio-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('📥 ZIP downloaded successfully!');
    } catch (error) {
      toast.error('Failed to create ZIP file');
      console.error(error);
    }
  }, [files]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/bulk-audio/bulk-audio-login');
    }
  }, [user, authLoading, router]);

  // 🎯 PREMIUM LOADING STATE – full‑page loader
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl font-semibold text-slate-700"
          >
            Loading your workspace…
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-slate-400"
          >
            Please wait while we prepare your session
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30"
    >
      <Background />

      {/* Error Display (unchanged) */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full px-4"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-red-200/80 rounded-2xl p-5 shadow-2xl shadow-red-500/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800">Generation Failed</h3>
                  <p className="mt-1 text-sm text-red-700 leading-relaxed">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section (unchanged) */}
      <section className="relative z-10 px-6 pt-12 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 backdrop-blur-sm border border-indigo-200/50 text-indigo-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>ElevenLabs API Powered</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Generate
            <span className="block md:inline bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent md:ml-3">
              Bulk AI Voices
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Convert hundreds of text scripts into natural-sounding AI voices in seconds.
            Generate multiple audio files simultaneously and download everything as a ZIP archive.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-medium text-slate-700">Parallel Processing</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span className="font-medium text-slate-700">Up to 100 Scripts</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="font-medium text-slate-700">Instant Generation</span>
          </div>
        </motion.div>
      </section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-7xl px-4 pb-12 lg:px-6"
      >
        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
          <motion.aside
            variants={fadeInLeft}
            className="space-y-6 xl:sticky xl:top-6 xl:col-span-5 xl:self-start"
          >
            <ApiKeyCard value={apiKey} onChange={setApiKey} />
            <LiveProgress
              total={stats.total}
              completed={stats.completed}
              running={status === 'generating'}
              logs={logs}
              onCancel={handleCancel}
            />
          </motion.aside>

          <motion.section
            variants={fadeInRight}
            className="space-y-6 xl:col-span-7"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/30 p-5 transition-all hover:shadow-xl hover:shadow-indigo-200/20">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🎤 Voice Profile
              </label>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full rounded-xl border-slate-200/80 bg-white/50 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="pNInz6obpgDQGcFmaJgB">🎙️ Adam (Default)</option>
                <option value="21m00Tcm4TlvDq8ikWAM">🎙️ Rachel</option>
                <option value="AZnzlk1XvdvUeBnXmlld">🎙️ Domi</option>
                <option value="EXAVITQu4vrIxn12LM3J">🎙️ Bella</option>
                <option value="yoZ06aMxZJJ28mfd3POQ">🎙️ Sam</option>
              </select>
            </div>

            <ScriptEditorCard
              value={scripts}
              onChange={setScripts}
              onGenerate={handleGenerate}
              isGenerating={status === 'generating' || isPending}
            />

            <AnimatePresence mode="wait">
              {files.length > 0 && (
                <GeneratedFilesTable
                  files={files}
                  currentlyPlaying={currentlyPlaying}
                  onPlay={handlePlay}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onDownloadZip={handleDownloadZip}
                />
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      </motion.section>
    </motion.main>
  );
};