// app/profile/page.tsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/app/lib/auth/context';
import { Sparkles, Grid3x3, List, Loader2 } from 'lucide-react';
import { useGenerationsList, useDeleteGeneration, useDownloadGeneration } from '@/app/lib/audio/hook';
import { staggerContainer } from '@/app/lib/animations';
import { AuthGuard } from '@/app/components/AuthGuard';
import { UserProfileCard } from '@/app/components/pages/profile/UserProfileCard';
import { StatsCard } from '@/app/components/pages/profile/StatsCard';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Span } from '@/app/components/typography/Span';
import { Button } from '@/app/components/ui/Button';
import { Heading } from '@/app/components/typography/Heading';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { EmptyState } from '@/app/components/pages/profile/EmptyState';
import { GenerationCard } from '@/app/components/pages/profile/GenerationCard';

const ProfilePage = () => {
  const { user } = useAuth(); // AuthGuard ensures this is not null
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: generationsData, isLoading, refetch } = useGenerationsList(0, 100, true);
  const { mutate: deleteGeneration, isPending: isDeleting } = useDeleteGeneration();
  const { mutate: downloadGeneration, isPending: isDownloading } = useDownloadGeneration();

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

  // Handlers for delete and download (with toast confirm) – keep as before

  return (
    <AuthGuard>
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-200/50 text-slate-600"><Sparkles className="w-6 h-6" /></div>
              <div>
                <Heading as="h1" size="3xl" weight="bold" className="text-slate-900">My Studio</Heading>
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
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 space-y-6">
              <UserProfileCard user={user!} /> {/* user is guaranteed by AuthGuard */}
              <StatsCard stats={stats} />
              {/* Quick Actions – same as before */}
            </motion.div>

            {/* Main content */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-9 space-y-6">
              {/* Toolbar */}
              <Card className="border border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
                        <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400'}><Grid3x3 className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400'}><List className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Span size="xs" className="text-slate-500">{filteredGenerations.length} results</Span>
                      <Button variant="ghost" size="icon" onClick={() => refetch()} className="hover:bg-slate-100 text-slate-400">
                        <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generations */}
              <AnimatePresence mode="wait">
                {filteredGenerations.length === 0 ? <EmptyState /> : (
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible" className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 gap-4' : 'grid-cols-1 gap-4'}`}>
                    {filteredGenerations.map((generation) => (
                      <GenerationCard
                        key={generation.id}
                        generation={generation}
                        onDownload={downloadGeneration}
                        onDelete={deleteGeneration}
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
    </AuthGuard>
  );
};

export default ProfilePage;