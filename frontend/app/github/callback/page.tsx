'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGithubLogin } from '@/app/lib/auth/hooks';

export default function GithubCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mutate: githubLogin, isPending } = useGithubLogin();

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('GitHub OAuth Error:', error);
            router.push("/bulk-audio/bulk-audio-login"); // Redirect back to login on error
            return;
        }

        if (code) {
            // Send the code to your FastAPI backend
            githubLogin(code, {
                onSuccess: (data) => {
                    console.log(data)
                    router.push('/bulk-audio/generator'); // Redirect to app on success
                },
                onError: (err) => {
                    console.error('GitHub Login API Error:', err);
                    router.push("/bulk-audio/bulk-audio-login"); // Redirect back to login on API error
                },
            });
        } else {
            // If no code but no error either, something is wrong
            router.push('/login');
        }
    }, [searchParams, githubLogin, router]);

    // Show a loading state while processing
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary mx-auto"></div>
                <p className="text-on-surface-variant">Verifying GitHub login...</p>
            </div>
        </div>
    );
}