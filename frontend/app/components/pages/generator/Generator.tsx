// app/components/pages/generator/Generator.tsx
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { useAuth } from '@/app/lib/auth/context';
import { useAudioPlayer } from '@/app/lib/audio/useAudioPlayer';
import { useStreamingGeneration } from '@/app/lib/audio/useStreamingGeneration';
import { GeneratedAudioFile, GenerationLog, Provider } from '@/app/types/generator';
import { ApiKeyCard } from './ApiKeyCard';
import { ScriptEditorCard } from './ScriptEditor';
import { LiveProgress } from './LiveProgress';
import { GeneratedFilesTable } from './GeneratedFilesTable';
import { Background } from '../../ui/Background';
import { fadeInLeft, fadeInRight, staggerContainer } from '@/app/lib/animations';
import { AuthGuard } from '@/app/components/AuthGuard';
import { Sparkles, Zap, Clock, Layers, Download, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';

// Helper: convert base64 data to Blob
function dataURLtoBlob(dataURL: string, mimeType: string = 'audio/mpeg'): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || mimeType;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

export const Generator = () => {
  const { user } = useAuth();
  const { currentlyPlaying, play, stop } = useAudioPlayer();
  const { 
    generate, 
    cancel, 
    reset,
    isGenerating, 
    progress, 
    segments, 
    generationId,
    error,
    isComplete,
    provider,
    totalChars 
  } = useStreamingGeneration();

  // State
  const [apiKey, setApiKey] = useState('');
  const [scripts, setScripts] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider>('elevenlabs');
  const [voiceId, setVoiceId] = useState('pNInz6obpgDQGcFmaJgB');
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  const [files, setFiles] = useState<GeneratedAudioFile[]>([]);

  // --- Voice options based on provider ---
  const voiceOptions = useMemo(() => {
    if (selectedProvider === 'elevenlabs') {
      return [
        { value: 'pNInz6obpgDQGcFmaJgB', label: '🎙️ Adam (Default)' },
        { value: '21m00Tcm4TlvDq8ikWAM', label: '🎙️ Rachel' },
        { value: 'AZnzlk1XvdvUeBnXmlld', label: '🎙️ Domi' },
        { value: 'EXAVITQu4vrIxn12LM3J', label: '🎙️ Bella' },
        { value: 'yoZ06aMxZJJ28mfd3POQ', label: '🎙️ Sam' },
      ];
    } else {
      return [
        { value: 'Kore', label: '🗣️ Kore' },
        { value: 'Charon', label: '🗣️ Charon' },
        { value: 'Fenrir', label: '🗣️ Fenrir' },
        { value: 'Aoede', label: '🗣️ Aoede' },
        { value: 'Puck', label: '🗣️ Puck' },
        { value: 'Leda', label: '🗣️ Leda' },
      ];
    }
  }, [selectedProvider]);

  // Reset voice when provider changes
  useEffect(() => {
    if (voiceOptions.length > 0) {
      setVoiceId(voiceOptions[0].value);
    }
  }, [voiceOptions]);

  // Update files when segments arrive via streaming
  useEffect(() => {
    if (segments.length > 0) {
      const audioFormat = selectedProvider === 'elevenlabs' ? 'mp3' : 'wav';
      const mimeType = selectedProvider === 'elevenlabs' ? 'audio/mpeg' : 'audio/wav';
      
      const newFiles: GeneratedAudioFile[] = segments.map((seg) => ({
        id: seg.id || `temp-${seg.index}`,
        fileName: `${seg.title.replace(/[^a-zA-Z0-9]/g, '_')}.${audioFormat}`,
        status: 'success' as const,
        audioUrl: `data:${mimeType};base64,${seg.audio_data}`,
        blob: dataURLtoBlob(`data:${mimeType};base64,${seg.audio_data}`, mimeType),
        index: seg.index,
        created_at: seg.created_at || undefined,
        provider: selectedProvider,
        format: audioFormat as 'mp3' | 'wav', // ✅ Fix: Type assertion
      }));
      
      setFiles(newFiles);
      setStatus('generating');
    }
  }, [segments, selectedProvider]);

  // Update status when generation completes
  useEffect(() => {
    if (isComplete) {
      setStatus('completed');
    }
  }, [isComplete]);

  // Update status on error
  useEffect(() => {
    if (error) {
      setStatus('failed');
    }
  }, [error]);

  // --- Generate handler ---
  const handleGenerate = useCallback(async () => {
    if (!scripts.trim()) { toast.error('Please enter some scripts'); return; }
    const chunks = scripts.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    if (!chunks.length) { toast.error('No valid scripts found'); return; }
    if (chunks.length > 100) { toast.error('Too many scripts (max 100)'); return; }
    if (!apiKey.trim()) { 
      toast.error(`Please enter your ${selectedProvider === 'elevenlabs' ? 'ElevenLabs' : 'Gemini'} API key`); 
      return; 
    }

    setStatus('generating');
    setFiles([]);
    stop();

    const payload = {
      script: scripts,
      api_keys: [apiKey],
      voice_id: voiceId,
      model_id: selectedProvider === 'elevenlabs' ? 'eleven_multilingual_v2' : '',
      provider: selectedProvider,
    };

    try {
      await generate(payload);
    } catch (err) {
      setStatus('failed');
    }
  }, [scripts, apiKey, voiceId, selectedProvider, generate, stop]);

  // --- Cancel handler ---
  const handleCancel = useCallback(() => {
    cancel();
    setStatus('failed');
  }, [cancel]);

  // --- Play handler ---
  const handlePlay = useCallback((file: GeneratedAudioFile) => {
    if (file.audioUrl) {
      play(file.audioUrl, file.id);
    }
  }, [play]);

  // --- Download single file ---
  const handleDownload = useCallback((file: GeneratedAudioFile) => {
    if (!file.audioUrl) return;
    const link = document.createElement('a');
    link.href = file.audioUrl;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  // --- Delete file ---
  const handleDelete = useCallback((file: GeneratedAudioFile) => {
    setFiles(prev => prev.filter(f => f.id !== file.id));
    toast.info(`🗑️ Removed: ${file.fileName}`);
  }, []);

  // --- Download all as ZIP ---
  const handleDownloadZip = useCallback(async () => {
    const successFiles = files.filter(f => f.status === 'success');
    if (!successFiles.length) { toast.error('No completed files to download'); return; }
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
    }
  }, [files]);

  // Convert progress to logs format for LiveProgress
 const logs = useMemo(() => {
  const logEntries: GenerationLog[] = files.map((file, index) => ({
    id: index,
    time: new Date().toLocaleTimeString(),
    message: `✅ Generated: ${file.fileName}`,
    status: 'success' as const,
  }));
  
  if (isGenerating && progress.current > 0) {
    logEntries.push({
      id: -1,
      time: new Date().toLocaleTimeString(),
      message: `⏳ Generating file ${progress.current}/${progress.total}...`,
      status: 'processing' as const, // ✅ This is now valid with GenerationLog type
    });
  }
  
  return logEntries.length > 0 ? logEntries : [
    { id: 0, time: new Date().toLocaleTimeString(), message: '🚀 System ready. Waiting for scripts...', status: 'success' as const }
  ];
}, [files, isGenerating, progress]);

  const stats = useMemo(() => ({
    total: files.length,
    completed: files.filter(f => f.status === 'success').length,
  }), [files]);

  return (
    <AuthGuard>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30"
      >
        <Background />

        {/* Error display */}
        <AnimatePresence>
          {error && (
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
                    <p className="mt-1 text-sm text-red-700 leading-relaxed">{error}</p>
                  </div>
                  <button onClick={reset} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section className="relative z-10 px-6 pt-12 pb-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 backdrop-blur-sm border border-indigo-200/50 text-indigo-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI Voice Generation – ElevenLabs & Gemini</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Generate
              <span className="block md:inline bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent md:ml-3">
                Bulk AI Voices
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
              Convert hundreds of text scripts into natural-sounding AI voices in real-time.
              Each file streams to you as soon as it's ready.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-slate-700">Real-time Streaming</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span className="font-medium text-slate-700">Up to 100 Scripts</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="font-medium text-slate-700">Instant Download</span>
            </div>
          </motion.div>
        </section>

        <motion.section variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 mx-auto max-w-7xl px-4 pb-12 lg:px-6">
          <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
            <motion.aside variants={fadeInLeft} className="space-y-6 xl:sticky xl:top-6 xl:col-span-5 xl:self-start">
              <ApiKeyCard value={apiKey} onChange={setApiKey} provider={selectedProvider} />
              <LiveProgress
                total={Math.max(progress.total || files.length, 1)}
                completed={files.length}
                running={isGenerating}
                logs={logs}
                onCancel={handleCancel}
                currentFile={files.length > 0 && isGenerating ? files[files.length - 1]?.fileName : undefined}
              />
            </motion.aside>

            <motion.section variants={fadeInRight} className="space-y-6 xl:col-span-7">
              {/* Provider & Voice Selection */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/30 p-5 transition-all hover:shadow-xl hover:shadow-indigo-200/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">🔊 Provider</label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value as Provider)}
                    disabled={isGenerating}
                    className="w-full rounded-xl border-slate-200/80 bg-white/50 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50"
                  >
                    <option value="elevenlabs">ElevenLabs</option>
                    <option value="gemini">Google Gemini</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">🎤 Voice</label>
                  <select
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value)}
                    disabled={isGenerating}
                    className="w-full rounded-xl border-slate-200/80 bg-white/50 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50"
                  >
                    {voiceOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ScriptEditorCard
                value={scripts}
                onChange={setScripts}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />

              {/* Completion Summary */}
              {isComplete && files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-emerald-200/60 bg-emerald-50/50 backdrop-blur-sm shadow-lg shadow-emerald-200/20">
                    <CardContent className="py-4 px-6">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                          <span className="font-semibold text-emerald-800">
                            Complete! {files.length} files generated
                          </span>
                        </div>
                        {generationId && (
                          <span className="text-sm text-emerald-700 bg-emerald-100/50 px-3 py-1 rounded-full">
                            ID: {generationId}
                          </span>
                        )}
                        {totalChars > 0 && (
                          <span className="text-sm text-emerald-700 bg-emerald-100/50 px-3 py-1 rounded-full">
                            {totalChars.toLocaleString()} chars used
                          </span>
                        )}
                        {provider && (
                          <span className="text-sm text-emerald-700 bg-emerald-100/50 px-3 py-1 rounded-full capitalize">
                            {provider}
                          </span>
                        )}
                        <Button
                          size="sm"
                          leftIcon={<Download size={16} />}
                          onClick={handleDownloadZip}
                          className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Download All ZIP
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

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
    </AuthGuard>
  );
};