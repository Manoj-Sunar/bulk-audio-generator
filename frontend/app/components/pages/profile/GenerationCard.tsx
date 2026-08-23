// app/components/pages/profile/GenerationCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Calendar, Download, Trash2, Play, Pause, ChevronDown, ChevronUp,
  Music, Loader2, CheckCircle, XCircle, Clock, Mic2, FileAudio,
  BadgeCheck, MoreVertical
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
  index?: number;
}

export const GenerationCard = ({
  generation,
  onDownload,
  onDelete,
  isDeleting,
  isDownloading,
  viewMode = 'grid',
  index = 0,
}: GenerationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentlyPlaying, play } = useAudioPlayer();
  const [currentlyPlayingSegment, setCurrentlyPlayingSegment] = useState<number | null>(null);

  const segments = generation.segments || [];
  const hasAudioData = segments.some(s => s.audio_data);
  const completedSegments = segments.filter(s => s.audio_data).length;

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
      case 'completed': 
        return { icon: CheckCircle, label: 'Completed', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', spin: false };
      case 'processing': 
        return { icon: Loader2, label: 'Processing', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', spin: true };
      case 'failed': 
        return { icon: XCircle, label: 'Failed', color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', spin: false };
      default: 
        return { icon: Clock, label: 'Pending', color: 'slate', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', spin: false };
    }
  };
  const statusConfig = getStatusConfig(generation.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const handleSegmentPlay = (segment: Segment) => {
    if (!segment.audio_data) { toast.info('No audio data available'); return; }
    const audioUrl = `data:audio/mp3;base64,${segment.audio_data}`;
    play(audioUrl, `segment-${segment.id}`);
  };

  return (
    <motion.div
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      layout
      custom={index}
    >
      <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300 overflow-hidden rounded-xl bg-white">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex-shrink-0">
                <Music className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Heading as="h4" size="md" weight="semibold" className="text-slate-800 truncate">
                    Generation #{generation.id}
                  </Heading>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    <StatusIcon className={`w-3 h-3 ${statusConfig.spin ? 'animate-spin' : ''}`} />
                    {statusConfig.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <Span size="xs" className="text-slate-500 flex items-center gap-1">
                    <Mic2 className="w-3 h-3" />
                    {generation.voice_insights?.name || generation.voice_id.slice(0, 8)}...
                  </Span>
                  <Span size="xs" className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(generation.created_at)}
                  </Span>
                  <Span size="xs" className="text-slate-500 flex items-center gap-1">
                    <FileAudio className="w-3 h-3" />
                    {segments.length} files
                  </Span>
                  {hasAudioData && (
                    <Span size="xs" className="text-emerald-600 flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" />
                      {completedSegments}/{segments.length} ready
                    </Span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {generation.status === 'completed' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDownload(generation.id)}
                    disabled={isDownloading}
                    className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg w-9 h-9"
                  >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(generation.id)}
                  disabled={isDeleting}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg w-9 h-9"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </motion.div>
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                  isExpanded 
                    ? 'border-blue-300 bg-blue-50 text-blue-600' 
                    : 'border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {/* Voice Insights */}
                {generation.voice_insights && (
                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Mic2 className="w-3.5 h-3.5 text-slate-400" />
                      <Span size="sm" weight="semibold" className="text-slate-700">
                        {generation.voice_insights.name}
                      </Span>
                      <Span size="xs" className="text-slate-400">•</Span>
                      <Span size="xs" className="text-slate-500">{generation.voice_insights.gender}</Span>
                      <Span size="xs" className="text-slate-400">•</Span>
                      <Span size="xs" className="text-slate-500">{generation.voice_insights.accent}</Span>
                      <Span size="xs" className="text-slate-400">•</Span>
                      <Span size="xs" className="text-slate-500">{generation.voice_insights.age}</Span>
                    </div>
                    <Paragraph size="xs" className="text-slate-500 mt-1.5">
                      {generation.voice_insights.description}
                    </Paragraph>
                  </div>
                )}
                
                {/* Audio Files List */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Paragraph size="xs" weight="semibold" className="text-slate-600 flex items-center gap-2">
                      <FileAudio className="w-3.5 h-3.5" />
                      Audio Files ({segments.length})
                    </Paragraph>
                    <Span size="xs" className="text-slate-400">
                      {completedSegments} ready
                    </Span>
                  </div>
                  
                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                    {segments.map((segment, idx) => (
                      <motion.div
                        key={segment.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50/60 border border-slate-200/60 hover:bg-slate-100/80 transition-all duration-200 group"
                      >
                        <Span size="xs" className="font-mono text-slate-400 w-7 flex-shrink-0 text-center">
                          #{segment.index}
                        </Span>
                        
                        <div className="flex-1 min-w-0">
                          <Paragraph size="xs" weight="medium" className="text-slate-700 truncate">
                            {segment.title}
                          </Paragraph>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {segment.audio_data ? (
                            <>
                              <Button
                                variant={currentlyPlayingSegment === segment.id ? "primary" : "ghost"}
                                size="sm"
                                leftIcon={currentlyPlayingSegment === segment.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                onClick={() => handleSegmentPlay(segment)}
                                className={`transition-all duration-200 rounded-lg px-3 py-1 text-xs ${
                                  currentlyPlayingSegment === segment.id 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                              >
                                {currentlyPlayingSegment === segment.id ? 'Playing' : 'Play'}
                              </Button>
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                            </>
                          ) : (
                            <Clock className="w-3 h-3 text-slate-300" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Play All Button */}
                {generation.status === 'completed' && hasAudioData && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-4"
                  >
                    <Button
                      fullWidth
                      size="sm"
                      leftIcon={currentlyPlaying === `generation-${generation.id}` ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      onClick={() => {
                        const firstSegment = segments.find(s => s.audio_data);
                        if (firstSegment) {
                          const audioUrl = `data:audio/mp3;base64,${firstSegment.audio_data}`;
                          play(audioUrl, `generation-${generation.id}`);
                        }
                      }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg py-2.5 text-sm font-medium"
                    >
                      {currentlyPlaying === `generation-${generation.id}` ? '⏸ Pause Preview' : '▶ Play First Audio'}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};