'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handlePhoneSignIn = () => {
    router.push('/login?method=phone');
  };

  const handleGuestContinue = () => {
    router.push('/');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnLq0aVbjLXyJC4TgmXsb6KP7YmnRnify9fSAmqDolSMmzrM2WyX7DU-H627KxJSB0Pqq5nC4x670dHv9z5J3EmMsBb_k90XbACuL7nQsUHuGGwpQumffaIY_-yxDLWD1_j-m8StWaBmypWmdXJPBuDa1yET02bE4DHPjhylrD56kLpOIQ8ibL5kvOr30HantW-ETniu-2i0UgYixwUMm4Br6BI6W8rSaY7d9A5443FIfjjOVcBeUdXZwyOZjBqsmYgrXxf4NpLlC4')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/80 to-transparent dark:from-background-dark dark:via-background-dark/80"></div>
      </div>

      {/* Main Container/Card */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-xl bg-white/50 p-6 shadow-2xl backdrop-blur-lg dark:bg-[#1A1C20]/50 sm:p-8">
        {/* Large Blue Circular Icon with Exclamation */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary">
            <span className="material-symbols-outlined text-5xl text-white">info</span>
          </div>
        </div>

        {/* HeadlineText */}
        <h1 className="text-center font-display text-2xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-3xl">
          Welcome. Get Started in Seconds.
        </h1>

        {/* BodyText */}
        <p className="mt-2 px-4 text-center font-display text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          Join the ultimate marketplace for digital codes and gaming assets.
        </p>

        {/* ButtonGroup */}
        <div className="mt-8 flex w-full flex-col items-stretch gap-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
            </svg>
            <span className="truncate">Continue with Google</span>
          </button>
          <button
            onClick={handlePhoneSignIn}
            disabled={isLoading}
            className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg bg-slate-200/80 px-5 text-base font-bold leading-normal tracking-[0.015em] text-slate-700 transition-transform hover:scale-105 dark:bg-[#223d49] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-xl">phone_iphone</span>
            <span className="truncate">Continue with Phone Number</span>
          </button>
        </div>

        {/* MetaText */}
        <button
          onClick={handleGuestContinue}
          className="mt-8 cursor-pointer text-center font-display text-sm font-normal leading-normal text-slate-500 underline decoration-slate-400 decoration-1 underline-offset-2 transition-colors hover:text-primary dark:text-[#90b8cb] dark:decoration-slate-500 dark:hover:text-primary"
        >
          Continue as Guest
        </button>

        {/* Legal/Policy Links */}
        <div className="mt-8 w-full border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
           <p className="text-center font-display text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-primary hover:underline">
                  Log In
                </Link>
              </p>
          <p className="text-center font-display text-xs text-slate-500 dark:text-slate-400 mt-4">
            By continuing, you agree to our{' '}
            <Link
              className="font-medium text-slate-600 underline hover:text-primary dark:text-slate-300 dark:hover:text-primary"
              href="/terms"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              className="font-medium text-slate-600 underline hover:text-primary dark:text-slate-300 dark:hover:text-primary"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
