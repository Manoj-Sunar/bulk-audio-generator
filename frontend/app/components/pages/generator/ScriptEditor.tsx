"use client";

import { useMemo, useRef } from "react";
import {
  Clipboard,
  Eraser,
  FileText,
  FolderOpen,
  Hash,
  Timer,
} from "lucide-react";

import { Card, CardContent } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Textarea } from "../../Inputs/TextArea";


interface ScriptEditorCardProps {
  value: string;
  onChange: (value: string) => void;
}

export const ScriptEditorCard = ({
  value,
  onChange,
}: ScriptEditorCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const scripts = value
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    const words = value
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return {
      scripts: scripts.length,
      words: words.length,
      characters: value.length,
      estimatedMinutes: Math.max(
        1,
        Math.ceil(words.length / 150)
      ),
    };
  }, [value]);

  const handleImport = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      onChange(event.target?.result as string);
    };

    reader.readAsText(file);
  };

  const copyScripts = async () => {
    if (!value) return;

    await navigator.clipboard.writeText(value);
  };

  return (
    <Card className="rounded-xl border-gray-100  bg-white shadow-xs">

      <CardContent className="space-y-8 p-8">

        {/* Header */}

        <div className="flex items-start justify-between">

          <div>

            <Heading
              as="h2"
              size="xl"
              weight="bold"
            >
              Bulk Script Editor
            </Heading>

            <Paragraph className="mt-2 text-on-surface-variant">
              Paste multiple scripts below. Separate every script
              with one blank line.
            </Paragraph>

          </div>

          <div className="rounded-2xl bg-primary-fixed p-3 text-primary">

            <FileText size={24} />

          </div>

        </div>

        {/* Statistics */}

        <div className="grid gap-4 md:grid-cols-4">

          <StatCard
            icon={<FileText size={18} />}
            title="Scripts"
            value={stats.scripts}
          />

          <StatCard
            icon={<Hash size={18} />}
            title="Words"
            value={stats.words}
          />

          <StatCard
            icon={<Clipboard size={18} />}
            title="Characters"
            value={stats.characters}
          />

          <StatCard
            icon={<Timer size={18} />}
            title="Read Time"
            value={`${stats.estimatedMinutes} min`}
          />

        </div>

        {/* Editor */}

        <Textarea
          label="Scripts"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={18}
          placeholder={`Hello everyone.

Welcome to Bulk Audio Generator.

This is another script.

Every blank line creates a separate audio file.`}
          helperText="Separate each script with a blank line."
        />

        {/* Actions */}

        <div className="flex flex-wrap gap-3">

          <Button
            variant="outline"
            leftIcon={<FolderOpen size={18} />}
            onClick={() => inputRef.current?.click()}
          >
            Import TXT
          </Button>

          <Button
            variant="outline"
            leftIcon={<Clipboard size={18} />}
            onClick={copyScripts}
            disabled={!value}
          >
            Copy
          </Button>

          <Button
            variant="outline"
            leftIcon={<Eraser size={18} />}
            onClick={() => onChange("")}
            disabled={!value}
          >
            Clear
          </Button>

        </div>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".txt"
          onChange={handleImport}
        />

      </CardContent>

    </Card>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const StatCard = ({
  icon,
  title,
  value,
}: StatCardProps) => (
  <div className="rounded-2xl border border-outline-variant bg-surface-container p-2">

    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">

      {icon}

    </div>

    <Paragraph
      size="sm"
      className="text-on-surface-variant"
    >
      {title}
    </Paragraph>

    <Heading
      as="h3"
      size="lg"
      weight="bold"
      className="mt-1"
    >
      {value}
    </Heading>

  </div>
);