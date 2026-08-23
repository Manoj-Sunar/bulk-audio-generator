// app/profile/page.tsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/app/lib/auth/context';
import { 
  Sparkles, Grid, List, Plus, RefreshCw,
  LayoutDashboard, Music
} from 'lucide-react';
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
import Link from 'next/link';
import { Background } from '@/app/components/ui/Background';

const ProfilePage = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const filteredGenerations = generationsData?.data || [];

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this generation?')) {
      deleteGeneration(id, {
        onSuccess: () => refetch(),
      });
    }
  };

  return (
    <AuthGuard>
      <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <Background />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 lg:px-6 lg:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <Heading as="h1" size="2xl" weight="bold" className="text-slate-900">
                  Studio
                </Heading>
                <Paragraph size="sm" className="text-slate-500 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {stats.total} generations • {stats.totalSegments} audio files
                </Paragraph>
              </div>
            </div>
            
            <Link href="/bulk-audio/generator">
              <Button
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 rounded-xl px-5 py-2.5 text-sm font-medium"
              >
                New Generation
              </Button>
            </Link>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="xl:col-span-4 space-y-4"
            >
              <UserProfileCard user={user!} />
              <StatsCard stats={stats} />
            </motion.aside>

            {/* Main Content */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="xl:col-span-8 space-y-4"
            >
              {/* Toolbar */}
              <Card className="border-0 shadow-md shadow-slate-200/50 rounded-xl bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            viewMode === 'grid'
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                          }`}
                          aria-label="Grid view"
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            viewMode === 'list'
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                          }`}
                          aria-label="List view"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                      <Span size="sm" className="text-slate-500 font-medium">
                        {filteredGenerations.length} results
                      </Span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => refetch()}
                      className="text-slate-400 hover:text-slate-600 rounded-lg px-3 py-1.5"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      <span className="ml-2 text-sm">Refresh</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Generations List */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-20"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Music className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <Paragraph className="text-slate-500 text-sm">
                        Loading your generations...
                      </Paragraph>
                    </div>
                  </motion.div>
                ) : filteredGenerations.length === 0 ? (
                  <EmptyState />
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className={`grid ${
                      viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 gap-4'
                        : 'grid-cols-1 gap-4'
                    }`}
                  >
                    {filteredGenerations.map((generation, index) => (
                      <GenerationCard
                        key={generation.id}
                        generation={generation}
                        onDownload={downloadGeneration}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                        isDownloading={isDownloading}
                        viewMode={viewMode}
                        index={index}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
};

export default ProfilePage;