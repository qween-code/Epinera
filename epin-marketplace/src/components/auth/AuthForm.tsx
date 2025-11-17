'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    // No need to set loading to false here, as the page will redirect.
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    const email = new FormData(event.currentTarget).get('email') as string;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setIsLoading(false);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Check your email for the login link!');
    }
  };

  return (
    <div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-xl bg-white/50 p-6 shadow-2xl backdrop-blur-lg dark:bg-[#1A1C20]/50 sm:p-8">
      <div className="mb-6 flex items-center justify-center">
        <svg
          className="h-10 w-10 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
        </svg>
      </div>
      <h1 className="text-center font-display text-2xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-3xl">
        Welcome. Get Started in Seconds.
      </h1>
      <p className="mt-2 px-4 text-center font-display text-sm text-slate-600 dark:text-slate-300 sm:text-base">
        Join the ultimate marketplace for digital codes and gaming assets.
      </p>

      <div className="mt-8 flex w-full flex-col items-stretch gap-3">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="truncate">Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-2">
          <div className="absolute h-px w-full bg-gray-300 dark:bg-gray-700"></div>
          <span className="relative bg-white/50 dark:bg-[#1A1C20]/50 px-2 text-sm text-gray-500 dark:text-gray-400 backdrop-blur-lg">
            Or
          </span>
        </div>

        <form className="w-full" onSubmit={handleEmailLogin}>
          <input
            name="email"
            className="form-input mb-3 flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
            placeholder="Enter your email"
            required
            type="email"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-slate-200/80 px-5 text-base font-bold leading-normal tracking-[0.015em] text-slate-700 transition-transform hover:scale-105 dark:bg-[#223d49] dark:text-white disabled:scale-100 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xl mr-2">
              mail
            </span>
            <span className="truncate">Continue with Email</span>
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-green-500 bg-green-500/10 p-3 rounded-lg">
            {message}
          </div>
        )}
      </div>

      <p className="mt-8 cursor-pointer text-center font-display text-sm font-normal leading-normal text-slate-500 underline decoration-slate-400 decoration-1 underline-offset-2 transition-colors hover:text-primary dark:text-[#90b8cb] dark:decoration-slate-500 dark:hover:text-primary">
        Continue as Guest
      </p>

      <div className="mt-8 w-full border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
        <p className="text-center font-display text-xs text-slate-500 dark:text-slate-400">
          By continuing, you agree to our{' '}
          <a
            className="font-medium text-slate-600 underline hover:text-primary dark:text-slate-300 dark:hover:text-primary"
            href="#"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            className="font-medium text-slate-600 underline hover:text-primary dark:text-slate-300 dark:hover:text-primary"
            href="#"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
