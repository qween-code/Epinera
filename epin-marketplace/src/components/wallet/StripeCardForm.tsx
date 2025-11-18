/**
 * Stripe Card Form Component
 * Uses Stripe Elements for secure card input
 * Supports test mode with test cards
 */

'use client';

import { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STRIPE_TEST_CARDS, isTestMode } from '@/lib/payment/stripe';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCardFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CardForm({ clientSecret, onSuccess, onError }: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [testMode] = useState(isTestMode());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err: any) {
      onError(err.message || 'An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {testMode && (
        <div className="rounded-lg bg-amber-900/20 border border-amber-500/50 p-4">
          <p className="text-amber-400 text-sm font-semibold mb-2">Test Mode Active</p>
          <p className="text-amber-300 text-xs mb-2">Use these test cards:</p>
          <div className="flex flex-col gap-1 text-xs text-amber-200">
            <div>Success: <code className="bg-amber-900/50 px-2 py-1 rounded">4242 4242 4242 4242</code></div>
            <div>Declined: <code className="bg-amber-900/50 px-2 py-1 rounded">4000 0000 0000 0002</code></div>
            <div>Any future expiry date, any CVC</div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 p-4">
        <CardElement options={cardElementOptions} />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold tracking-wide hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <span className="material-symbols-outlined animate-spin">sync</span>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">lock</span>
            <span>Complete Payment</span>
          </>
        )}
      </button>
    </form>
  );
}

export default function StripeCardForm({ clientSecret, onSuccess, onError }: StripeCardFormProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'night',
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CardForm clientSecret={clientSecret} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}

