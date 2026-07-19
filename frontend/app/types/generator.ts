export interface GeneratedAudio {
  id: string;
  script: string;
  blob: Blob;
  filename: string;
}

export interface FailedAudio {
  id: string;
  script: string;
  reason: string;
}

export interface VoiceGenerationState {
  generating: boolean;

  progress: number;

  completed: number;

  total: number;

  currentScript: number;

  failed: FailedAudio[];

  generated: GeneratedAudio[];
}