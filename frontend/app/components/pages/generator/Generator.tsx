"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApiKeyCard } from "./ApiKeyCard";
import { ScriptEditorCard } from "./ScriptEditor";
import { LiveProgress } from "./LiveProgress";
import { GeneratedFilesTable } from "./GeneratedFilesTable";
import { Background } from "../../ui/Background";
import { logs } from "@/app/lib/constants";
import { GeneratedAudioFile } from "./GeneratedFilesTable";
import { fadeInLeft, fadeInRight, staggerContainer } from "@/app/lib/animations";

export const Generator = () => {
  const [apiKey, setApiKey] = useState("");
  const [scripts, setScripts] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [files, setFiles] = useState<GeneratedAudioFile[]>([
    {
      id: "1",
      fileName: "intro.mp3",
      duration: "00:12",
      status: "success",
      audioUrl: "/audios/intro.mp3",
    },
    {
      id: "2",
      fileName: "section-1.mp3",
      duration: "00:19",
      status: "success",
      audioUrl: "/audios/section-1.mp3",
    },
    {
      id: "3",
      fileName: "section-2.mp3",
      status: "processing",
    },
    {
      id: "4",
      fileName: "ending.mp3",
      status: "failed",
    },
  ]);

  const stats = useMemo(() => ({
    total: files.length,
    completed: files.filter(f => f.status === "success").length,
    eta: "01m 42s",
  }), [files]);

  const handlePlay = useCallback((file: GeneratedAudioFile) => {
    if (!file.audioUrl) return;
    const audio = new Audio(file.audioUrl);
    audio.play().catch(console.error);
  }, []);

  const handleDownload = useCallback((file: GeneratedAudioFile) => {
    if (!file.audioUrl) return;
    const link = document.createElement("a");
    link.href = file.audioUrl;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  const handleDelete = useCallback((file: GeneratedAudioFile) => {
    setFiles(prev => prev.filter(item => item.id !== file.id));
  }, []);

  const handleDownloadZip = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/download-zip");
      if (!response.ok) throw new Error("Failed to download ZIP");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "generated-audios.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Zip download error:", error);
    }
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  }, []);

  const handleCancel = useCallback(() => {
    setIsGenerating(false);
    console.log("Generation Cancelled");
  }, []);


  console.log(apiKey)

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
    >
      <Background />

      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-8xl md:px-6 py-8 lg:px-8 lg:py-10"
      >
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* Left Sidebar */}
          <motion.aside 
            variants={fadeInLeft}
            className="space-y-6 xl:sticky xl:top-6 xl:col-span-5 xl:self-start"
          >
            <ApiKeyCard value={apiKey} onChange={setApiKey} />
            <LiveProgress
              total={stats.total}
              completed={stats.completed}
              eta={stats.eta}
              running={isGenerating}
              logs={logs}
              onCancel={handleCancel}
            />
          </motion.aside>

          {/* Right Sidebar */}
          <motion.section 
            variants={fadeInRight}
            className="space-y-8 xl:col-span-7"
          >
            <ScriptEditorCard
              value={scripts}
              onChange={setScripts}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />

            <AnimatePresence mode="wait">
              <GeneratedFilesTable
                files={files}
                onPlay={handlePlay}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onDownloadZip={handleDownloadZip}
              />
            </AnimatePresence>
          </motion.section>
        </div>
      </motion.section>
    </motion.main>
  );
};