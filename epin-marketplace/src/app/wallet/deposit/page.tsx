'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// We would create a server action for this, e.g., createDepositIntent

export default function DepositPage() {
  const [amount, setAmount] = useState(50.00);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDeposit = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // In a real app, you would call a server action here:
      // const result = await createDepositIntent(amount);
      // if (result.clientSecret) {
      //   // Use Stripe.js to confirm the payment
      // } else {
      //   setError(result.error);
      // }

      // For now, we'll simulate a successful deposit and redirect
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Successfully deposited $${amount}. Your wallet will be updated shortly.`);
      router.push('/wallet');

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Deposit Funds</h1>
      <div className="bg-gray-800 p-8 rounded-xl space-y-6">
        <div>
          <label htmlFor="amount" className="block text-lg font-medium mb-2">Amount (USD)</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-4 text-2xl font-bold"
            step="5"
          />
        </div>

        {/* Placeholder for payment method selection (e.g., Stripe Elements) */}
        <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <div className="bg-gray-700 p-4 rounded-md text-center text-gray-400">
                <p>Secure payment form (e.g., Stripe) would be integrated here.</p>
            </div>
        </div>

        {error && (
            <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>
        )}

        <button
          onClick={handleDeposit}
          disabled={isProcessing || amount <= 0}
          className="w-full py-4 bg-sky-600 rounded-md text-lg font-semibold hover:bg-sky-700 disabled:bg-gray-600 transition-colors"
        >
          {isProcessing ? 'Processing...' : `Deposit $${amount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
