"use client";

import { useEffect, useState } from "react";
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



interface ApiKeyCardProps {
  value: string;
  onChange: (value: string) => void;
}

const STORAGE_KEY = "elevenlabs_api_key";

export const ApiKeyCard = ({
  value,
  onChange,
}: ApiKeyCardProps) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ---------------- Load Saved Key ---------------- */

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      onChange(saved);
    }
  }, [onChange]);

  /* ---------------- Auto Save ---------------- */

  useEffect(() => {
    if (value.trim()) {
      localStorage.setItem(STORAGE_KEY, value);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [value]);

  /* ---------------- Copy ---------------- */

  const handleCopy = async () => {
    if (!value) return;

    await navigator.clipboard.writeText(value);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  /* ---------------- Clear ---------------- */

  const clearKey = () => {
    localStorage.removeItem(STORAGE_KEY);

    onChange("");
  };

  return (
    <Card className="rounded-xl border-gray-100  bg-white shadow-xs">

      <CardContent className="space-y-2 py-5 px-9">

        {/* Header */}
        <div className="flex items-center gap-3">
          <ImConnection />
          <Heading size="sm" className="font-semibold">
            ElevenLabs API Connection
          </Heading>
        </div>

        <Label className="uppercase text-gray-600">ElevenLabs API Key</Label>

        {/* Input */}

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your ElevenLabs API Key..."
          type={showKey ? "text" : "password"}
          helperText="Your API key never leaves your browser."
          leftIcon={<KeyRound size={18} />}
        />

        {/* Actions */}

        <div className="flex flex-wrap gap-3">

          <Button
            variant="outline"
            onClick={() => setShowKey((prev) => !prev)}
            leftIcon={
              showKey ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )
            }
            size="sm"
          >
            {showKey ? "Hide" : "Show"}
          </Button>

          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!value}
            leftIcon={
              copied ? (
                <Check size={18} />
              ) : (
                <Clipboard size={18} />
              )
            }
            size="sm"
          >
            {copied ? "Copied" : "Copy"}
          </Button>

          <Button
            variant="outline"
            onClick={clearKey}
            disabled={!value}
            leftIcon={<Trash2 size={18} />}
            size="sm"
          >
            Clear
          </Button>

        </div>

        {/* Notice */}

        <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary-fixed px-2 py-4">

          <ShieldCheck
            size={22}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div>

            <Paragraph
              className="font-semibold text-primary"
            >
              Privacy First
            </Paragraph>

            <Paragraph
              size="sm"
              className="mt-1 text-on-surface-variant"
            >
              Your API key is saved only in your browser using
              localStorage. It is never uploaded anywhere except
              directly to ElevenLabs when you generate audio.
            </Paragraph>

          </div>

        </div>

      </CardContent>

    </Card>
  );
};