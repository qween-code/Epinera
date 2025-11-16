'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Registration successful! Please check your email to confirm your account.');
      // router.push('/'); // Or redirect to a "please verify" page
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center">Create an Account</h1>
        {success ? (
          <p className="text-green-400 bg-green-900/50 p-4 rounded-md">{success}</p>
        ) : (
            <>
                <form onSubmit={handleRegister} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                    <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                    <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                    />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 rounded-md font-semibold transition-colors">
                    Sign Up
                </button>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-gray-400">Or sign up with</span>
                    </div>
                </div>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                    Sign up with Google
                </button>
            </>
        )}
      </div>
    </div>
  );
}
