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
import { Label } from "../../typography/Label";
import { ImConnection } from "react-icons/im";
import { fadeInUp, scaleUp, pulseAnimation } from "@/app/lib/animations";

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

  useEffect(() => {
    if (value.trim()) {
      localStorage.setItem(STORAGE_KEY, value);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [value]);

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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-xl border-gray-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="space-y-2 py-5 px-9">
          {/* Header */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
            >
              <ImConnection className="text-primary" />
            </motion.div>
            <Heading size="sm" className="font-semibold">
              ElevenLabs API Connection
            </Heading>
          </motion.div>

          <Label className="uppercase text-gray-600">ElevenLabs API Key</Label>

          {/* Input */}
          <motion.div 
            className="relative"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste your ElevenLabs API Key..."
              type={showKey ? "text" : "password"}
              helperText="Your API key never leaves your browser."
              leftIcon={<KeyRound size={18} />}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 w-full py-2 outline-none border-none focus:outline-none"
            />
          </motion.div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setShowKey(prev => !prev)}
                leftIcon={showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                size="sm"
                className="transition-all duration-300"
              >
                {showKey ? "Hide" : "Show"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                      {copied ? <Check size={18} /> : <Clipboard size={18} />}
                    </motion.span>
                  </AnimatePresence>
                }
                size="sm"
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={clearKey}
                disabled={!value}
                leftIcon={<Trash2 size={18} />}
                size="sm"
                className="transition-all duration-300 hover:border-red-500 hover:text-red-500"
              >
                Clear
              </Button>
            </motion.div>
          </div>

          {/* Notice */}
          <motion.div 
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary-fixed/30 px-2 py-4"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <ShieldCheck size={22} className="mt-0.5 shrink-0 text-primary" />
            </motion.div>
            <div>
              <Paragraph className="font-semibold text-primary">
                Privacy First
              </Paragraph>
              <Paragraph size="sm" className="mt-1 text-on-surface-variant">
                Your API key is saved only in your browser using localStorage. 
                It is never uploaded anywhere except directly to ElevenLabs when you generate audio.
              </Paragraph>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};