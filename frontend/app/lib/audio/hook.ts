// src/lib/audio/hook.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, extractErrorMessage } from '../axios/client';
import { toast } from 'sonner';



export type GenerateAudioInput = {
  script: string;
  api_keys: string[];
  voice_id?: string;
  model_id?: string;
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
        // Re-throw with proper error message
        throw new Error(extractErrorMessage(error));
      }
    },
    onError: (error: any) => {
      const message = error.message || extractErrorMessage(error);
      toast.error(message);
    },
  });
}




export function useGenerationsList(skip: number = 0, limit: number = 50,includeAudio:boolean=true) {
  return useQuery({
    queryKey: ['audio-generations', skip, limit,includeAudio],
    queryFn: async () => {
      const response = await apiClient.get('/audio/generations', {
        params: { skip, limit, includeAudio, include_audio: includeAudio },
      });
      return response.data as GenerationListResponse;
    },
    staleTime: 30000, // 30 seconds
  });
}





export function useGenerationDetails(generationId: number | null) {
  return useQuery({
    queryKey: ['audio-generation', generationId],
    queryFn: async () => {
      const response = await apiClient.get(`/audio/generation/${generationId}`);
      return response.data;
    },
    enabled: !!generationId,
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
      
      // Trigger download
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