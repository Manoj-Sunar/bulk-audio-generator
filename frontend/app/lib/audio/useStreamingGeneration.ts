// app/lib/audio/useStreamingGeneration.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { getCsrfToken } from '../axios/client';

export interface StreamingSegment {
  id: string;
  index: number;
  title: string;
  audio_data: string;
  created_at?: string;
  chars_used?: number;
}

export interface StreamingProgress {
  type: 'start' | 'progress' | 'complete' | 'error';
  generation_id?: number;
  total?: number;
  current?: number;
  segment?: StreamingSegment;
  message?: string;
  provider?: string;
  total_chars?: number;
}

export function useStreamingGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [segments, setSegments] = useState<StreamingSegment[]>([]);
  const [generationId, setGenerationId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [totalChars, setTotalChars] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (payload: {
      script: string;
      api_keys: string[];
      voice_id: string;
      model_id: string;
      provider: string;
    }) => {
      setIsGenerating(true);
      setProgress({ current: 0, total: 0 });
      setSegments([]);
      setError(null);
      setIsComplete(false);
      setGenerationId(null);
      setTotalChars(0);

      abortControllerRef.current = new AbortController();

      try {
        const csrfToken = getCsrfToken();

        // ✅ /api path — reverse proxy ले onrender.com मा forward गर्छ
        const response = await fetch(`/api/audio/generate-stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken || '',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Generation failed');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('Failed to read response stream');

        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: StreamingProgress = JSON.parse(line.slice(6));

                switch (data.type) {
                  case 'start':
                    setGenerationId(data.generation_id || null);
                    setProgress({ current: 0, total: data.total || 0 });
                    setProvider(data.provider || null);
                    toast.info(
                      `🎙️ Starting generation with ${data.provider || 'provider'}...`
                    );
                    break;

                  case 'progress':
                    setProgress({
                      current: data.current || 0,
                      total: data.total || 0,
                    });
                    if (data.segment) {
                      setSegments((prev) => [...prev, data.segment!]);
                      toast.success(`✅ Generated: ${data.segment.title}`);
                    }
                    break;

                  case 'complete':
                    setIsComplete(true);
                    setIsGenerating(false);
                    setTotalChars(data.total_chars || 0);
                    toast.success(`🎉 All ${data.total} files generated!`);
                    break;

                  case 'error':
                    setError(data.message || 'An error occurred');
                    toast.error(data.message || 'Generation failed');
                    setIsGenerating(false);
                    break;
                }
              } catch (parseError) {
                console.error('Failed to parse SSE data:', parseError);
              }
            }
          }
        }

        setIsGenerating(false);
        return { segments, generationId, totalChars };
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        const errorMessage =
          err instanceof Error ? err.message : 'Generation failed';
        setError(errorMessage);
        setIsGenerating(false);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    toast.info('Generation cancelled');
  }, []);

  const reset = useCallback(() => {
    setSegments([]);
    setProgress({ current: 0, total: 0 });
    setError(null);
    setIsComplete(false);
    setGenerationId(null);
    setProvider(null);
    setTotalChars(0);
    setIsGenerating(false);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    generate,
    cancel,
    reset,
    isGenerating,
    progress,
    segments,
    generationId,
    error,
    isComplete,
    provider,
    totalChars,
  };
}