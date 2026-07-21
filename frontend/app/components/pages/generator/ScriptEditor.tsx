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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-xl border-gray-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="space-y-8 p-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Heading as="h2" size="xl" weight="bold">
                Bulk Script Editor
              </Heading>
              <Paragraph className="mt-2 text-on-surface-variant">
                Paste multiple scripts below. Separate every script with one blank line.
              </Paragraph>
            </div>
            <motion.div
              className="rounded-2xl bg-primary-fixed p-3 text-primary"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <FileText size={24} />
            </motion.div>
          </div>

          {/* Statistics */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-4"
          >
            <StatCard icon={<FileText size={18} />} title="Scripts" value={stats.scripts} />
            <StatCard icon={<Hash size={18} />} title="Words" value={stats.words} />
            <StatCard icon={<Clipboard size={18} />} title="Characters" value={stats.characters} />
            <StatCard icon={<Timer size={18} />} title="Read Time" value={`${stats.estimatedMinutes} min`} />
          </motion.div>

          {/* Editor */}
          <motion.div whileFocus={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
            <Textarea
              label="Scripts"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={12}
              placeholder={`Hello everyone.

 Welcome to Bulk Audio Generator.

This is another script.

Every blank line creates a separate audio file.`}
             helperText="Separate each script with a blank line. Use double line breaks to separate scripts:  ↵ ↵"
              className="transition-all duration-300 focus:ring-2 rounded-lg focus:ring-primary/20 w-full border border-gray-300 outline-none resize-none p-2"
            />
          </motion.div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                leftIcon={<FolderOpen size={18} />}
                onClick={() => inputRef.current?.click()}
                size="sm"
              >
                Import TXT
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                leftIcon={<Clipboard size={18} />}
                onClick={copyScripts}
                disabled={!value}
                size="sm"
              >
                Copy
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                leftIcon={<Eraser size={18} />}
                onClick={clearScripts}
                disabled={!value}
                size="sm"
                className="hover:border-red-500 hover:text-red-500"
              >
                Clear
              </Button>
            </motion.div>
          </div>

          {/* Generate Button */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="lg"
              className="min-w-[220px] relative overflow-hidden w-full"
              leftIcon={isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              onClick={onGenerate}
              disabled={!value || isGenerating}
            >
              {isGenerating ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Generating...
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Generate Audio
                </motion.span>
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

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const StatCard = ({ icon, title, value }: StatCardProps) => (
  <motion.div
    variants={scaleUp}
    whileHover={{ scale: 1.05, y: -4 }}
    transition={{ duration: 0.3 }}
    className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container/50 px-4 py-3 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
  >
    <motion.div
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-fixed text-primary"
      whileHover={{ rotate: 15 }}
      transition={{ duration: 0.3 }}
    >
      {icon}
    </motion.div>
    <div className="min-w-0">
      <Paragraph size="xs" className="leading-none text-on-surface-variant">
        {title}
      </Paragraph>
      <Heading as="h6" size="sm" weight="bold" className="mt-1">
        {value}
      </Heading>
    </div>
  </motion.div>
);