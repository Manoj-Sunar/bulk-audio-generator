// app/components/pages/generator/ApiKeyCard.tsx
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
} from "lucide-react";
import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Input } from "../../Inputs/InputText";
import { Button } from "../../ui/Button";
import { fadeInUp, scaleUp } from "@/app/lib/animations";
import { Provider } from "@/app/types/generator";

interface ApiKeyCardProps {
  value: string;
  onChange: (value: string) => void;
  provider: Provider; // new
}

export const ApiKeyCard = ({ value, onChange, provider }: ApiKeyCardProps) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  const clearKey = useCallback(() => {
    onChange("");
  }, [onChange]);

  const providerLabel = provider === 'elevenlabs' ? 'ElevenLabs' : 'Gemini';
  const providerColor = provider === 'elevenlabs' ? 'indigo' : 'emerald';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <Card className="group overflow-hidden rounded-2xl border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-indigo-200/20 transition-all duration-500">
        <div className={`h-1 w-full bg-gradient-to-r from-${providerColor}-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <CardContent className="space-y-5 py-6 px-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br from-${providerColor}-500/10 to-purple-500/10 text-${providerColor}-600 group-hover:scale-110 transition-transform duration-300`}>
              <KeyRound size={20} />
            </div>
            <div>
              <Heading as="h3" size="md" weight="semibold" className="text-slate-800">
                {providerLabel} API Key
              </Heading>
              <Paragraph size="xs" className="text-slate-500">
                {provider === 'elevenlabs'
                  ? 'Enter your ElevenLabs API key from the dashboard'
                  : 'Enter your Google Gemini API key from AI Studio'}
              </Paragraph>
            </div>
          </div>

          <div className="relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={
                provider === 'elevenlabs'
                  ? 'Enter your ElevenLabs API key...'
                  : 'Enter your Gemini API key...'
              }
              type={showKey ? "text" : "password"}
              helperText={
                provider === 'elevenlabs'
                  ? 'Your key is encrypted and stored securely.'
                  : 'Your key is used only for this request and never stored unencrypted.'
              }
              className="w-full py-3 px-4 rounded-xl border-slate-200/80 bg-white/50 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 outline-none"
            />
          </div>

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

          <motion.div
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className={`flex items-start gap-3 rounded-xl bg-gradient-to-br from-${providerColor}-50/80 to-purple-50/80 border border-${providerColor}-100/50 px-4 py-3.5`}
          >
            <ShieldCheck size={20} className={`mt-0.5 shrink-0 text-${providerColor}-600`} />
            <div>
              <Paragraph size="sm" weight="semibold" className={`text-${providerColor}-900`}>
                🔒 Enterprise‑Grade Security
              </Paragraph>
              <Paragraph size="xs" className="mt-0.5 text-slate-600 leading-relaxed">
                {provider === 'elevenlabs'
                  ? 'Your ElevenLabs API key is encrypted (Fernet) and stored in our database. It is never exposed in the browser.'
                  : 'Your Gemini API key is sent directly to the backend and never stored in plaintext.'}
              </Paragraph>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};