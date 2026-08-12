"use client";

import { useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clipboard,
  Eraser,
  FileText,
  FolderOpen,
  Hash,
  Sparkles,
  Timer,
  Loader2,
  Send,
} from "lucide-react";

import { Card, CardContent } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Textarea } from "../../Inputs/TextArea";
import { fadeInUp, staggerContainer, scaleUp } from "@/app/lib/animations";

interface ScriptEditorCardProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export const ScriptEditorCard = ({
  value,
  onChange,
  onGenerate,
  isGenerating = false
}: ScriptEditorCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const scripts = value
      .split(/\n\s*\n/)
      .map(s => s.trim())
      .filter(Boolean);

    const words = value
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return {
      scripts: scripts.length,
      words: words.length,
      characters: value.length,
      estimatedMinutes: Math.max(1, Math.ceil(words.length / 150)),
    };
  }, [value]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target?.result as string);
    };
    reader.readAsText(file);
  }, [onChange]);

  const copyScripts = useCallback(async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  }, [value]);

  const clearScripts = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <Card className="group overflow-hidden rounded-2xl border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-indigo-200/20 transition-all duration-500">
        {/* Top gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="space-y-6 py-6 px-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Heading as="h2" size="lg" weight="semibold" className="text-slate-800">
                📝 Script Editor
              </Heading>
              <Paragraph className="mt-1 text-sm text-slate-500">
                Paste multiple scripts. Separate each with a blank line.
              </Paragraph>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
              <FileText size={24} />
            </div>
          </div>

          {/* Statistics - Enhanced */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { icon: FileText, label: "Scripts", value: stats.scripts, color: "indigo" },
              { icon: Hash, label: "Words", value: stats.words, color: "purple" },
              { icon: Clipboard, label: "Characters", value: stats.characters, color: "pink" },
              { icon: Timer, label: "Read Time", value: `${stats.estimatedMinutes}m`, color: "emerald" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={scaleUp}
                whileHover={{ y: -2, scale: 1.02 }}
                className={`flex items-center gap-3 rounded-xl bg-gradient-to-br from-${stat.color}-50/60 to-${stat.color}-100/30 border border-${stat.color}-100/50 px-3.5 py-3 transition-all duration-300`}
              >
                <div className={`p-2 rounded-lg bg-${stat.color}-100/60 text-${stat.color}-600`}>
                  <stat.icon size={16} />
                </div>
                <div>
                  <Paragraph size="xs" className="text-slate-500 leading-none">
                    {stat.label}
                  </Paragraph>
                  <Heading as="h6" size="sm" weight="bold" className="text-slate-700 mt-1">
                    {stat.value}
                  </Heading>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Editor */}
          <div className="relative">
            <Textarea
              label=""
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={10}
              placeholder={`Write or paste your scripts here...

Example:
Hello everyone. Welcome to Bulk Audio Generator.

This is another script. It will create a separate audio file.

Every blank line creates a separate audio file.`}
              helperText="Separate each script with a blank line (press Enter twice between scripts)"
              className="w-full rounded-xl border-slate-200/80 bg-white/50 p-4 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 outline-none resize-y min-h-[200px]"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2.5">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                leftIcon={<FolderOpen size={16} />}
                onClick={() => inputRef.current?.click()}
                size="sm"
                className="rounded-xl border-slate-200/80 text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200"
              >
                Import TXT
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                leftIcon={<Clipboard size={16} />}
                onClick={copyScripts}
                disabled={!value}
                size="sm"
                className="rounded-xl border-slate-200/80 text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200"
              >
                Copy All
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                leftIcon={<Eraser size={16} />}
                onClick={clearScripts}
                disabled={!value}
                size="sm"
                className="rounded-xl border-slate-200/80 text-slate-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
              >
                Clear
              </Button>
            </motion.div>
          </div>

          {/* Generate Button - Enhanced */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Button
              size="lg"
              className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 transition-all duration-300 text-base font-semibold py-4"
              leftIcon={isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              onClick={onGenerate}
              disabled={!value || isGenerating}
            >
              {isGenerating ? (
                <span>Generating Audio Files...</span>
              ) : (
                <span>🚀 Generate Audio</span>
              )}

              {isGenerating && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-200%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}
            </Button>
          </motion.div>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".txt"
            onChange={handleImport}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};