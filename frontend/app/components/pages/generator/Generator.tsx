// src/app/components/pages/generator/Generator.tsx
'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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

const initialLogs: GenerationLog[] = [
  { id: 0, time: new Date().toLocaleTimeString(), message: 'System ready. Waiting for scripts...', status: 'success' },
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
  const router = useRouter();

  const [apiKey, setApiKey] = useState('');
  const [scripts, setScripts] = useState('');
  const [voiceId, setVoiceId] = useState('pNInz6obpgDQGcFmaJgB');
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  const [logs, setLogs] = useState<GenerationLog[]>(initialLogs);
  const [files, setFiles] = useState<GeneratedAudioFile[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { mutate: generateAudio, isPending } = useGenerateAndPlayAudio();

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/bulk-audio/bulk-audio-login');
    }
  }, [user, authLoading, router]);

  // Stats
  const stats = useMemo(() => {
    const completed = files.filter(f => f.status === 'success').length;
    return { total: files.length, completed };
  }, [files]);

  // Handlers
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

    // Reset state
    setStatus('generating');
    setLogs([]);
    setFiles([]);
    setErrorMessage(null);

    // Generate
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
            
            // Add logs
            const newLogs = audioFiles.map((file, index) => ({
              id: Date.now() + index,
              time: new Date().toLocaleTimeString(),
              message: `Generated: ${file.fileName}`,
              status: 'success' as const,
            }));
            setLogs(prev => [...prev, ...newLogs]);
            
            toast.success(`Generated ${audioFiles.length} audio files`);
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

  const handleDelete = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.info('File removed');
  }, []);

  const handleDownloadZip = useCallback(() => {
    const successFiles = files.filter(f => f.status === 'success');
    if (successFiles.length === 0) {
      toast.error('No completed files to download');
      return;
    }
    toast.info(`Downloading ${successFiles.length} files...`);
    // Implement zip download logic
  }, [files]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
    >
      <Background />

      {/* Error Display */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {errorMessage}
                </div>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setErrorMessage(null)}
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-8xl md:px-6 py-8 lg:px-8 lg:py-10"
      >
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
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
            className="space-y-8 xl:col-span-7"
          >
            <div className="p-4 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1">Voice Profile</label>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full rounded-lg border-gray-200 p-2 outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="pNInz6obpgDQGcFmaJgB">Adam (Default)</option>
             
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