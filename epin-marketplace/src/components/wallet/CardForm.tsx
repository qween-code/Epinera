'use client';

import { useState } from 'react';

interface CardFormProps {
  onSubmit?: (cardData: { number: string; expiry: string; cvc: string }) => void;
}

export default function CardForm({ onSubmit }: CardFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + ' / ' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex flex-col flex-1">
          <p className="text-black dark:text-white text-sm font-medium leading-normal pb-2">Card Number</p>
          <div className="relative flex items-center">
            <input
              type="text"
              className="form-input w-full rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/5 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
            <span className="material-symbols-outlined absolute right-3 text-gray-400 dark:text-gray-500">credit_card</span>
          </div>
        </label>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex flex-col flex-1">
          <p className="text-black dark:text-white text-sm font-medium leading-normal pb-2">Expiration Date</p>
          <input
            type="text"
            className="form-input w-full rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/5 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            maxLength={7}
          />
        </label>
        <label className="flex flex-col flex-1">
          <p className="text-black dark:text-white text-sm font-medium leading-normal pb-2">CVC</p>
          <div className="relative flex items-center">
            <input
              type="text"
              className="form-input w-full rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/5 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
              maxLength={4}
            />
            <span className="material-symbols-outlined absolute right-3 text-gray-400 dark:text-gray-500">lock</span>
          </div>
        </label>
      </div>
    </div>
  );
}

