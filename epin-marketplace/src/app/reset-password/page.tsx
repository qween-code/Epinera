'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if we have the necessary tokens from the reset link
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (!accessToken || type !== 'recovery') {
      setMessage('Invalid or expired reset link. Please request a new one.');
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
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
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');

    if (!accessToken) {
      setMessage('Error: Invalid reset link');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setIsLoading(false);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
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
                <h1 className="font-display text-5xl font-bold leading-tight">Reset Your Password</h1>
                <p className="font-display max-w-md text-lg text-white/80">Enter your new password to secure your account.</p>
              </div>
            </div>
            {/* Right Form Panel */}
            <div className="flex w-full flex-1 items-center justify-center p-6 sm:p-8 lg:w-1/2">
              <div className="flex w-full max-w-md flex-col gap-8 py-10">
                {/* Header */}
                <div className="flex flex-col gap-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-primary text-4xl">stadia_controller</span>
                    <span className="font-display text-2xl font-bold text-gray-900 dark:text-white">EpinMarket</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-display text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">Reset Password</p>
                    <p className="font-display text-base font-normal leading-normal text-gray-500 dark:text-gray-400">Enter your new password</p>
                  </div>
                </div>
                {/* Form */}
                <form className="flex w-full flex-col gap-4" onSubmit={handleResetPassword}>
                  {message && (
                    <div className={`p-4 rounded-lg text-sm ${message.includes('Error') || message.includes('Invalid') ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                      {message}
                    </div>
                  )}
                  {/* Password Input */}
                  <label className="flex flex-col flex-1">
                    <p className="font-display text-base font-medium leading-normal pb-2 text-gray-800 dark:text-gray-200">New Password</p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <div className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg border-r-0 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-l-none rounded-r-none border-x-0 text-base font-normal leading-normal"
                        placeholder="Enter your new password"
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
                    <p className="font-display text-base font-medium leading-normal pb-2 text-gray-800 dark:text-gray-200">Confirm New Password</p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <div className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg border-r-0 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-l-none rounded-r-none border-x-0 text-base font-normal leading-normal"
                        placeholder="Confirm your new password"
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
                  {/* Reset Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-14 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
                {/* Login Link */}
                <p className="font-display text-center text-sm text-gray-500 dark:text-gray-400">
                  Remember your password?{' '}
                  <Link className="font-bold text-primary hover:underline" href="/login">
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

