// app/profile/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/lib/auth/context';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Loader2,
  LogOut,
  Sparkles,
  Music,
  Grid3x3,
  List,
  Search,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useGenerationsList,
  useDeleteGeneration,
  useDownloadGeneration,
} from '@/app/lib/audio/hook';
import { Heading } from '@/app/components/typography/Heading';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { Span } from '@/app/components/typography/Span';
import { Button } from '@/app/components/ui/Button';
import { Card, CardContent } from '@/app/components/ui/Card';
import { staggerContainer } from '@/app/lib/animations';
import { UserProfileCard } from '@/app/components/pages/profile/UserProfileCard';
import { StatsCard } from '@/app/components/pages/profile/StatsCard';
import { EmptyState } from '@/app/components/pages/profile/EmptyState';
import { GenerationCard } from '@/app/components/pages/profile/GenerationCard';

const ProfilePage = () => {
  const { user, isLoading: authLoading} = useAuth();
  const router = useRouter();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);




  // Fetch generations
  const {
    data: generationsData,
    isLoading: generationsLoading,
    refetch: refetchGenerations,
  } = useGenerationsList(0, 100, true);

  const { mutate: deleteGeneration, isPending: isDeleting } = useDeleteGeneration();
  const { mutate: downloadGeneration, isPending: isDownloading } = useDownloadGeneration();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/bulk-audio/bulk-audio-login');
    }
  }, [user, authLoading, router]);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Handlers
  const handleDelete = (generationId: number) => {
    toast.custom((t) => (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto border border-slate-200">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-red-100">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <Heading as="h4" size="md" weight="semibold" className="text-slate-800">
              Delete Generation?
            </Heading>
            <Paragraph size="sm" className="text-slate-500 mt-1">
              This action cannot be undone. All audio files will be permanently removed.
            </Paragraph>
            <div className="flex gap-3 mt-4">
              <Button
                variant="destructive"
                size="sm"
                fullWidth
                onClick={() => {
                  toast.dismiss(t);
                  deleteGeneration(generationId, {
                    onSuccess: () => {
                      refetchGenerations();
                      toast.success('Generation deleted');
                    },
                    onError: () => toast.error('Failed to delete'),
                  });
                }}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => toast.dismiss(t)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const handleDownload = (generationId: number) => {
    downloadGeneration(generationId);
  };

  const handlePlay = (audioUrl: string, id: string) => {
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
  };

  const stats = {
    total: generationsData?.data?.length || 0,
    completed: generationsData?.data?.filter(g => g.status === 'completed').length || 0,
    processing: generationsData?.data?.filter(g => g.status === 'processing').length || 0,
    failed: generationsData?.data?.filter(g => g.status === 'failed').length || 0,
    totalSegments: generationsData?.data?.reduce((acc, g) => acc + g.segment_count, 0) || 0,
  };

  const filteredGenerations = generationsData?.data?.filter(g =>
    g.id.toString().includes(searchQuery) ||
    g.voice_id.includes(searchQuery) ||
    g.status.includes(searchQuery)
  ) || [];

  // Loading state
  if (authLoading || generationsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
          </div>
          <Paragraph size="md" weight="medium" className="text-slate-600 mt-4">
            Loading your profile...
          </Paragraph>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-200/50 text-slate-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <Heading as="h1" size="3xl" weight="bold" className="text-slate-900">
                My Studio
              </Heading>
              <Paragraph size="sm" className="text-slate-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                {stats.total} generations • {stats.totalSegments} audio files
              </Paragraph>
            </div>
          </div>
         
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            <UserProfileCard user={user} />
            <StatsCard stats={stats} />

            {/* Quick Actions */}
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <Heading as="h4" size="xs" weight="semibold" className="text-slate-700 mb-3">
                  Quick Actions
                </Heading>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    leftIcon={<Music className="w-4 h-4" />}
                    onClick={() => router.push('/bulk-audio')}
                    className="justify-start border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  >
                    New Generation
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => {
                      const completed = generationsData?.data?.filter(g => g.status === 'completed');
                      if (completed?.length === 0) {
                        toast.info('No completed generations to download');
                      } else {
                        toast.info('Select a generation to download');
                      }
                    }}
                    className="justify-start border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  >
                    Download All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-9 space-y-6"
          >
            {/* Toolbar */}
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    
                    <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <button
                       
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400'}
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </button>
                      <button
                       
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400'}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Span size="xs" className="text-slate-500">
                      {filteredGenerations.length} results
                    </Span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => refetchGenerations()}
                      className="hover:bg-slate-100 text-slate-400"
                    >
                      <Loader2 className={`w-4 h-4 ${generationsLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generations */}
            <AnimatePresence mode="wait">
              {filteredGenerations.length === 0 ? (
                <EmptyState />
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 gap-4' : 'grid-cols-1 gap-4'}`}
                >
                  {filteredGenerations.map((generation) => (
                    <GenerationCard
                      key={generation.id}
                      generation={generation}
                      onPlay={handlePlay}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                      isPlaying={currentlyPlaying === `generation-${generation.id}`}
                      isDeleting={isDeleting}
                      isDownloading={isDownloading}
                      viewMode={viewMode}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};

export default ProfilePage;