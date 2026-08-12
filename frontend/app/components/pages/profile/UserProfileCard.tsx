// app/profile/components/UserProfileCard.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle,
  Sparkles,
  Award,
  Star,
  Crown
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Heading } from '@/app/components/typography/Heading';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { Span } from '@/app/components/typography/Span';
import { Button } from '@/app/components/ui/Button';
import { User as UserType } from '@/app/lib/auth/context';

interface UserProfileCardProps {
  user: UserType;
}

export const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-indigo-200/20 transition-all duration-500">
        {/* Animated Gradient Header */}
        <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Floating particles */}
          <div className="absolute top-4 right-8 animate-float">
            <Sparkles className="w-5 h-5 text-white/60" />
          </div>
          <div className="absolute bottom-4 left-8 animate-float-delayed">
            <Award className="w-4 h-4 text-white/40" />
          </div>
          
          {/* Avatar */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-2xl ring-4 ring-white/50">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <Span size="3xl" weight="bold" className="text-indigo-600">
                      {getInitials(user.name)}
                    </Span>
                  </div>
                )}
              </div>
              {user.email_verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="pt-14">
          <div className="flex items-start justify-between">
            <div>
              <Heading as="h2" size="lg" weight="bold" className="text-slate-800 flex items-center gap-2">
                {user.name}
                {user.is_active && (
                  <Span size="xs" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <Crown className="w-3 h-3" />
                    Active
                  </Span>
                )}
              </Heading>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-slate-400" />
                <Span size="sm" className="text-slate-600">
                  {user.email}
                </Span>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              user.email_verified 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                : 'bg-amber-50 text-amber-700 border-amber-200/80'
            }`}>
              {user.email_verified ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <Span size="xs" weight="medium">
                {user.email_verified ? 'Verified' : 'Not Verified'}
              </Span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100">
                  <Shield className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <Paragraph size="xs" className="text-slate-500">
                    Status
                  </Paragraph>
                  <Paragraph size="sm" weight="medium" className="text-slate-700">
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Paragraph>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100">
                  <Calendar className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <Paragraph size="xs" className="text-slate-500">
                    Joined
                  </Paragraph>
                  <Paragraph size="sm" weight="medium" className="text-slate-700">
                    {user.created_at ? formatDate(user.created_at) : 'N/A'}
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Actions */}
          <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Shield className="w-4 h-4" />}
              className="border-slate-200/60 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-300"
            >
              Security
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Star className="w-4 h-4" />}
              className="border-slate-200/60 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all duration-300"
            >
              Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};