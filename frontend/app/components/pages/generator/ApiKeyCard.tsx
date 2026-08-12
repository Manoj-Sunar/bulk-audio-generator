"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Clipboard,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Input } from "../../Inputs/InputText";
import { Button } from "../../ui/Button";
import { Label } from "../../typography/Label";
import { fadeInUp, scaleUp } from "@/app/lib/animations";

interface ApiKeyCardProps {
  value: string;
  onChange: (value: string) => void;
}

const STORAGE_KEY = "elevenlabs_api_key";

export const ApiKeyCard = ({ value, onChange }: ApiKeyCardProps) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      onChange(saved);
    }
    setIsLoaded(true);
  }, [onChange]);



  const handleCopy = useCallback(async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  const clearKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    onChange("");
  }, [onChange]);

  if (!isLoaded) return null;

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
        
        <CardContent className="space-y-5 py-6 px-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
              <KeyRound size={20} />
            </div>
            <div>
              <Heading as="h3" size="md" weight="semibold" className="text-slate-800">
                ElevenLabs API Key
              </Heading>
              <Paragraph size="xs" className="text-slate-500">
                Securely stored in your browser
              </Paragraph>
            </div>
          </div>

          {/* Input */}
          <div className="relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter your ElevenLabs API key..."
              type={showKey ? "text" : "password"}
              helperText="Your API key never leaves your browser."
              className="w-full py-3 px-4 rounded-xl border-slate-200/80 bg-white/50 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2.5">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={() => setShowKey(prev => !prev)}
                leftIcon={showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                size="sm"
                className="rounded-xl border-slate-200/80 text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200"
              >
                {showKey ? "Hide" : "Show"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={!value}
                leftIcon={
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={copied ? "check" : "clipboard"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {copied ? <Check size={16} className="text-emerald-500" /> : <Clipboard size={16} />}
                    </motion.span>
                  </AnimatePresence>
                }
                size="sm"
                className="rounded-xl border-slate-200/80 text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200"
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={clearKey}
                disabled={!value}
                leftIcon={<Trash2 size={16} />}
                size="sm"
                className="rounded-xl border-slate-200/80 text-slate-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
              >
                Clear
              </Button>
            </motion.div>
          </div>

          {/* Privacy Notice */}
          <motion.div
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100/50 px-4 py-3.5"
          >
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-indigo-600" />
            <div>
              <Paragraph size="sm" weight="semibold" className="text-indigo-900">
                🔒 Privacy First
              </Paragraph>
              <Paragraph size="xs" className="mt-0.5 text-slate-600 leading-relaxed">
                Your API key is saved only in your browser's localStorage. 
                It is never stored on our servers.
              </Paragraph>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};