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

export const audioKeys = {
  all: ['audio-generations'] as const,
  lists: () => [...audioKeys.all, 'list'] as const,
  list: (skip: number, limit: number, includeAudio: boolean, userId?: number) =>
    [...audioKeys.lists(), { skip, limit, includeAudio, userId }] as const,
  details: () => [...audioKeys.all, 'detail'] as const,
  detail: (id: number, userId?: number) =>
    [...audioKeys.details(), id, userId] as const,
};

export function useGenerateAudio() {
  return useMutation({
    mutationFn: async (data: GenerateAudioInput) => {
      const response = await apiClient.post('/audio/generate', data);
      return response.data;
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
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
      toast.error(error.message || extractErrorMessage(error));
    },
  });
}

// ✅ FIX #10: Add auth check + enabled option
export function useGenerationsList(
  skip: number = 0,
  limit: number = 50,
  includeAudio: boolean = false,   // ✅ DEFAULT FALSE — audio data lazy load
  options?: { enabled?: boolean }
) {
  const { user, isLoading: authLoading } = useAuth();
  const isEnabled = options?.enabled !== false && !!user && !authLoading;

  return useQuery({
    // ✅ Query key factory प्रयोग — consistent
    queryKey: audioKeys.list(skip, limit, includeAudio, user?.id),
    
    queryFn: async () => {
      const response = await apiClient.get('/audio/generations', {
        params: { skip, limit, include_audio: includeAudio },
      });
      return response.data as GenerationListResponse;
    },
    
    // ✅ Global config ले पुग्छ, तर explicit राख्नु राम्रो
    staleTime: 5 * 60 * 1000,      // ५ मिनेट
    gcTime: 30 * 60 * 1000,         // ३० मिनेट
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    
    // ✅ Stale data तुरुन्तै देखाउने — कुनै loading spinner छैन
    placeholderData: (previousData) => previousData,
    
    enabled: isEnabled,
  });
}

export function useGenerationDetails(generationId: number | null) {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: audioKeys.detail(generationId!, user?.id),
    queryFn: async () => {
      const response = await apiClient.get(`/audio/generation/${generationId}`);
      return response.data;
    },
    enabled: !!generationId && !!user && !authLoading,
    staleTime: 10 * 60 * 1000,     // १० मिनेट
    refetchOnMount: false,
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
      // ✅ सबै list invalidate + तुरुन्तै refetch
      queryClient.invalidateQueries({ 
        queryKey: audioKeys.lists(),
        refetchType: 'all',   // ✅ Inactive queries पनि refetch
      });
      toast.success('Generation deleted successfully');
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
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
      toast.error(extractErrorMessage(error));
    },
  });
}