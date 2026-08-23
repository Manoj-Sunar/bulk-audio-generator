// app/types/generator.ts
export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'failed';
export type FileStatus = 'success' | 'processing' | 'failed';
export type Provider = 'elevenlabs' | 'gemini';
export type LogStatus = 'success' | 'processing' | 'error';

export interface GeneratedAudioFile {
  id: string;
  fileName: string;
  status: FileStatus;
  audioUrl?: string;
  blob?: Blob;
  index: number;
  created_at?: string;
  provider: Provider;
  format: 'mp3' | 'wav';
}

export interface GenerationLog {
  id: number;
  time: string;
  message: string;
  status: LogStatus;
}

export interface GeneratorStats {
  total: number;
  completed: number;
}

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