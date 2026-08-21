// app/types/generator.ts
export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'failed';
export type FileStatus = 'success' | 'processing' | 'failed';
export type Provider = 'elevenlabs' | 'gemini';
export type LogStatus = 'success' | 'processing' | 'error'; // ✅ Add this

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
  status: LogStatus; // ✅ Use LogStatus instead of FileStatus
}

export interface GeneratorStats {
  total: number;
  completed: number;
}