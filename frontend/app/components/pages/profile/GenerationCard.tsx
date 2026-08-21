// app/components/pages/profile/GenerationCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Calendar, Download, Trash2, Play, Pause, ChevronDown, ChevronUp,
  Music, Loader2, CheckCircle, XCircle, Clock, Volume2, Mic2, ListMusic,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Heading } from '@/app/components/typography/Heading';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { Span } from '@/app/components/typography/Span';
import { Button } from '@/app/components/ui/Button';
import { listItemVariants } from '@/app/lib/animations';
import { useAudioPlayer } from '@/app/lib/audio/useAudioPlayer';

interface Segment { id: number; index: number; title: string; created_at: string; audio_data?: string; }
interface Generation { id: number; status: string; chunk_count: number; segment_count: number; created_at: string; voice_id: string; model_id: string; voice_insights?: { name: string; gender: string; description: string; accent: string; age: string; use_case: string; }; segments?: Segment[]; }

interface GenerationCardProps {
  generation: Generation;
  onDownload: (id: number) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  isDownloading: boolean;
  viewMode?: 'grid' | 'list';
}

export const GenerationCard = ({
  generation,
  onDownload,
  onDelete,
  isDeleting,
  isDownloading,
  viewMode = 'grid',
}: GenerationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { currentlyPlaying, play } = useAudioPlayer();
  const [currentlyPlayingSegment, setCurrentlyPlayingSegment] = useState<number | null>(null);

  const segments = generation.segments || [];
  const hasAudioData = segments.some(s => s.audio_data);
  const completedSegments = segments.filter(s => s.audio_data).length;

  // When the global playing id changes, update the local segment state
  useEffect(() => {
    if (currentlyPlaying && currentlyPlaying.startsWith('segment-')) {
      const segId = parseInt(currentlyPlaying.split('-')[1]);
      setCurrentlyPlayingSegment(segId);
    } else {
      setCurrentlyPlayingSegment(null);
    }
  }, [currentlyPlaying]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': return { icon: CheckCircle, label: 'Completed', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', spin: false };
      case 'processing': return { icon: Loader2, label: 'Processing', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', spin: true };
      case 'failed': return { icon: XCircle, label: 'Failed', color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', spin: false };
      default: return { icon: Clock, label: 'Pending', color: 'slate', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', spin: false };
    }
  };
  const statusConfig = getStatusConfig(generation.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleSegmentPlay = (segment: Segment) => {
    if (!segment.audio_data) { toast.info('No audio data available'); return; }
    const audioUrl = `data:audio/mp3;base64,${segment.audio_data}`;
    play(audioUrl, `segment-${segment.id}`);
  };

  return (
    <motion.div variants={listItemVariants} initial="hidden" animate="visible" layout
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className={`h-0.5 bg-blue-600 transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-40'}`} />
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`p-3 rounded-xl bg-slate-100 text-slate-600 transition-all duration-300 flex-shrink-0 ${isHovered ? 'scale-105' : ''}`}>
                <Music className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Heading as="h4" size="sm" weight="semibold" className="text-slate-800 truncate">Generation #{generation.id}</Heading>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} flex-shrink-0`}>
                    <StatusIcon className={`w-3 h-3 ${statusConfig.spin ? 'animate-spin' : ''}`} />
                    {statusConfig.label}
                  </span>
                  {hasAudioData && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 flex-shrink-0">
                      <Volume2 className="w-3 h-3" />
                      {completedSegments}/{segments.length} ready
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
                  <Span size="xs" className="text-slate-500 flex-shrink-0">📁 {segments.length} files</Span>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {generation.status === 'completed' && (
                <Button variant="outline" size="icon" onClick={() => onDownload(generation.id)} disabled={isDownloading}
                  className="border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200"
                  leftIcon={isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                />
              )}
              <Button variant="outline" size="icon" onClick={() => onDelete(generation.id)} disabled={isDeleting}
                className="border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
                leftIcon={isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              />
              <button onClick={() => setIsExpanded(!isExpanded)} className="w-11 h-11 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-200">
              <Span size="lg" weight="bold" className="text-blue-600">{segments.length}</Span>
              <Paragraph size="xs" className="text-slate-500">Total Files</Paragraph>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-200">
              <Span size="lg" weight="bold" className="text-emerald-600">{completedSegments}</Span>
              <Paragraph size="xs" className="text-slate-500">With Audio</Paragraph>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-200">
              <Span size="lg" weight="bold" className="text-amber-600">{generation.chunk_count}</Span>
              <Paragraph size="xs" className="text-slate-500">Chunks</Paragraph>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-200">
              <Span size="lg" weight="bold" className="text-slate-600 truncate block">{generation.voice_insights?.name || 'N/A'}</Span>
              <Paragraph size="xs" className="text-slate-500">Voice</Paragraph>
            </div>
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                {/* Voice Insights */}
                {generation.voice_insights && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Mic2 className="w-4 h-4 text-slate-500" />
                      <Span size="xs" weight="semibold" className="text-slate-700">{generation.voice_insights.name}</Span>
                      <Span size="xs" className="text-slate-400">•</Span>
                      <Span size="xs" className="text-slate-500">{generation.voice_insights.gender}</Span>
                      <Span size="xs" className="text-slate-400">•</Span>
                      <Span size="xs" className="text-slate-500">{generation.voice_insights.accent}</Span>
                      <Span size="xs" className="text-slate-400">•</Span>
                      <Span size="xs" className="text-slate-500">{generation.voice_insights.age}</Span>
                    </div>
                    <Paragraph size="xs" className="text-slate-500 mt-1">{generation.voice_insights.description}</Paragraph>
                  </div>
                )}
                {/* Audio Files List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Paragraph size="xs" weight="semibold" className="text-slate-600 flex items-center gap-2">
                      <ListMusic className="w-3.5 h-3.5" />
                      Audio Files ({segments.length})
                    </Paragraph>
                  </div>
                  <div className="max-h-56 overflow-y-auto scrollbar-hide space-y-2 pr-1">
                    {segments.map((segment) => (
                      <div key={segment.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors group">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Span size="xs" className="font-mono text-slate-400 w-8 flex-shrink-0">#{segment.index}</Span>
                          <div className="flex-1 min-w-0">
                            <Paragraph size="sm" weight="medium" className="text-slate-700 truncate">{segment.title}</Paragraph>
                            <Span size="xs" className="text-slate-400">{formatDate(segment.created_at)}</Span>
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
                                className={currentlyPlayingSegment === segment.id ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 flex-shrink-0" : "border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-300 flex-shrink-0"}
                              >
                                {currentlyPlayingSegment === segment.id ? 'Playing' : 'Play'}
                              </Button>
                              <Span size="xs" className="text-emerald-500 flex items-center gap-1 flex-shrink-0">
                                <CheckCircle className="w-3 h-3" /> Ready
                              </Span>
                            </>
                          ) : (
                            <Span size="xs" className="text-slate-400 flex items-center gap-1 flex-shrink-0">
                              <Clock className="w-3 h-3" /> No audio
                            </Span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Play All */}
                {generation.status === 'completed' && hasAudioData && (
                  <Button
                    fullWidth size="md"
                    leftIcon={currentlyPlaying === `generation-${generation.id}` ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    onClick={() => {
                      const firstSegment = segments.find(s => s.audio_data);
                      if (firstSegment) {
                        const audioUrl = `data:audio/mp3;base64,${firstSegment.audio_data}`;
                        play(audioUrl, `generation-${generation.id}`);
                      }
                    }}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors rounded-lg"
                  >
                    {currentlyPlaying === `generation-${generation.id}` ? '⏸ Pause Preview' : '▶ Play First Audio'}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};