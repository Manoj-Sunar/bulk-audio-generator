'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient, extractErrorMessage } from '@/app/lib/axios/client';
import { useAuth } from '@/app/lib/auth/context';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth(); // ✅ Get setUser from context to sync state

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
      toast.error('Google authentication failed');
      router.push('/bulk-audio/bulk-audio-login');
      return;
    }

    const login = async () => {
      try {
        // ✅ Use apiClient instead of native fetch
        const res = await apiClient.post('/user/google', { token: code });
        
        // ✅ Extract user data from the response
        const userData = res.data?.data?.user || res.data?.data || res.data;
        
        // ✅ Manually update the AuthContext so the Navbar updates instantly
        setUser(userData);

        toast.success('Google login successful!');
        router.push('/bulk-audio/generator');
      } catch (err: any) {
        const message = extractErrorMessage(err) || 'Google authentication failed';
        toast.error(message);
        router.push('/bulk-audio/bulk-audio-login');
      }
    };

    login();
  }, [searchParams, router, setUser]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary mx-auto"></div>
        <p className="text-on-surface-variant">Verifying Google login...</p>
      </div>
    </div>
  );
}