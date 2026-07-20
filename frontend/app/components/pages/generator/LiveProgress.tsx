"use client";

import {
  CheckCircle2,
  Loader2,
  XCircle,
  Square,
} from "lucide-react";

import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";

interface ProgressLog {
  id: number;
  time: string;
  message: string;
  status: "success" | "processing" | "error";
}

interface LiveProgressProps {
  total: number;
  completed: number;
  eta: string;
  running: boolean;
  logs: ProgressLog[];
  onCancel?: () => void;
}

export const LiveProgress = ({
  total,
  completed,
  eta,
  running,
  logs,
  onCancel,
}: LiveProgressProps) => {
  const progress = total === 0 ? 0 : (completed / total) * 100;

  return (
    <Card className="overflow-hidden rounded-xl  border-gray-100 bg-white shadow-xs">

      <CardContent className="space-y-6 p-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <Heading
            as="h3"
            size="lg"
            weight="bold"
          >
            ⚡ Live Progress
          </Heading>

          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              running
                ? "bg-primary-fixed text-primary"
                : "bg-green-100 text-green-700"
            }`}
          >
            {running && (
              <Loader2
                size={14}
                className="animate-spin"
              />
            )}

            {!running && (
              <CheckCircle2
                size={14}
              />
            )}

            {running ? "Running" : "Completed"}
          </div>

        </div>

        {/* Progress */}

        <div className="space-y-3">

          <div className="flex items-center justify-between">

            <Paragraph
              size="sm"
              className="text-on-surface-variant"
            >
              Files Generated
            </Paragraph>

            <Paragraph
              size="sm"
              className="font-semibold text-primary"
            >
              {completed} / {total}
            </Paragraph>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-surface-container">

            <div
              className="relative h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${progress}%` }}
            >

              <div className="absolute inset-0 animate-pulse bg-white/20" />

            </div>

          </div>

          <Paragraph
            size="sm"
            className="text-on-surface-variant"
          >
            ETA • {eta}
          </Paragraph>

        </div>

        {/* Logs */}

        <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-outline-variant bg-surface-container p-4">

          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 text-sm"
            >
              {log.status === "success" && (
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-green-600"
                />
              )}

              {log.status === "processing" && (
                <Loader2
                  size={16}
                  className="mt-0.5 shrink-0 animate-spin text-primary"
                />
              )}

              {log.status === "error" && (
                <XCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-error"
                />
              )}

              <div className="flex flex-1 items-center justify-between gap-4">

                <Paragraph
                  size="sm"
                  className={
                    log.status === "processing"
                      ? "animate-pulse"
                      : ""
                  }
                >
                  {log.message}
                </Paragraph>

                <span className="text-xs text-on-surface-variant whitespace-nowrap">
                  {log.time}
                </span>

              </div>

            </div>
          ))}

        </div>

        {/* Footer */}

        {running && (
          <Button
            variant="destructive"
            fullWidth
            leftIcon={<Square size={16} />}
            onClick={onCancel}
          >
            Cancel Generation
          </Button>
        )}

      </CardContent>

    </Card>
  );
};