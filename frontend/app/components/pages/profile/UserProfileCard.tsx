// app/components/pages/profile/UserProfileCard.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Mail, Calendar, Clock, User, CheckCircle, 
  Layers, Activity, FileAudio, Sparkles,
  Award, Zap, Crown
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Heading } from '@/app/components/typography/Heading';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { Span } from '@/app/components/typography/Span';
import { User as UserType } from '@/app/lib/auth/context';
import { useCallback } from 'react';
import { useGenerationsList } from '@/app/lib/audio/hook';

interface UserProfileCardProps {
  user: UserType;
}

export const UserProfileCard = ({ user }: UserProfileCardProps) => {
  if (!user) return null;

  const { data: generationsData } = useGenerationsList(0, 100, false);
  const generations = generationsData?.data || [];
  
  const totalGenerations = generations.length;
  const completedGenerations = generations.filter(g => g.status === 'completed').length;
  const totalAudioFiles = generations.reduce((acc, g) => acc + g.segment_count, 0);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = useCallback((name: string) => {
    return name.split(' ').map(n => n.charAt(0).toUpperCase()).join('');
  }, []);

  const getAccountAge = () => {
    if (!user.created_at) return 'N/A';
    const created = new Date(user.created_at);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden rounded-2xl bg-white">
      {/* Premium Header */}
      <div className="relative h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
      </div>

      <CardContent className="relative px-6 pb-6">
        {/* Avatar - Overlapping Header */}
        <div className="relative -mt-12 flex items-end gap-5">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-xl overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <Span size="2xl" weight="bold" className="text-blue-600">
                    {getInitials(user.name)}
                  </Span>
                </div>
              )}
            </div>
            {user.email_verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </motion.div>

          <div className="flex-1 pt-12 pb-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Heading as="h2" size="xl" weight="bold" className="text-slate-900">
                {user.name}
              </Heading>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                <Crown className="w-3 h-3" />
                Active
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Mail className="w-3.5 h-3.5" />
                <Span size="sm" className="text-slate-600">{user.email}</Span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <Span size="xs" className="text-slate-500">
                  Joined {user.created_at ? formatDate(user.created_at) : 'N/A'}
                </Span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <Span size="xs" className="text-slate-500">
                  {getAccountAge()} old
                </Span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { icon: Layers, label: 'Generations', value: totalGenerations, color: 'blue' },
            { icon: CheckCircle, label: 'Completed', value: completedGenerations, color: 'emerald' },
            { icon: Activity, label: 'Processing', value: generations.filter(g => g.status === 'processing').length, color: 'amber' },
            { icon: FileAudio, label: 'Audio Files', value: totalAudioFiles, color: 'purple' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-slate-300 transition-all duration-300"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg bg-${stat.color}-100/70 text-${stat.color}-600`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <Paragraph size="xs" className="text-slate-500 font-medium leading-none">
                    {stat.label}
                  </Paragraph>
                  <Paragraph size="sm" weight="bold" className="text-slate-800 leading-tight mt-0.5">
                    {stat.value}
                  </Paragraph>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};