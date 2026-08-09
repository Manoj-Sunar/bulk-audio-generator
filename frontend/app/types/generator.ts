// src/app/types/generator.ts
export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'failed';

export type FileStatus = 'success' | 'processing' | 'failed';

export interface GeneratedAudioFile {
  id: string;
  fileName: string;
  status: FileStatus;
  audioUrl?: string;
  blob?: Blob;
  index: number;
  created_at?: string;
}

export interface GenerationLog {
  id: number;
  time: string;
  message: string;
  status: 'success' | 'processing' | 'error';
}

export interface GeneratorStats {
  total: number;
  completed: number;
}