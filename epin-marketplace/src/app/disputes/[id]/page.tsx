'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';

interface Dispute {
  id: string;
  order_id: string;
  dispute_type: string;
  status: string;
  buyer_claim: string;
  seller_response?: string;
  evidence?: string[];
  created_at: string;
  order?: {
    id: string;
    product_title: string;
    total_amount: number;
    currency: string;
  };
}

export default function DisputePage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = params.id as string;
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchDispute = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/disputes/' + disputeId);
          return;
        }

        const { data: disputeData, error } = await supabase
          .from('disputes')
          .select(
            `
            *,
            order:orders (
              id,
              total_amount,
              currency
            )
          `
          )
          .eq('id', disputeId)
          .single();

        if (error || !disputeData) {
          console.error('Error fetching dispute:', error);
          return;
        }

        // Fetch product info from order
        const { data: orderData } = await supabase
          .from('orders')
          .select(
            `
            id,
            product:products (
              title
            )
          `
          )
          .eq('id', disputeData.order_id)
          .single();

        setDispute({
          ...disputeData,
          order: {
            id: disputeData.order_id,
            product_title: orderData?.product?.title || 'Unknown Product',
            total_amount: parseFloat(disputeData.order?.total_amount?.toString() || '0'),
            currency: disputeData.order?.currency || 'USD',
          },
        });
      } catch (error) {
        console.error('Error fetching dispute:', error);
      } finally {
        setLoading(false);
      }
    };

    if (disputeId) {
      fetchDispute();
    }
  }, [disputeId, supabase, router]);

  const handleSubmitResponse = async () => {
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          buyer_claim: dispute?.buyer_claim ? `${dispute.buyer_claim}\n\n${message}` : message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', disputeId);

      if (error) throw error;

      setMessage('');
      // Refresh dispute data
      window.location.reload();
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-white">
        <Header />
        <main className="flex-grow flex">
          <div className="flex-1 p-8">
            <div className="text-center text-gray-400">Loading dispute...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-white">
        <Header />
        <main className="flex-grow flex">
          <div className="flex-1 p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Dispute Not Found</h1>
              <Link href="/orders" className="text-primary hover:underline">
                Back to Orders
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'under_review':
        return 'bg-blue-500/20 text-blue-500';
      case 'resolved_buyer':
        return 'bg-green-500/20 text-green-500';
      case 'resolved_seller':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-white">
      <Header />
      <main className="flex-grow flex">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-white/10 p-4 hidden md:flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")',
                }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-white text-base font-medium leading-normal">Gamer Ali</h1>
                <p className="text-slate-400 text-sm font-normal leading-normal">ali@gamer.com</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 mt-4">
              <Link
                href="/wallet"
                className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                  dashboard
                </span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                  history
                </span>
                <p className="text-sm font-medium leading-normal">Order History</p>
              </Link>
              <Link
                href="/disputes"
                className="flex items-center gap-3 px-3 py-2 bg-primary/20 text-white rounded"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                  gavel
                </span>
                <p className="text-sm font-medium leading-normal">Disputes</p>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">Dispute Resolution</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(dispute.status)}`}>
                  {dispute.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-slate-400">Order #{dispute.order_id.substring(0, 8)}</p>
            </div>

            {/* Order Info Card */}
            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Product:</span>
                  <span className="text-white font-medium">{dispute.order?.product_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-white font-medium">
                    {dispute.order?.total_amount?.toFixed(2)} {dispute.order?.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dispute Type:</span>
                  <span className="text-white font-medium">{dispute.dispute_type.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Buyer Claim */}
            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Your Claim</h2>
              <p className="text-slate-300 whitespace-pre-wrap">{dispute.buyer_claim || 'No claim submitted yet.'}</p>
            </div>

            {/* Seller Response */}
            {dispute.seller_response && (
              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Seller Response</h2>
                <p className="text-slate-300 whitespace-pre-wrap">{dispute.seller_response}</p>
              </div>
            )}

            {/* Evidence */}
            {dispute.evidence && dispute.evidence.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Evidence</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {dispute.evidence.map((url, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-white/10">
                      <img src={url} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Response */}
            {dispute.status === 'open' && (
              <div className="bg-white/5 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Add Additional Information</h2>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide additional details or evidence..."
                  className="w-full h-32 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSubmitResponse}
                  disabled={submitting || !message.trim()}
                  className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Response'}
                </button>
              </div>
            )}

            {/* Resolution Info */}
            {dispute.status !== 'open' && (
              <div className="bg-white/5 rounded-xl p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Resolution</h2>
                <p className="text-slate-300">
                  This dispute has been {dispute.status.replace('_', ' ')}. If you have any questions, please contact
                  support.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

