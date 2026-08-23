// app/components/pages/profile/UserProfileCard.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Mail, Calendar,  Clock,
  FileAudio, Sparkles, Rocket, User, CheckCircle, Crown,
  Layers, Activity, Zap
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

  // Fetch real generations data
  const { data: generationsData } = useGenerationsList(0, 100, false);
  
  const generations = generationsData?.data || [];
  
  // Calculate real stats
  const totalGenerations = generations.length;
  const completedGenerations = generations.filter(g => g.status === 'completed').length;
  const processingGenerations = generations.filter(g => g.status === 'processing').length;
  const totalAudioFiles = generations.reduce((acc, g) => acc + g.segment_count, 0);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = useCallback((name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
    return initials;
  }, []);



  // Calculate account age
  const getAccountAge = () => {
    if (!user.created_at) return 'N/A';
    const created = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl bg-white">
        {/* Premium Gradient Header */}
        <div className="h-32 sm:h-36 md:h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>
          
          <div className="absolute top-4 right-6 flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-10 right-16 text-white/20 hidden sm:block"
          >
            <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute bottom-10 left-16 text-white/20 hidden sm:block"
          >
            <Rocket className="w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
          
          {/* Avatar */}
          <div className="absolute -bottom-12 left-4 sm:left-6 md:left-8">
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl bg-white border-4 border-white shadow-2xl p-1">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <Span size="2xl" weight="bold" className="text-blue-600">
                      {getInitials(user.name)}
                    </Span>
                  </div>
                )}
              </div>
              {user.email_verified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                  className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                >
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </motion.div>
              )}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </div>
        </div>

        <CardContent className="pt-16 sm:pt-20 pb-6 px-4 sm:px-6 md:px-8">
          {/* User Info */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Heading as="h2" size="xl" weight="bold" className="text-slate-900 tracking-tight">
                  {user.name}
                </Heading>
                {user.is_active && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold"
                  >
                    <Crown className="w-3 h-3" />
                    Active
                  </motion.span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold">
                  <User className="w-3 h-3" />
                  Member
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                <Span size="sm" className="text-slate-600 truncate">{user.email}</Span>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <Span size="xs" className="text-slate-600 whitespace-nowrap">
                    Joined {user.created_at ? formatDate(user.created_at) : 'N/A'}
                  </Span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <Span size="xs" className="text-slate-600">
                    {getAccountAge()} old
                  </Span>
                </div>
              </div>
            </div>

          
          </div>

          {/* Stats Grid - Dynamic Data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-6">
            {[
              { 
                icon: Layers, 
                label: 'Generations', 
                value: totalGenerations, 
                color: 'blue' 
              },
              { 
                icon: CheckCircle, 
                label: 'Completed', 
                value: completedGenerations, 
                color: 'emerald' 
              },
              { 
                icon: Activity, 
                label: 'Processing', 
                value: processingGenerations, 
                color: 'amber' 
              },
              { 
                icon: FileAudio, 
                label: 'Audio Files', 
                value: totalAudioFiles, 
                color: 'purple' 
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 hover:shadow-md transition-all duration-300 group cursor-default"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className={`p-1.5 md:p-2 rounded-xl bg-${stat.color}-100/80 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                    <Paragraph size="xs" className="text-slate-500 font-medium truncate">{stat.label}</Paragraph>
                    <Paragraph size="sm" weight="bold" className="text-slate-800 leading-tight">
                      {stat.value}
                    </Paragraph>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

         

         
        </CardContent>
      </Card>
    </motion.div>
  );
};