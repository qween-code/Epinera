'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function LoginForm() {
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
      window.location.href = redirect;
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
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
          <p className="font-display text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">Welcome Back</p>
          <p className="font-display text-base font-normal leading-normal text-gray-500 dark:text-gray-400">Log In to Your Account</p>
        </div>
      </div>
      {/* Form */}
      <form className="flex w-full flex-col gap-4" onSubmit={handleLogin}>
        {/* Email/Phone Input */}
        <label className="flex flex-col flex-1">
          <p className="font-display text-base font-medium leading-normal pb-2 text-gray-800 dark:text-gray-200">Email or Phone Number</p>
          <div className="flex w-full flex-1 items-stretch rounded-lg">
            <div className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg border-r-0 text-gray-400 dark:text-gray-500">
              <span className="material-symbols-outlined">person</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-l-none border-l-0 text-base font-normal leading-normal"
              placeholder="Enter your email or phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
          <Link className="font-display text-sm font-normal leading-normal text-right text-primary hover:underline" href="/forgot-password">
            Forgot Password?
          </Link>
        </div>
        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-14 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark disabled:opacity-50"
        >
          Login
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
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            <svg className="h-6 w-6 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.885-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8254-.6184 1.2525a17.2963 17.2963 0 00-5.4856 0c-.172-.4271-.4074-.8772-.6184-1.2525a.0741.0741 0 00-.0785-.0371 19.7913 19.7913 0 00-4.885 1.5152.069.069 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0321.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8781-1.2982 1.229-2.0112a.0741.0741 0 00-.041-.1064 13.0784 13.0784 0 01-1.8724-.8911.0741.0741 0 01-.0076-.1277c.0381-.0561.102-.1121.1735-.1682a.0741.0741 0 01.0709-.0112c3.4389 1.4113 7.4654 1.4113 10.8928 0a.0741.0741 0 01.071.0112c.0715.0561.1354.1121.1735.1682a.0741.0741 0 01-.0076.1277 13.0861 13.0861 0 01-1.8724.8911.0741.0741 0 00-.041.1064c.3508.713.7674 1.3808 1.229 2.0112a.0777.0777 0 00.0842.0276c1.9516-.6067 3.9401-1.5218 5.9929-3.0294a.0824.0824 0 00.0321-.0561c.5004-5.284-.833-9.68-.833-9.68a.069.069 0 00-.0321-.0277zM8.0203 15.6269c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9744-2.419 2.1569-2.419s2.1569 1.0857 2.1569 2.419c.0001 1.3333-.9744 2.419-2.1569 2.419zm7.9592 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9744-2.419 2.1569-2.419s2.1569 1.0857 2.1569 2.419c0 1.3333-.9743 2.419-2.1569 2.419z"></path>
            </svg>
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
      {message && (
        <div className="text-center text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{message}</div>
      )}
    </div>
  );
}

