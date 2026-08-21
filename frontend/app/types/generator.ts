export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'failed';
export type FileStatus = 'success' | 'processing' | 'failed';
export type Provider = 'elevenlabs' | 'gemini';

export interface GeneratedAudioFile {
  id: string;
  fileName: string;
  status: FileStatus;
  audioUrl?: string;
  blob?: Blob;
  index: number;
  created_at?: string;
  provider: Provider;          // new
  format: 'mp3' | 'wav';       // new
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