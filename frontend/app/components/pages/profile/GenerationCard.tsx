// app/components/pages/profile/GenerationCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Calendar, Download, Trash2, Play, Pause, ChevronDown, ChevronUp,
  Music, Loader2, CheckCircle, XCircle, Clock, Mic2, ListMusic,
  FileAudio, BadgeCheck
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
  const [isHovered, setIsHovered] = useState(false);
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
    <motion.div
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      layout
      custom={index}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl bg-white ${
        isHovered ? 'scale-[1.02]' : ''
      }`}>
        {/* Premium gradient bar */}
        <div className={`h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 ${
          isHovered ? 'h-1.5 opacity-100' : 'opacity-60'
        }`} />
        
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5 gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <motion.div 
                className={`p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 transition-all duration-300 flex-shrink-0 ${
                  isHovered ? 'scale-110 shadow-md shadow-blue-500/20' : ''
                }`}
                animate={isHovered ? { rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Music className="w-6 h-6" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Heading as="h4" size="lg" weight="bold" className="text-slate-800 truncate">
                    Generation #{generation.id}
                  </Heading>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} flex-shrink-0`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.spin ? 'animate-spin' : ''}`} />
                    {statusConfig.label}
                  </span>
                  {hasAudioData && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 flex-shrink-0">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      {completedSegments}/{segments.length} ready
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                  <Span size="sm" className="text-slate-500 flex items-center gap-1.5 truncate">
                    <Mic2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate font-medium">
                      {generation.voice_insights?.name || generation.voice_id.slice(0, 8)}...
                    </span>
                  </Span>
                  <Span size="sm" className="text-slate-500 flex items-center gap-1.5 flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                    {formatDate(generation.created_at)}
                  </Span>
                  <Span size="sm" className="text-slate-500 flex items-center gap-1.5 flex-shrink-0">
                    <FileAudio className="w-4 h-4" />
                    {segments.length} files
                  </Span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {generation.status === 'completed' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDownload(generation.id)}
                    disabled={isDownloading}
                    className="border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 rounded-xl w-11 h-11"
                    leftIcon={isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  />
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(generation.id)}
                  disabled={isDeleting}
                  className="border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all duration-300 rounded-xl w-11 h-11"
                  leftIcon={isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                />
              </motion.div>
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                  isExpanded 
                    ? 'border-blue-300 bg-blue-50 text-blue-600' 
                    : 'border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Files', value: segments.length, color: 'blue' },
              { label: 'With Audio', value: completedSegments, color: 'emerald' },
              { label: 'Chunks', value: generation.chunk_count, color: 'amber' },
              { label: 'Voice', value: generation.voice_insights?.name || 'N/A', color: 'purple' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="text-center p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 hover:shadow-md transition-all duration-300"
              >
                <Span size="lg" weight="bold" className={`text-${stat.color}-600 block`}>
                  {stat.value}
                </Span>
                <Paragraph size="xs" className="text-slate-500 mt-0.5">
                  {stat.label}
                </Paragraph>
              </motion.div>
            ))}
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {/* Voice Insights */}
                {generation.voice_insights && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-200 mb-4"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <Mic2 className="w-4 h-4 text-slate-500" />
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
                    <Paragraph size="sm" className="text-slate-500 mt-2 leading-relaxed">
                      {generation.voice_insights.description}
                    </Paragraph>
                  </motion.div>
                )}
                
                {/* Audio Files List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Paragraph size="sm" weight="semibold" className="text-slate-700 flex items-center gap-2">
                      <ListMusic className="w-4 h-4" />
                      Audio Files ({segments.length})
                    </Paragraph>
                    <Span size="xs" className="text-slate-400">
                      {completedSegments} ready
                    </Span>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto scrollbar-hide space-y-2 pr-1">
                    {segments.map((segment, idx) => (
                      <motion.div
                        key={segment.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all duration-300 group"
                      >
                        <Span size="xs" className="font-mono text-slate-400 w-8 flex-shrink-0 text-center">
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
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {segment.audio_data ? (
                            <>
                              <Button
                                variant={currentlyPlayingSegment === segment.id ? "primary" : "outline"}
                                size="sm"
                                leftIcon={currentlyPlayingSegment === segment.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                onClick={() => handleSegmentPlay(segment)}
                                className={`transition-all duration-300 rounded-lg px-3 py-1.5 ${
                                  currentlyPlayingSegment === segment.id 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                                    : 'border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-300'
                                }`}
                              >
                                {currentlyPlayingSegment === segment.id ? 'Playing' : 'Play'}
                              </Button>
                              <Span size="xs" className="text-emerald-500 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Ready
                              </Span>
                            </>
                          ) : (
                            <Span size="xs" className="text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              No audio
                            </Span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Play All Button */}
                {generation.status === 'completed' && hasAudioData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                  >
                    <Button
                      fullWidth
                      size="md"
                      leftIcon={currentlyPlaying === `generation-${generation.id}` ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      onClick={() => {
                        const firstSegment = segments.find(s => s.audio_data);
                        if (firstSegment) {
                          const audioUrl = `data:audio/mp3;base64,${firstSegment.audio_data}`;
                          play(audioUrl, `generation-${generation.id}`);
                        }
                      }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-3.5 font-semibold"
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