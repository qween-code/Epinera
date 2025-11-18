'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface Dispute {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  status: 'action_required' | 'pending' | 'resolved';
  reason: string;
  created_at: string;
  updated_at: string;
  order?: any;
  buyer?: any;
}

interface DisputeMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: any;
}

export default function SellerDisputePage() {
  const router = useRouter();
  const params = useParams();
  const disputeId = params.id as string;
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [messages, setMessages] = useState<DisputeMessage[]>([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/seller/disputes/' + disputeId);
          return;
        }

        // Fetch all disputes for sidebar
        const { data: disputesData } = await supabase
          .from('disputes')
          .select(`
            *,
            order:orders(*),
            buyer:profiles!disputes_buyer_id_fkey(*)
          `)
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        setDisputes(disputesData || []);

        // Fetch specific dispute
        if (disputeId) {
          const { data: disputeData } = await supabase
            .from('disputes')
            .select(`
              *,
              order:orders(*),
              buyer:profiles!disputes_buyer_id_fkey(*)
            `)
            .eq('id', disputeId)
            .eq('seller_id', user.id)
            .single();

          if (disputeData) {
            setDispute(disputeData);

            // Fetch messages for this dispute
            const { data: messagesData } = await supabase
              .from('messages')
              .select(`
                *,
                sender:profiles!messages_sender_id_fkey(*)
              `)
              .eq('order_id', disputeData.order_id)
              .order('created_at', { ascending: true });

            setMessages(messagesData || []);
          }
        }
      } catch (error) {
        console.error('Error fetching dispute data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router, disputeId]);

  const handleSubmitResponse = async () => {
    if (!response.trim() || !dispute || !dispute.order_id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Send message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: dispute.buyer_id,
          order_id: dispute.order_id,
          content: response,
        });

      if (messageError) throw messageError;

      // Update dispute
      const { error: disputeError } = await supabase
        .from('disputes')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', dispute.id);

      if (disputeError) throw disputeError;

      setResponse('');
      // Refresh messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(*)')
        .eq('order_id', dispute.order_id)
        .order('created_at', { ascending: true });

      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const handleOfferRefund = async () => {
    if (!dispute) return;

    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          status: 'resolved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', dispute.id);

      if (error) throw error;

      // Process refund logic here
      alert('Refund offer sent to buyer');
      router.push('/seller/disputes');
    } catch (error) {
      console.error('Error offering refund:', error);
    }
  };

  const filteredDisputes = disputes.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (searchQuery && !d.id.toLowerCase().includes(searchQuery.toLowerCase()) && !d.buyer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      action_required: { text: 'Action Required', className: 'text-status-action' },
      pending: { text: 'Pending', className: 'text-status-pending' },
      resolved: { text: 'Resolved', className: 'text-status-resolved' },
    };
    return statusMap[status] || { text: status, className: '' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-light dark:text-text-dark">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      <div className="relative flex h-auto min-h-screen w-full flex-col">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-6 py-3 bg-surface-light dark:bg-surface-dark sticky top-0 z-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-text-light dark:text-text-dark">
              <div className="size-6 text-primary">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
            </div>
          </div>
          <div className="flex flex-1 justify-center px-8">
            <nav className="flex items-center gap-9">
              <Link className="text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark text-sm font-medium leading-normal" href="/seller/dashboard">
                Dashboard
              </Link>
              <Link className="text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark text-sm font-medium leading-normal" href="/seller/products">
                Listings
              </Link>
              <Link className="text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark text-sm font-medium leading-normal" href="/seller/orders">
                Orders
              </Link>
              <Link className="text-primary text-sm font-bold leading-normal" href="/seller/disputes">
                Disputes
              </Link>
              <Link className="text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark text-sm font-medium leading-normal" href="/seller/wallet">
                Wallet
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-background-light dark:bg-background-dark text-subtext-light dark:text-subtext-dark hover:bg-border-light dark:hover:bg-border-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
            </Link>
            <Link
              href="/seller/settings"
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-background-light dark:bg-background-dark text-subtext-light dark:text-subtext-dark hover:bg-border-light dark:hover:bg-border-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <span className="material-symbols-outlined text-xl">settings</span>
            </Link>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="User profile picture"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3Q8VfEbfXsUtYs3m9crio_CN-iJdGWFTUfaWjsmVWHllC_wk9n1VDDqP6n1V18MW3ipO14OHnDMIXC0IcCXnpfe-fjGn3Z3v8AoCyzC7V6XWhoDT8-NYDzxNXocWYsP4TJvFu-7DF9whzmYLwJX7c8qif2w3vQIQTY3Hxn65h-U50qWAUiob8c2_1hNa4-TQPBkJEix4_4GuTNdnIZyNPP_z3jAJG8V3CLSHQDYszfavd1wSjQQsP94mN78JvBvTWPzvuj4eTiwAV")',
              }}
            />
          </div>
        </header>
        <div className="flex flex-1">
          {/* Left Column: Disputes List */}
          <aside className="w-96 min-w-96 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col">
            <div className="p-4 border-b border-border-light dark:border-border-dark">
              <h1 className="text-xl font-bold">Dispute Management</h1>
              <p className="text-sm text-subtext-light dark:text-subtext-dark">Manage your cases</p>
            </div>
            <div className="p-4 space-y-4">
              <label className="flex flex-col w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-10 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <div className="text-subtext-light dark:text-subtext-dark flex items-center justify-center pl-3">
                    <span className="material-symbols-outlined text-xl">search</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-subtext-light dark:placeholder:text-subtext-dark pl-2 text-sm font-normal leading-normal"
                    placeholder="Search by ID, buyer, product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
              <div className="flex gap-2">
                <select
                  className="form-select w-full rounded-lg h-10 text-sm bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-text-light dark:text-text-dark focus:border-primary focus:ring-primary/20"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Status: All</option>
                  <option value="action_required">Action Required</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select className="form-select w-full rounded-lg h-10 text-sm bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-text-light dark:text-text-dark focus:border-primary focus:ring-primary/20">
                  <option>Sort: Newest</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1 px-2 overflow-y-auto flex-1">
              {filteredDisputes.map((d) => {
                const statusBadge = getStatusBadge(d.status);
                return (
                  <Link
                    key={d.id}
                    href={`/seller/disputes/${d.id}`}
                    className={`flex flex-col gap-1 p-2 rounded-lg ${
                      d.id === disputeId
                        ? 'bg-primary/10 dark:bg-primary/20 border-l-4 border-primary'
                        : 'hover:bg-background-light dark:hover:bg-background-dark'
                    } cursor-pointer`}
                  >
                    <div className="flex justify-between items-center">
                      <p className={`text-sm ${d.id === disputeId ? 'font-bold' : 'font-medium'} text-text-light dark:text-text-dark`}>
                        Dispute #{d.id.slice(-4)}
                      </p>
                      <span className={`text-xs ${statusBadge.className} font-semibold`}>{statusBadge.text}</span>
                    </div>
                    <p className="text-sm text-subtext-light dark:text-subtext-dark">Buyer: {d.buyer?.full_name || 'Unknown'}</p>
                    <p className="text-xs text-subtext-light dark:text-subtext-dark">
                      {d.status === 'resolved' ? 'Closed' : 'Opened'}: {format(new Date(d.created_at), 'MMM d, yyyy')}
                    </p>
                  </Link>
                );
              })}
            </div>
          </aside>
          {/* Right Column: Dispute Details */}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {dispute ? (
              <div className="max-w-4xl mx-auto">
                {/* Page Heading */}
                <div className="flex flex-wrap justify-between gap-3 pb-4 border-b border-border-light dark:border-border-dark">
                  <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                    Dispute Details: #{dispute.id.slice(-4)}
                  </p>
                </div>
                {/* Chips/Status Header */}
                <div className="flex gap-3 py-4 overflow-x-auto">
                  <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-status-action/10 px-4">
                    <p className="text-sm font-medium leading-normal text-status-action">Status: {getStatusBadge(dispute.status).text}</p>
                  </div>
                  <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-background-light dark:bg-surface-dark px-4">
                    <p className="text-subtext-light dark:text-subtext-dark text-sm font-medium leading-normal">
                      Opened: {format(new Date(dispute.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-background-light dark:bg-surface-dark px-4">
                    <p className="text-subtext-light dark:text-subtext-dark text-sm font-medium leading-normal">
                      Respond by: {format(new Date(new Date(dispute.created_at).getTime() + 7 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                {/* Dispute Summary */}
                <div className="p-4 @container rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <div className="flex flex-col items-stretch justify-start">
                    <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1">
                      <p className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">Dispute Summary</p>
                      <div className="flex items-end gap-3 justify-between">
                        <div className="flex flex-col gap-1">
                          <p className="text-subtext-light dark:text-subtext-dark text-base font-normal leading-normal">
                            Buyer '{dispute.buyer?.full_name || 'Unknown'}' claims: {(dispute as any).buyer_claim || dispute.reason || 'N/A'}
                          </p>
                          <p className="text-subtext-light dark:text-subtext-dark text-base font-normal leading-normal">
                            Order ID: #{dispute.order_id?.slice(-5) || 'N/A'}, Product: {dispute.order?.product_title || 'N/A'}, Price: ${dispute.order?.total_amount || '0.00'}
                          </p>
                        </div>
                        <Link
                          href={`/seller/orders/${dispute.order_id}`}
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary/20 text-primary hover:bg-primary/30 text-sm font-medium leading-normal"
                        >
                          <span className="truncate">View Order Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Communication Timeline & Response Form */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Communication Timeline */}
                    <div className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                      <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">Communication History</h3>
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex items-start gap-3 ${message.sender_id === dispute.seller_id ? 'justify-end' : ''}`}
                          >
                            {message.sender_id !== dispute.seller_id && (
                              <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                                data-alt="Buyer avatar"
                                style={{
                                  backgroundImage: message.sender?.avatar_url
                                    ? `url('${message.sender.avatar_url}')`
                                    : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdfTbsqis2Grh4p5JAgKL5xowNsOQW0jCUE08QiVapNche9MYuRcls-7dkZVmfk5ET1vg8uNBqhaQAbZ8_QYOP0Fuwu9QTrIU6-4c5jpz_KbSlzg03c01C3A8LMYrYhlxjRBgqA873IvjUi_1MBuEV4Uw-f5TiwHL7PxDuUmId8NQ8qCjJPqSBxnA3hpn-dUe4i3ZFcfhX8GAwal8Ban3Zo8bmNORkOcrLiPagF6ShZdv9efRoEBwHJ70gBm0Holz3tDtKszXc4G1R")',
                                }}
                              />
                            )}
                            <div className={message.sender_id === dispute.seller_id ? 'text-right' : ''}>
                              <div
                                className={`p-3 rounded-lg ${
                                  message.sender_id === dispute.seller_id
                                    ? 'bg-primary/20'
                                    : 'bg-background-light dark:bg-background-dark'
                                }`}
                              >
                                <p className="text-sm font-bold">{message.sender?.full_name || 'Unknown'}</p>
                                <p className="text-sm text-subtext-light dark:text-subtext-dark mt-1">{message.content}</p>
                              </div>
                              <span className={`text-xs text-subtext-light dark:text-subtext-dark ${message.sender_id === dispute.seller_id ? 'mr-3' : 'ml-3'} mt-1`}>
                                {format(new Date(message.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                            {message.sender_id === dispute.seller_id && (
                              <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                                data-alt="Seller avatar"
                                style={{
                                  backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNS4kzHUqy0GW87ckYA5CaNzQi_1CzF3lzVhZEtbR7DeIJHbJwNKKCZNIXH7YBXgxqyTHwSmbr52HW9pwCGlyXkY7nptUDlkg-YDvstBFhV-8XlbDDp-J14-G9rDCM1V1D4Z0ZCF1hMmqM4OHvguEfLokgaJMPtIbKnPEf4Ofx395F5OpGJTcFFSQ3Rx5EBlPdJeq6aNPwrj5SzLXOvRpFP0SFvb8o7koWvOsTdw2iWoK1Ioyt79aJ5WAAG2SYnl6npuwxaOVRyCQW")',
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Action Form */}
                    <div className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                      <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">Your Response</h3>
                      <div className="space-y-4">
                        <textarea
                          className="form-textarea w-full rounded-lg bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-sm text-text-light dark:text-text-dark focus:border-primary focus:ring-primary/20"
                          placeholder="Provide a detailed explanation of your side of the story..."
                          rows={5}
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                        />
                        <div>
                          <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">Attach Evidence</label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-light dark:border-border-dark border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                              <span className="material-symbols-outlined text-4xl text-subtext-light dark:text-subtext-dark">upload_file</span>
                              <div className="flex text-sm text-subtext-light dark:text-subtext-dark">
                                <p className="pl-1">
                                  Drag and drop files or <span className="font-medium text-primary cursor-pointer">browse</span>
                                </p>
                              </div>
                              <p className="text-xs text-subtext-light dark:text-subtext-dark">PNG, JPG, PDF up to 10MB</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            onClick={handleOfferRefund}
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 text-primary hover:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em]"
                          >
                            <span className="truncate">Offer Refund</span>
                          </button>
                          <button
                            onClick={handleSubmitResponse}
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary/90 text-sm font-bold leading-normal tracking-[0.015em]"
                          >
                            <span className="truncate">Submit Response</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* AI Insights Widget */}
                  <div className="lg:col-span-1">
                    <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20 sticky top-24">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-secondary">psychology</span>
                        <h4 className="font-bold text-secondary">AI-Powered Insights</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-text-light dark:text-text-dark">Summary</p>
                          <p className="text-sm text-subtext-light dark:text-subtext-dark">
                            Buyer claims {(dispute as any).buyer_claim || dispute.reason || 'N/A'}. {messages.length > 0 ? 'You have responded acknowledging the issue.' : 'No response yet.'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-light dark:text-text-dark">Suggested Next Step</p>
                          <p className="text-sm text-subtext-light dark:text-subtext-dark">
                            Provide proof of code validity at the time of sale (e.g., screenshot from your supplier's portal) to strengthen your case.
                          </p>
                        </div>
                        <button className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-secondary text-white hover:bg-secondary/90 text-sm font-medium">
                          <span className="truncate">Escalate to Admin</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-text-light dark:text-text-dark">Select a dispute from the sidebar</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

