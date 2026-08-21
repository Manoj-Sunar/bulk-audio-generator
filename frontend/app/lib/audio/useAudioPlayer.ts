// app/lib/audio/useAudioPlayer.ts
import { useRef, useState, useCallback, useEffect } from 'react';

export function useAudioPlayer() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((audioUrl: string, id: string) => {
    if (currentlyPlaying === id) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play().catch(console.error);
    setCurrentlyPlaying(id);

    audio.onended = () => {
      setCurrentlyPlaying(null);
      audioRef.current = null;
    };
  }, [currentlyPlaying]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setCurrentlyPlaying(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  return { currentlyPlaying, play, stop };
}