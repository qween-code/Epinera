'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface RiskReview {
  id: string;
  userId: string;
  transactionId: string;
  riskScore: number;
  reason: string;
  timestamp: string;
  status: 'pending' | 'blocked' | 'cleared';
}

export default function AdminSecurityPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [riskReviews, setRiskReviews] = useState<RiskReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transaction' | 'account' | 'audit'>('overview');
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/admin/security');
          return;
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!profile || profile.role !== 'admin') {
          router.push('/');
          return;
        }

        // Fetch real security alerts
        const { data: realAlerts } = await supabase
          .from('security_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (realAlerts) {
          setAlerts(realAlerts.map(alert => ({
            id: alert.id,
            type: alert.type || 'info',
            title: alert.title,
            message: alert.message,
            timestamp: alert.created_at
          })));
        }

        // Fetch real risk reviews
        const { data: realReviews } = await supabase
          .from('risk_reviews')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (realReviews) {
          setRiskReviews(realReviews.map(review => ({
            id: review.id,
            userId: review.user_id, // Assuming column name is user_id
            transactionId: review.transaction_id, // Assuming column name is transaction_id
            riskScore: review.risk_score, // Assuming column name
            reason: review.reason,
            timestamp: review.created_at,
            status: review.status
          })));
        }


      } catch (error) {
        console.error('Error fetching security data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-[#E53E3E]';
      case 'warning':
        return 'text-[#D69E2E]';
      case 'info':
        return 'text-[#3182CE]';
      default:
        return 'text-gray-500';
    }
  };

  const getRiskScoreBadge = (score: number) => {
    if (score >= 80) {
      return 'bg-[#E53E3E]/20 text-[#E53E3E]';
    } else if (score >= 60) {
      return 'bg-[#D69E2E]/20 text-[#D69E2E]';
    } else {
      return 'bg-[#38A169]/20 text-[#38A169]';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-[#D69E2E]/20 text-[#D69E2E]' },
      blocked: { label: 'Blocked', className: 'bg-[#E53E3E]/20 text-[#E53E3E]' },
      cleared: { label: 'Cleared', className: 'bg-[#38A169]/20 text-[#38A169]' },
    };
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-500/20 text-gray-500' };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Page Heading */}
          <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Fraud & Security Center</h1>
          </header>

          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#2D3748] border border-white/10">
              <p className="text-gray-300 text-base font-medium leading-normal">Overall System Status</p>
              <p className="text-[#38A169] tracking-light text-3xl font-bold leading-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">verified_user</span> SECURE
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#2D3748] border border-white/10">
              <p className="text-gray-300 text-base font-medium leading-normal">Active Alerts</p>
              <p className="text-[#D69E2E] tracking-light text-3xl font-bold leading-tight">{alerts.length}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#2D3748] border border-white/10">
              <p className="text-gray-300 text-base font-medium leading-normal">Transactions Reviewed (24h)</p>
              <p className="text-white tracking-light text-3xl font-bold leading-tight">1,203</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#2D3748] border border-white/10">
              <p className="text-gray-300 text-base font-medium leading-normal">Accounts Flagged</p>
              <p className="text-[#E53E3E] tracking-light text-3xl font-bold leading-tight">12</p>
            </div>
          </section>

          {/* Tabs */}
          <nav className="mb-8">
            <div className="flex border-b border-[#2D3748]/50 gap-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${activeTab === 'overview'
                  ? 'border-b-[#3182CE] text-white'
                  : 'border-b-transparent text-gray-400 hover:text-white'
                  }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Overview</p>
              </button>
              <button
                onClick={() => setActiveTab('transaction')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${activeTab === 'transaction'
                  ? 'border-b-primary text-white'
                  : 'border-b-transparent text-gray-400 hover:text-white'
                  }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Transaction Fraud</p>
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${activeTab === 'account'
                  ? 'border-b-primary text-white'
                  : 'border-b-transparent text-gray-400 hover:text-white'
                  }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Account Security</p>
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${activeTab === 'audit'
                  ? 'border-b-primary text-white'
                  : 'border-b-transparent text-gray-400 hover:text-white'
                  }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Audit Logs</p>
              </button>
            </div>
          </nav>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Alerts & Charts */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Real-Time Alerts */}
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Real-Time Alerts</h2>
                <div className="bg-[#2D3748] rounded-xl border border-white/10">
                  <ul className="divide-y divide-white/10">
                    {alerts.map((alert) => (
                      <li key={alert.id} className="p-4 flex items-start gap-4 hover:bg-white/5 cursor-pointer">
                        <span className={`material-symbols-outlined mt-1 ${getAlertColor(alert.type)}`}>
                          {getAlertIcon(alert.type)}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-white">{alert.title}</p>
                            <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</p>
                          </div>
                          <p className="text-sm text-gray-300">{alert.message}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 border-t border-white/10 text-center">
                    <Link href="/admin/security/alerts" className="text-[#3182CE] text-sm font-semibold hover:underline">
                      View All Alerts
                    </Link>
                  </div>
                </div>
              </div>

              {/* Fraudulent Activity Trends */}
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Fraudulent Activity Trends</h2>
                <div className="bg-[#2D3748] rounded-xl p-6 border border-white/10">
                  <img
                    className="w-full h-64 object-contain invert-[.85] brightness-200"
                    alt="A line graph showing fraudulent activity trends over the last 30 days, with peaks and troughs indicating fluctuating risk levels."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPcKGWLvitq2hU1ZbKabrYsknbMIs3OOytMlF2EAcWetCDFiaGLofqcJfFpk8SJqNfBsZzDRkeqm6UR75PpMWUZr_9-BgadaxQv4_0L5bjHE25hfM1eia7jNML3MCam4LDHMszElL22_NlGhvksGEwwDRyJimRpHrL6-TaA809Lib2alA9GPggSI8BNTHVBOpDNLl3GOJ0J0AW_9PvlViXxUXgJWexZXYFLEpMWN4moiy6T4dQaOmORoYc8KBXUELoPYrgIWgRGvNd"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Map & Actions */}
            <div className="flex flex-col gap-8">
              {/* Top Flagged Regions */}
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Top Flagged Regions</h2>
                <div className="bg-[#2D3748] rounded-xl p-6 border border-white/10">
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    alt="A world map with red dots highlighting regions with high-risk activity, with the highest concentration in Eastern Europe and Southeast Asia."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5S1IPKAQYcNwOwaHFza-K0JgETkx9PHOwnlMVs_1hPcnomDNYuNSvTWYxtj0rcvcIeUuc2DdqROlv_OpbAvrIN1j6QnmjYNtmyRBV2kqVznzzPd6jnA7COa_SLwO0ARkFmRTravPOLvsW1KRUd2Lzri9hdCDmpRT643tj-Rvmwc5IloyOGiqhAacnWkijN1rfaMVCsxvVfqKV4Sjab2UazFaHibWd7Fo1Kjgn51zDlVH8-Mlm-2sR9Pv-Ae14Y6sIL9NsUoPCQNbJ"
                  />
                </div>
              </div>

              {/* Incident Response */}
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Incident Response</h2>
                <div className="bg-[#2D3748] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
                  <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-[#3182CE] hover:bg-[#3182CE]/80 transition-colors">
                    <span className="material-symbols-outlined text-white">block</span>
                    <span className="text-white font-semibold">Block User</span>
                  </button>
                  <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-[#D69E2E]/20 hover:bg-[#D69E2E]/30 transition-colors">
                    <span className="material-symbols-outlined text-[#D69E2E]">pause_circle</span>
                    <span className="text-[#D69E2E] font-semibold">Suspend Transaction</span>
                  </button>
                  <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined text-gray-300">task_alt</span>
                    <span className="text-gray-300 font-semibold">Initiate Verification</span>
                  </button>
                  <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined text-gray-300">flag</span>
                    <span className="text-gray-300 font-semibold">Report to Security Team</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Review Table */}
          <div className="mt-12">
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Risk Review Queue</h2>
            <div className="bg-[#2D3748] rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs text-gray-400 uppercase bg-black/20">
                    <tr>
                      <th className="px-6 py-3" scope="col">User ID</th>
                      <th className="px-6 py-3" scope="col">Transaction ID</th>
                      <th className="px-6 py-3" scope="col">Risk Score</th>
                      <th className="px-6 py-3" scope="col">Reason</th>
                      <th className="px-6 py-3" scope="col">Timestamp</th>
                      <th className="px-6 py-3" scope="col">Status</th>
                      <th className="px-6 py-3" scope="col"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskReviews.map((review) => (
                      <tr key={review.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-6 py-4 font-medium text-white">{review.userId}</td>
                        <td className="px-6 py-4">{review.transactionId}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold mr-2 px-2.5 py-0.5 rounded-full ${getRiskScoreBadge(review.riskScore)}`}>
                            {review.riskScore}
                          </span>
                        </td>
                        <td className="px-6 py-4">{review.reason}</td>
                        <td className="px-6 py-4">{review.timestamp}</td>
                        <td className="px-6 py-4">{getStatusBadge(review.status)}</td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/security/review/${review.id}`} className="font-medium text-[#3182CE] hover:underline">
                            {review.status === 'pending' ? 'Review' : 'Details'}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

