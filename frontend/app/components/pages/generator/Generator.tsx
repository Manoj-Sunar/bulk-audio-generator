"use client";

import { useState } from "react";

import { ApiKeyCard } from "./ApiKeyCard";
import { ScriptEditorCard } from "./ScriptEditor";
import { LiveProgress } from "./LiveProgress";
import {
  GeneratedAudioFile,
  GeneratedFilesTable,
} from "./GeneratedFilesTable";

import { Background } from "../../ui/Background";
import { logs } from "@/app/lib/constants";

export const Generator = () => {
  const [apiKey, setApiKey] = useState("");
  const [scripts, setScripts] = useState("");

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

  /* ---------------- Play ---------------- */

  const handlePlay = (file: GeneratedAudioFile) => {
    if (!file.audioUrl) return;

    const audio = new Audio(file.audioUrl);

    audio.play();
  };

  /* ---------------- Download Single ---------------- */

  const handleDownload = (file: GeneratedAudioFile) => {
    if (!file.audioUrl) return;

    const link = document.createElement("a");

    link.href = file.audioUrl;
    link.download = file.fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  /* ---------------- Delete ---------------- */

  const handleDelete = (file: GeneratedAudioFile) => {
    setFiles((prev) =>
      prev.filter((item) => item.id !== file.id)
    );
  };

  /* ---------------- Download ZIP ---------------- */

  const handleDownloadZip = async () => {
    try {
      /**
       * Replace this endpoint with your FastAPI endpoint.
       *
       * Example:
       * http://localhost:8000/api/download-zip
       */

      const response = await fetch(
        "http://localhost:8000/download-zip"
      );

      if (!response.ok) {
        throw new Error("Failed to download ZIP");
      }

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
      console.error(error);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Background />

      <section className="relative z-10 mx-auto max-w-8xl px-6 py-8 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* Left Sidebar */}

          <aside className="space-y-6 xl:sticky xl:top-6 xl:col-span-5 xl:self-start">
            <ApiKeyCard
              value={apiKey}
              onChange={setApiKey}
            />

            <LiveProgress
              total={48}
              completed={12}
              eta="01m 42s"
              running
              logs={logs}
              onCancel={() => console.log("Generation Cancelled")}
            />
          </aside>

          {/* Right */}

          <section className="space-y-8 xl:col-span-7">
            <ScriptEditorCard
              value={scripts}
              onChange={setScripts}
            />

            <GeneratedFilesTable
              files={files}
              onPlay={handlePlay}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onDownloadZip={handleDownloadZip}
            />
          </section>
        </div>
      </section>
    </main>
  );
};