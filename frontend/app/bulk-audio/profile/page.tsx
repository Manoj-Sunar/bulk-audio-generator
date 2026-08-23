// app/profile/page.tsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/app/lib/auth/context';
import { 
  Sparkles, 
  Grid,        // ✅ Use 'Grid' instead of 'LayoutGrid' or 'Grid3x3'
  List,        // ✅ Use 'List' instead of 'LayoutList' 
  Plus, 
  RefreshCw 
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
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
      >
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6 lg:py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <Heading as="h1" size="4xl" weight="extrabold" className="text-slate-900 tracking-tight">
                  My Studio
                </Heading>
                <Paragraph size="md" className="text-slate-500 flex items-center gap-2 mt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {stats.total} generations • {stats.totalSegments} audio files
                </Paragraph>
              </div>
            </div>
            
            <Link href="/bulk-audio">
              <Button
                size="lg"
                leftIcon={<Plus className="w-5 h-5" />}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 rounded-2xl px-8 py-4 text-base font-semibold group"
              >
                New Generation
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2 inline-block"
                >
                  →
                </motion.span>
              </Button>
            </Link>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="xl:col-span-5 space-y-3"
            >
              <UserProfileCard user={user!} />
              <StatsCard stats={stats} />
            </motion.div>

            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="xl:col-span-7 space-y-6"
            >
              {/* Toolbar */}
              <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2.5 rounded-lg transition-all duration-300 ${
                            viewMode === 'grid'
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                          }`}
                          aria-label="Grid view"
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2.5 rounded-lg transition-all duration-300 ${
                            viewMode === 'list'
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                          }`}
                          aria-label="List view"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                      <Span size="sm" className="text-slate-500 font-medium hidden sm:block">
                        {filteredGenerations.length} results
                      </Span>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => refetch()}
                        className="hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl px-4 transition-all duration-300"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span className="ml-2 text-sm font-medium">Refresh</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generations */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-32"
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl">🎵</span>
                        </div>
                      </div>
                      <Paragraph className="text-slate-500 font-medium">
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
                        ? 'grid-cols-1 md:grid-cols-2 gap-6'
                        : 'grid-cols-1 gap-6'
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
            </motion.div>
          </div>
        </div>
      </motion.main>
    </AuthGuard>
  );
};

export default ProfilePage;