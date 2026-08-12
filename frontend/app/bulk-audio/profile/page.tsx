// app/profile/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/lib/auth/context';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  Loader2,
  FileAudio,
  LogOut,
  Sparkles,
  Music,
  Waves,
  ArrowUpRight,
  Grid3x3,
  List,
  Search,
  Filter,
  Download,
  Play,
  Pause,
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Volume2,
  Headphones,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Share2,
  Star,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  useGenerationsList, 
  useDeleteGeneration, 
  useDownloadGeneration
} from '@/app/lib/audio/hook';
import { Background } from '@/app/components/ui/Background';
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
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch generations with audio
  const { 
    data: generationsData, 
    isLoading: generationsLoading,
    refetch: refetchGenerations 
  } = useGenerationsList(0, 100, true, 5);

  // Mutations
  const { mutate: deleteGeneration, isPending: isDeleting } = useDeleteGeneration();
  const { mutate: downloadGeneration, isPending: isDownloading } = useDownloadGeneration();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/bulk-audio/bulk-audio-login');
    }
  }, [user, authLoading, router]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Handle generation deletion with confirmation
  const handleDelete = (generationId: number) => {
    toast.custom((t) => (
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-md mx-auto border border-slate-200/60">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-red-500/10 to-rose-500/10">
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
                      toast.success('Generation deleted successfully');
                    },
                    onError: () => {
                      toast.error('Failed to delete generation');
                    }
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
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  // Handle generation download
  const handleDownload = (generationId: number) => {
    downloadGeneration(generationId);
  };

  // Handle audio play
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

  // Get stats
  const stats = {
    total: generationsData?.data?.length || 0,
    completed: generationsData?.data?.filter(g => g.status === 'completed').length || 0,
    processing: generationsData?.data?.filter(g => g.status === 'processing').length || 0,
    failed: generationsData?.data?.filter(g => g.status === 'failed').length || 0,
    totalSegments: generationsData?.data?.reduce((acc, g) => acc + g.segment_count, 0) || 0,
  };

  // Filter generations
  const filteredGenerations = generationsData?.data?.filter(g => 
    g.id.toString().includes(searchQuery) ||
    g.voice_id.includes(searchQuery) ||
    g.status.includes(searchQuery)
  ) || [];

  if (authLoading || generationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center animate-pulse">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full animate-ping" />
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
      transition={{ duration: 0.6 }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30"
    >
      <Background />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 lg:px-6">
        {/* Header with gradient accent */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/30">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <Heading as="h1" size="3xl" weight="bold" className="text-slate-900">
                    <Span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      My Studio
                    </Span>
                  </Heading>
                  <Paragraph size="sm" className="text-slate-500 mt-0.5 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {stats.total} generations • {stats.totalSegments} audio files
                  </Paragraph>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<LogOut size={16} />}
                onClick={logout}
                className="border-slate-200/60 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-300"
              >
                <Span className="hidden sm:inline">Logout</Span>
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column - User Profile & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            <UserProfileCard user={user} />
            <StatsCard stats={stats} />
            
            {/* Quick Actions */}
            <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl">
              <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
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
                    className="justify-start border-slate-200/60 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
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
                    className="justify-start border-slate-200/60 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Download All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Generations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-9 space-y-6"
          >
            {/* Toolbar */}
            <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl">
              <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-50/80 rounded-xl px-3 py-2 border border-slate-200/40">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search generations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-slate-700 w-40 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50/80 rounded-xl p-1 border border-slate-200/40">
                      <Button
                        variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-slate-400'}
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'primary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-slate-400'}
                      >
                        <List className="w-4 h-4" />
                      </Button>
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
                      className="hover:bg-indigo-50 text-slate-400 hover:text-indigo-600"
                    >
                      <Loader2 className={`w-4 h-4 ${generationsLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generations List */}
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