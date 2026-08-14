// app/profile/components/UserProfileCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Mail, Calendar, Shield, CheckCircle, XCircle, Crown, User, HardDrive, Settings } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Heading } from '@/app/components/typography/Heading';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { Span } from '@/app/components/typography/Span';
import { Button } from '@/app/components/ui/Button';
import { User as UserType } from '@/app/lib/auth/context';
import { useCallback } from 'react';

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



  const getInitials = useCallback((name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
    return initials;
  }, []);

  // Placeholder quota data – replace with real data later
  const quota = {
    used: 42,
    total: 100,
    remaining: 58,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Header with solid color */}
        <div className="h-20 bg-slate-100 border-b border-slate-200 relative">
          {/* Avatar */}
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-white border-2 border-slate-200 shadow-sm p-0.5">
                {user.avatar === "" || user.avatar === undefined ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-slate-100 flex items-center justify-center">
                    <Span size="xl" weight="bold" className="text-slate-500">
                      {getInitials(user.name)}
                    </Span>
                  </div>
                )}
              </div>
              {user.email_verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="pt-12 pb-5 px-5">
          <div className="flex items-start justify-between">
            <div>
              <Heading as="h2" size="lg" weight="bold" className="text-slate-800 flex items-center gap-2">
                {user.name}
                {user.is_active && (
                  <Span size="xs" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Crown className="w-3 h-3" />
                    Active
                  </Span>
                )}
              </Heading>
              <div className="flex items-center gap-2 mt-0.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <Span size="sm" className="text-slate-600">{user.email}</Span>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${user.email_verified
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
              {user.email_verified ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <Span size="xs" weight="medium">
                {user.email_verified ? 'Verified' : 'Not Verified'}
              </Span>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <div>
                  <Paragraph size="xs" className="text-slate-500">Status</Paragraph>
                  <Paragraph size="sm" weight="medium" className="text-slate-700">
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Paragraph>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <Paragraph size="xs" className="text-slate-500">Joined</Paragraph>
                  <Paragraph size="sm" weight="medium" className="text-slate-700">
                    {user.created_at ? formatDate(user.created_at) : 'N/A'}
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>

          {/* Quota Section (future) */}
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-slate-400" />
                <Span size="sm" weight="medium" className="text-slate-700">Storage Quota</Span>
              </div>
              <Span size="xs" className="text-slate-500">
                {quota.used} / {quota.total} used
              </Span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${(quota.used / quota.total) * 100}%` }}
              />
            </div>
            <Span size="xs" className="text-slate-400 mt-1 block">
              {quota.remaining} remaining
            </Span>
          </div>

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Settings className="w-4 h-4" />}
              className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600"
              onClick={() => { /* open password change modal */ }}
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Crown className="w-4 h-4" />}
              className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600"
            >
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};