'use client';

import { useState } from 'react';

interface PromoCodeInputProps {
  onApply: (code: string) => Promise<void>;
}

export default function PromoCodeInput({ onApply }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsApplying(true);
    setMessage(null);

    try {
      await onApply(code.trim());
      setMessage({ type: 'success', text: 'Promo code applied successfully!' });
      setCode('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Invalid promo code' });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-black dark:text-white text-base font-medium leading-normal" htmlFor="promo-code">
        Have a promo code?
      </label>
      <div className="flex items-center gap-2">
        <input
          id="promo-code"
          type="text"
          className="form-input flex-grow w-full min-w-0 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/5 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApply();
            }
          }}
        />
        <button
          onClick={handleApply}
          disabled={isApplying || !code.trim()}
          className="flex-shrink-0 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-gray-200 dark:bg-white/10 text-black dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="truncate">{isApplying ? 'Applying...' : 'Apply'}</span>
        </button>
      </div>
      {message && (
        <p className={`text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

