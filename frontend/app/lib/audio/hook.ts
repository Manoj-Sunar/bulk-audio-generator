// app/lib/audio/hook.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, extractErrorMessage } from '../axios/client';
import { toast } from 'sonner';
import { useAuth } from '../auth/context';

export type GenerateAudioInput = {
  script: string;
  api_keys: string[];
  voice_id?: string;
  model_id?: string;
  provider?: string;
};

export type SegmentResponse = {
  id: number;
  generation_id: number;
  index: number;
  title: string;
  audio_data: string;
  created_at: string | null;
};

export type GenerateAudioResponse = {
  generation_id: number;
  segments: SegmentResponse[];
  usage?: number;
};

export type GenerationListResponse = {
  data: {
    id: number;
    status: string;
    chunk_count: number;
    segment_count: number;
    created_at: string;
    voice_id: string;
    model_id: string;
    voice_insights?: any;
  }[];
  pagination: {
    total: number;
    skip: number;
    limit: number;
    has_more: boolean;
  };
};

export function useGenerateAudio() {
  return useMutation({
    mutationFn: async (data: GenerateAudioInput) => {
      const response = await apiClient.post('/audio/generate', data);
      return response.data;
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
}

export function useGenerateAndPlayAudio() {
  return useMutation({
    mutationFn: async (data: GenerateAudioInput) => {
      try {
        const response = await apiClient.post('/audio/generate-play', data);
        return response.data as GenerateAudioResponse;
      } catch (error: any) {
        throw new Error(extractErrorMessage(error));
      }
    },
    onError: (error: any) => {
      const message = error.message || extractErrorMessage(error);
      toast.error(message);
    },
  });
}

// ✅ FIX #10: Add auth check + enabled option
export function useGenerationsList(
  skip: number = 0,
  limit: number = 50,
  includeAudio: boolean = true,
  options?: { enabled?: boolean }
) {
  const { user, isLoading: authLoading } = useAuth();

  // ✅ Only run query when user is authenticated AND auth check is done
  const isEnabled = options?.enabled !== false && !!user && !authLoading;

  return useQuery({
    queryKey: ['audio-generations', skip, limit, includeAudio, user?.id],
    queryFn: async () => {
      const response = await apiClient.get('/audio/generations', {
        params: { skip, limit, include_audio: includeAudio },
      });
      return response.data as GenerationListResponse;
    },
    staleTime: 30000,
    enabled: isEnabled, // ✅ Don't fetch if not authenticated
  });
}

export function useGenerationDetails(generationId: number | null) {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: ['audio-generation', generationId, user?.id],
    queryFn: async () => {
      const response = await apiClient.get(`/audio/generation/${generationId}`);
      return response.data;
    },
    enabled: !!generationId && !!user && !authLoading, // ✅ Auth check
    staleTime: 60000,
  });
}

export function useDeleteGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (generationId: number) => {
      const response = await apiClient.delete(`/audio/generation/${generationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audio-generations'] });
      toast.success('Generation deleted successfully');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
}

export function useDownloadGeneration() {
  return useMutation({
    mutationFn: async (generationId: number) => {
      const response = await apiClient.get(`/audio/generation/${generationId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `generation_${generationId}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
}