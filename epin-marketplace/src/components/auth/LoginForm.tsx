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

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', user.id)
          .single();

        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');

        if (redirect) {
          router.push(redirect);
        } else if (!profile || !profile.full_name || !profile.avatar_url) {
          router.push('/complete-profile');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/');
      }
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotLoading(true);
    setForgotMessage('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsForgotLoading(false);
    if (error) {
      setForgotMessage('Error: ' + error.message);
    } else {
      setForgotMessage('Password reset link sent! Check your email.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotMessage('');
        setForgotEmail('');
      }, 3000);
    }
  };

  return (
    <>
      <div className="flex w-full max-w-[400px] flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00A3FF] text-3xl">stadia_controller</span>
            <span className="font-display text-xl font-bold text-white">EpinMarket</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-sm text-gray-400">Log In to Your Account</p>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <div className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 ml-1" htmlFor="email">Email or Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-[#00A3FF] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  id="email"
                  className="block h-12 w-full rounded-xl border border-gray-800 bg-[#13161C] pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-[#00A3FF] focus:outline-none focus:ring-1 focus:ring-[#00A3FF] transition-all"
                  placeholder="Enter your email or phone"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 ml-1" htmlFor="password">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-[#00A3FF] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  className="block h-12 w-full rounded-xl border border-gray-800 bg-[#13161C] pl-10 pr-10 text-sm text-white placeholder:text-gray-600 focus:border-[#00A3FF] focus:outline-none focus:ring-1 focus:ring-[#00A3FF] transition-all"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-medium text-[#00A3FF] hover:text-[#00A3FF]/80 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#00A3FF] text-sm font-bold text-white transition-all hover:bg-[#0088FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.3)] disabled:opacity-50 disabled:hover:shadow-none"
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-800" />
          </div>
          <span className="relative bg-[#0B0E14] px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Or continue with</span>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleGoogleLogin}
            type="button"
            disabled={isLoading}
            className="flex h-12 items-center justify-center rounded-xl border border-gray-800 bg-[#13161C] transition-all hover:border-gray-700 hover:bg-[#1A1D24]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="flex h-12 items-center justify-center rounded-xl border border-gray-800 bg-[#13161C] transition-all hover:border-gray-700 hover:bg-[#1A1D24]"
          >
            <svg className="h-5 w-5 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.885-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8254-.6184 1.2525a17.2963 17.2963 0 00-5.4856 0c-.172-.4271-.4074-.8772-.6184-1.2525a.0741.0741 0 00-.0785-.0371 19.7913 19.7913 0 00-4.885 1.5152.069.069 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0321.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8781-1.2982 1.229-2.0112a.0741.0741 0 00-.041-.1064 13.0784 13.0784 0 01-1.8724-.8911.0741.0741 0 01-.0076-.1277c.0381-.0561.102-.1121.1735-.1682a.0741.0741 0 01.0709-.0112c3.4389 1.4113 7.4654 1.4113 10.8928 0a.0741.0741 0 01.071.0112c.0715.0561.1354.1121.1735.1682a.0741.0741 0 01-.0076.1277 13.0861 13.0861 0 01-1.8724.8911.0741.0741 0 00-.041.1064c.3508.713.7674 1.3808 1.229 2.0112a.0777.0777 0 00.0842.0276c1.9516-.6067 3.9401-1.5218 5.9929-3.0294a.0824.0824 0 00.0321-.0561c.5004-5.284-.833-9.68-.833-9.68a.069.069 0 00-.0321-.0277zM8.0203 15.6269c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9744-2.419 2.1569-2.419s2.1569 1.0857 2.1569 2.419c.0001 1.3333-.9744 2.419-2.1569 2.419zm7.9592 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9744-2.419 2.1569-2.419s2.1569 1.0857 2.1569 2.419c0 1.3333-.9743 2.419-2.1569 2.419z"></path>
            </svg>
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="flex h-12 items-center justify-center rounded-xl border border-gray-800 bg-[#13161C] transition-all hover:border-gray-700 hover:bg-[#1A1D24]"
          >
            <span className="material-symbols-outlined text-xl text-white">account_balance_wallet</span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-[#00A3FF] hover:text-[#00A3FF]/80 transition-colors">
            Sign up
          </Link>
        </p>

        {message && (
          <div className={`rounded-xl p-4 text-center text-sm font-medium ${message.includes('Error') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
            {message}
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#13161C] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Reset Password</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 ml-1" htmlFor="forgot-email">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-[#00A3FF] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">email</span>
                  </div>
                  <input
                    id="forgot-email"
                    className="block h-12 w-full rounded-xl border border-gray-800 bg-[#0B0E14] pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-[#00A3FF] focus:outline-none focus:ring-1 focus:ring-[#00A3FF] transition-all"
                    placeholder="name@example.com"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={isForgotLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isForgotLoading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#00A3FF] text-sm font-bold text-white transition-all hover:bg-[#0088FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.3)] disabled:opacity-50"
              >
                {isForgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            {forgotMessage && (
              <div className={`mt-4 rounded-xl p-3 text-center text-sm font-medium ${forgotMessage.includes('Error') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                {forgotMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
