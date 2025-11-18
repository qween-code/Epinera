'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Error: Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Error: Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setIsLoading(false);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Success! Please check your email to verify your account.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handlePhoneSignUp = () => {
    router.push('/login?method=phone');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex min-h-screen w-full items-stretch justify-center">
          <div className="flex w-full max-w-7xl flex-row items-stretch">
            {/* Left Branding Panel */}
            <div className="relative hidden w-1/2 flex-col items-start justify-end overflow-hidden p-12 lg:flex">
              <div
                className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
                data-alt="Abstract image of a futuristic digital landscape with neon blue and purple lights, representing a gaming universe."
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbDSMOoCPWuY9X9pvCiJaYmbtW86jzu0pNAeKIBTAzARkEGwq5DmlY6gEeByAHb_KinBCGt4Bkz-UWepWVAiBEKaXbYwwx2135UB9EUpaPhsnPRVGbCaHt5SE0MbmAicy4ocC2TO4Qs7SSXj_I7NXDkihq0WQiYJAwXHNs7NG4vLse2DbyZQOJiAh0Nv4GIrX6h27CgrPjruhdXf3RcWZSHFnxJpkUiil7ax8kuHJvThlBsTeOjfeHlxv64u1FrBXFUBy7BCSz-CvW')",
                }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
              </div>
              <div className="relative z-10 flex flex-col gap-4 text-white">
                <h1 className="font-display text-5xl font-bold leading-tight">Join the Digital Universe.</h1>
                <p className="font-display max-w-md text-lg text-white/80">Create your account and start trading digital codes and gaming assets today.</p>
              </div>
            </div>
            {/* Right Sign Up Panel */}
            <div className="flex w-full flex-1 items-center justify-center p-6 sm:p-8 lg:w-1/2">
              <div className="flex w-full max-w-md flex-col gap-8 py-10">
                {/* Header */}
                <div className="flex flex-col gap-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-primary text-4xl">stadia_controller</span>
                    <span className="font-display text-2xl font-bold text-gray-900 dark:text-white">EpinMarket</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-display text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">Create Account</p>
                    <p className="font-display text-base font-normal leading-normal text-gray-500 dark:text-gray-400">Sign Up to Get Started</p>
                  </div>
                </div>
                {/* Form */}
                <form className="flex w-full flex-col gap-4" onSubmit={handleSignUp}>
                  {/* Email Input */}
                  <label className="flex flex-col flex-1">
                    <p className="font-display text-base font-medium leading-normal pb-2 text-gray-800 dark:text-gray-200">Email</p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <div className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg border-r-0 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined">email</span>
                      </div>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-l-none border-l-0 text-base font-normal leading-normal"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </label>
                  {/* Password Input */}
                  <label className="flex flex-col flex-1">
                    <p className="font-display text-base font-medium leading-normal pb-2 text-gray-800 dark:text-gray-200">Password</p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <div className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg border-r-0 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-l-none rounded-r-none border-x-0 text-base font-normal leading-normal"
                        placeholder="Enter your password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pr-4 rounded-r-lg border-l-0 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </label>
                  {/* Confirm Password Input */}
                  <label className="flex flex-col flex-1">
                    <p className="font-display text-base font-medium leading-normal pb-2 text-gray-800 dark:text-gray-200">Confirm Password</p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <div className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg border-r-0 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-l-none rounded-r-none border-x-0 text-base font-normal leading-normal"
                        placeholder="Confirm your password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pr-4 rounded-r-lg border-l-0 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </label>
                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-14 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </form>
                {/* Social Logins */}
                <div className="flex flex-col gap-4">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-px w-full bg-gray-300 dark:bg-gray-700"></div>
                    <span className="relative bg-background-light dark:bg-background-dark px-2 text-sm text-gray-500 dark:text-gray-400">Or continue with</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={handleGoogleSignUp}
                      disabled={isLoading}
                      className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                      <svg className="h-6 w-6" viewBox="0 0 48 48">
                        <g className="nc-icon-wrapper">
                          <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"></path>
                          <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"></path>
                          <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.657-11.303-8H6.306C9.656,35.663,16.318,40,24,40z" fill="#4CAF50"></path>
                          <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"></path>
                        </g>
                      </svg>
                    </button>
                    <button
                      onClick={handlePhoneSignUp}
                      disabled={isLoading}
                      className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-xl">phone_iphone</span>
                    </button>
                    <button
                      disabled={isLoading}
                      className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                    </button>
                  </div>
                </div>
                {/* Login Link */}
                <p className="font-display text-center text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link className="font-bold text-primary hover:underline" href="/login">
                    Log In
                  </Link>
                </p>
                {/* Legal/Policy Links */}
                <div className="mt-4 w-full border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
                  <p className="text-center font-display text-xs text-slate-500 dark:text-slate-400">
                    By continuing, you agree to our{' '}
                    <Link className="font-medium text-slate-600 underline hover:text-primary dark:text-slate-300 dark:hover:text-primary" href="/terms">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link className="font-medium text-slate-600 underline hover:text-primary dark:text-slate-300 dark:hover:text-primary" href="/privacy">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
                {message && (
                  <div className={`p-4 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

