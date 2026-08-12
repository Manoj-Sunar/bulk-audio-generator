// app/profile/components/GenerationCard.tsx - UPDATED
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Download,
  Trash2,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Music,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Volume2,
  Mic2,
  ListMusic,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Heading } from '@/app/components/typography/Heading';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { Span } from '@/app/components/typography/Span';
import { Button } from '@/app/components/ui/Button';
import { listItemVariants } from '@/app/lib/animations';

interface Segment {
  id: number;
  index: number;
  title: string;
  created_at: string;
  audio_data?: string;
}

interface Generation {
  id: number;
  status: string;
  chunk_count: number;
  segment_count: number;
  created_at: string;
  voice_id: string;
  model_id: string;
  voice_insights?: {
    name: string;
    gender: string;
    description: string;
    accent: string;
    age: string;
    use_case: string;
  };
  segments: Segment[];
}

interface GenerationCardProps {
  generation: Generation;
  onPlay: (audioUrl: string, id: string) => void;
  onDownload: (id: number) => void;
  onDelete: (id: number) => void;
  isPlaying: boolean;
  isDeleting: boolean;
  isDownloading: boolean;
  viewMode?: 'grid' | 'list';
}

export const GenerationCard = ({
  generation,
  onPlay,
  onDownload,
  onDelete,
  isPlaying,
  isDeleting,
  isDownloading,
  viewMode = 'grid',
}: GenerationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentlyPlayingSegment, setCurrentlyPlayingSegment] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Completed',
          color: 'emerald',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200/80',
          glow: 'shadow-emerald-500/20'
        };
      case 'processing':
        return {
          icon: Loader2,
          label: 'Processing',
          color: 'amber',
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200/80',
          spin: true,
          glow: 'shadow-amber-500/20'
        };
      case 'failed':
        return {
          icon: XCircle,
          label: 'Failed',
          color: 'red',
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200/80',
          glow: 'shadow-red-500/20'
        };
      default:
        return {
          icon: Clock,
          label: 'Pending',
          color: 'slate',
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200/80',
          glow: 'shadow-slate-500/20'
        };
    }
  };

  const statusConfig = getStatusConfig(generation.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSegmentPlay = (segment: Segment) => {
    if (!segment.audio_data) {
      toast.info('No audio data available for this segment');
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    if (currentlyPlayingSegment === segment.id) {
      setCurrentlyPlayingSegment(null);
      return;
    }

    const audioUrl = `data:audio/mp3;base64,${segment.audio_data}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio');
    });

    setCurrentlyPlayingSegment(segment.id);

    audio.onended = () => {
      setCurrentlyPlayingSegment(null);
      audioRef.current = null;
    };
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const hasAudioData = generation.segments.some(seg => seg.audio_data);
  const completedSegments = generation.segments.filter(s => s.audio_data).length;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-500 border-slate-200/60 bg-white/80 backdrop-blur-xl group">
        {/* Gradient accent bar */}
        <div className={`h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ${isHovered ? 'h-1.5' : 'h-1'}`} />

        <CardContent className="p-5">
          {/* Header - Always Visible */}
          <div className="flex items-start justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 transition-all duration-300 flex-shrink-0 ${isHovered ? 'scale-110 rotate-6' : ''}`}>
                <Music className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Heading as="h4" size="sm" weight="semibold" className="text-slate-800 truncate">
                    Generation #{generation.id}
                  </Heading>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} flex-shrink-0`}>
                    <StatusIcon className={`w-3 h-3 ${statusConfig.spin ? 'animate-spin' : ''}`} />
                    {statusConfig.label}
                  </span>
                  {hasAudioData && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex-shrink-0">
                      <Volume2 className="w-3 h-3" />
                      {completedSegments}/{generation.segment_count} ready
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <Span size="xs" className="text-slate-500 flex items-center gap-1 truncate">
                    <Mic2 className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{generation.voice_insights?.name || generation.voice_id.slice(0, 8)}...</span>
                  </Span>
                  <Span size="xs" className="text-slate-500 flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    {formatDate(generation.created_at)}
                  </Span>
                  <Span size="xs" className="text-slate-500 flex-shrink-0">
                    📁 {generation.segment_count} files
                  </Span>
                  {/* ✅ Show file count indicator */}
                  <Span size="xs" className="text-slate-400 flex-shrink-0">
                    {isExpanded ? '▼ Expanded' : '▶ Click to expand'}
                  </Span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {generation.status === 'completed' && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDownload(generation.id)}
                  disabled={isDownloading}
                  className="border-slate-200/60 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 flex-shrink-0"
                  title="Download ZIP"
                  leftIcon={isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                />
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(generation.id)}
                disabled={isDeleting}
                className="border-slate-200/60 text-slate-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex-shrink-0"
                title="Delete Generation"
                leftIcon={isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              />
              <button
                onClick={toggleExpand}
                className="w-11 h-11 rounded-xl border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 flex-shrink-0"
                title={isExpanded ? "Collapse" : "Expand"}
                type="button"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Stats Summary - Always Visible */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 rounded-xl bg-slate-50/80 border border-slate-200/40">
              <Span size="lg" weight="bold" className="text-indigo-600">
                {generation.segment_count}
              </Span>
              <Paragraph size="xs" className="text-slate-500">Total Files</Paragraph>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-50/80 border border-slate-200/40">
              <Span size="lg" weight="bold" className="text-emerald-600">
                {completedSegments}
              </Span>
              <Paragraph size="xs" className="text-slate-500">With Audio</Paragraph>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-50/80 border border-slate-200/40">
              <Span size="lg" weight="bold" className="text-amber-600">
                {generation.chunk_count}
              </Span>
              <Paragraph size="xs" className="text-slate-500">Chunks</Paragraph>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-50/80 border border-slate-200/40">
              <Span size="lg" weight="bold" className="text-purple-600 truncate block">
                {generation.voice_insights?.name || 'N/A'}
              </Span>
              <Paragraph size="xs" className="text-slate-500">Voice</Paragraph>
            </div>
          </div>

          {/* ✅ HIDDEN BY DEFAULT - Only shown when expanded */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Voice Insights */}
                {generation.voice_insights && (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-indigo-200/30 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Mic2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <Span size="xs" weight="semibold" className="text-indigo-700">
                        {generation.voice_insights.name}
                      </Span>
                      <Span size="xs" className="text-slate-400">•</Span>
                      <Span size="xs" className="text-slate-500">{generation.voice_insights.gender}</Span>
                      <Span size="xs" className="text-slate-400">•</Span>
                      <Span size="xs" className="text-slate-500">{generation.voice_insights.accent}</Span>
                      <Span size="xs" className="text-slate-400">•</Span>
                      <Span size="xs" className="text-slate-500">{generation.voice_insights.age}</Span>
                    </div>
                    <Paragraph size="xs" className="text-slate-500 mt-1">
                      {generation.voice_insights.description}
                    </Paragraph>
                  </div>
                )}

                {/* Audio Files List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Paragraph size="xs" weight="semibold" className="text-slate-600 flex items-center gap-2">
                      <ListMusic className="w-3.5 h-3.5" />
                      Audio Files ({generation.segment_count})
                    </Paragraph>
                  </div>

                  {/* All Segments - Show all when expanded */}
                  {generation.segments.map((segment) => (
                    <div 
                      key={segment.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/40 hover:bg-slate-100/80 transition-all group/item"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Span size="xs" className="font-mono text-slate-400 w-8 flex-shrink-0">
                          #{segment.index}
                        </Span>
                        <div className="flex-1 min-w-0">
                          <Paragraph size="sm" weight="medium" className="text-slate-700 truncate">
                            {segment.title}
                          </Paragraph>
                          <Span size="xs" className="text-slate-400">
                            {formatDate(segment.created_at)}
                          </Span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {segment.audio_data ? (
                          <>
                            <Button
                              variant={currentlyPlayingSegment === segment.id ? "primary" : "outline"}
                              size="sm"
                              leftIcon={currentlyPlayingSegment === segment.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                              onClick={() => handleSegmentPlay(segment)}
                              className={currentlyPlayingSegment === segment.id 
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 flex-shrink-0" 
                                : "border-indigo-200/80 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 flex-shrink-0"
                              }
                            >
                              {currentlyPlayingSegment === segment.id ? 'Playing' : 'Play'}
                            </Button>
                            <Span size="xs" className="text-emerald-500 flex items-center gap-1 flex-shrink-0">
                              <CheckCircle className="w-3 h-3" />
                              Ready
                            </Span>
                          </>
                        ) : (
                          <Span size="xs" className="text-slate-400 flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            No audio
                          </Span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Play All Button - Only in expanded view */}
                {generation.status === 'completed' && hasAudioData && (
                  <Button
                    fullWidth
                    size="md"
                    leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    onClick={() => {
                      const firstSegment = generation.segments.find(s => s.audio_data);
                      if (firstSegment) {
                        const audioUrl = `data:audio/mp3;base64,${firstSegment.audio_data}`;
                        onPlay(audioUrl, `generation-${generation.id}`);
                      }
                    }}
                    className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 transition-all duration-300 rounded-xl"
                  >
                    {isPlaying ? '⏸ Pause Preview' : '▶ Play First Audio'}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ✅ Collapsed State Indicator - Always Visible when collapsed */}
          {!isExpanded && (
            <div className="mt-2 text-center">
              <button
                onClick={toggleExpand}
                className="text-sm text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 w-full py-2 rounded-lg hover:bg-slate-50"
              >
                <ChevronDown className="w-4 h-4" />
                Click to expand details ({generation.segment_count} files)
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};