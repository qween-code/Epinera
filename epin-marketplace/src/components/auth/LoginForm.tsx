'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      // Check for redirect parameter
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect') || '/';
      router.push(redirect);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handlePhoneLogin = () => {
    router.push('/login?method=phone');
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-8 py-10">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-primary text-4xl">stadia_controller</span>
          <span className="font-display text-2xl font-bold text-gray-900 dark:text-white">EpinMarket</span>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="font-display text-base font-normal leading-normal text-gray-500 dark:text-gray-400">Log In to Your Account</p>
        </div>
      </div>

      {/* Form */}
      <form className="flex w-full flex-col gap-4" onSubmit={handleLogin}>
        {/* Email or Phone Input */}
        <label className="flex flex-col flex-1">
          <p className="font-display text-base font-medium leading-normal pb-2 text-gray-800 dark:text-gray-200">Email or Phone Number</p>
          <div className="flex w-full flex-1 items-stretch rounded-lg">
            <div className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg border-r-0 text-gray-400 dark:text-gray-500">
              <span className="material-symbols-outlined">person</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-l-none border-l-0 text-base font-normal leading-normal"
              placeholder="Enter your email or phone"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </label>

        {/* Password Input */}
        <div className="flex flex-col gap-2">
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
          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="font-display text-sm font-normal leading-normal text-right text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-14 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Login'}
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
            onClick={handleGoogleLogin}
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
            onClick={handlePhoneLogin}
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

      {/* Sign Up Link */}
      <p className="font-display text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{' '}
        <Link className="font-bold text-primary hover:underline" href="/signup">
          Sign Up
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
  );
}

