'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4 font-heading">HATA</h1>
          <div className="text-xl text-cyan mb-2">Bir şeyler ters gitti</div>
          <p className="text-gray-400 mb-8">
            Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
          </p>
          {error.message && (
            <div className="neo-inset-sm rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-red-400 font-mono">{error.message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn btn-primary">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Tekrar Dene
          </button>
          <Link href="/" className="btn btn-ghost">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
