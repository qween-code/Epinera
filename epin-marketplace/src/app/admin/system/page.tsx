'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  name: string;
  status: 'unacknowledged' | 'acknowledged' | 'resolved';
}

export default function AdminSystemPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'all' | '24h' | '7d' | '30d' | 'custom'>('24h');
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/admin/system');
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

        // Fetch real system alerts
        const { data: realAlerts } = await supabase
          .from('system_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (realAlerts) {
          setAlerts(realAlerts.map(alert => ({
            id: alert.id,
            severity: alert.severity,
            timestamp: alert.created_at,
            name: alert.name,
            status: alert.status
          })));
        }
      } catch (error) {
        console.error('Error fetching system data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router, timeRange]);

  const getSeverityBadge = (severity: string) => {
    const severityMap: Record<string, { label: string; className: string }> = {
      critical: { label: 'Critical', className: 'bg-red-500/20 text-red-400' },
      warning: { label: 'Warning', className: 'bg-yellow-500/20 text-yellow-400' },
      info: { label: 'Info', className: 'bg-blue-500/20 text-blue-400' },
    };
    const severityInfo = severityMap[severity] || { label: severity, className: 'bg-gray-500/20 text-gray-400' };
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${severityInfo.className}`}>
        {severityInfo.label}
      </span>
    );
  };

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const infoCount = alerts.filter((a) => a.severity === 'info').length;

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* TopNavBar */}
        <header className="flex shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-[#101d23] px-6 lg:px-10 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-4 text-white">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Configure Alerts</span>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#223d49] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#223d49] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="Admin profile picture"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBr7V5VnWzfV0_nfWuAzbWJv2RfArI758j2DQNsndab-nFaoTw8Hx7AhawOXnVVw2RK3cS6vqOtYugsfwOqO_W8x596zK7Obex2vqr8M3heTvj0kR_qQojxu5CROG1RhIL_xW0UQhVkYeghAnXm87i3OQPhJ_T2rpW0gvadAYQdIb_VCgnU1gd4ps5SPdfzm00WbVijXyUJigaLrTBD5d4x9irGTu-LpPE_waaT0J0MNh3bDyHLqzafddFUlXnPa5wh-dVi6B7qIsI0")',
              }}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            {/* PageHeading */}
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">System Monitoring & Alerts</p>
              <p className="text-[#90b8cb] text-base font-normal leading-normal">Real-time infrastructure, application, and business metrics.</p>
            </div>
            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTimeRange('all')}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal ${timeRange === 'all' ? 'bg-primary/20 text-primary' : 'bg-[#223d49] text-white hover:bg-primary/30'
                  }`}
              >
                All Time
              </button>
              <button
                onClick={() => setTimeRange('24h')}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal ${timeRange === '24h' ? 'bg-primary/20 text-primary' : 'bg-[#223d49] text-white hover:bg-primary/30'
                  }`}
              >
                Last 24h
              </button>
              <button
                onClick={() => setTimeRange('7d')}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal ${timeRange === '7d' ? 'bg-primary/20 text-primary' : 'bg-[#223d49] text-white hover:bg-primary/30'
                  }`}
              >
                Last 7d
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal ${timeRange === '30d' ? 'bg-primary/20 text-primary' : 'bg-[#223d49] text-white hover:bg-primary/30'
                  }`}
              >
                Last 30d
              </button>
              <button
                onClick={() => setTimeRange('custom')}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium leading-normal ${timeRange === 'custom' ? 'bg-primary/20 text-primary' : 'bg-[#223d49] text-white hover:bg-primary/30'
                  }`}
              >
                Custom Range
              </button>
            </div>
          </div>

          {/* Section 1: Real-time Alerts Overview */}
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#ef4444]/50 bg-[#ef4444]/10">
              <p className="text-red-400 text-base font-medium leading-normal">Critical Alerts</p>
              <p className="text-white tracking-light text-4xl font-bold leading-tight">{criticalCount}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#f59e0b]/50 bg-[#f59e0b]/10">
              <p className="text-yellow-400 text-base font-medium leading-normal">Warning Alerts</p>
              <p className="text-white tracking-light text-4xl font-bold leading-tight">{warningCount}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#3b82f6]/50 bg-[#3b82f6]/10">
              <p className="text-blue-400 text-base font-medium leading-normal">Info Alerts</p>
              <p className="text-white tracking-light text-4xl font-bold leading-tight">{infoCount}</p>
            </div>
          </div>

          {/* Alerts Table */}
          <div className="bg-[#1a2c35] rounded-xl border border-white/10 p-6 mb-10">
            <h3 className="text-xl font-bold text-white mb-4">Active Alerts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#90b8cb]">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Alert Name</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-gray-400">
                        Loading alerts...
                      </td>
                    </tr>
                  ) : alerts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-gray-400">
                        No alerts found
                      </td>
                    </tr>
                  ) : (
                    alerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-white/10">
                        <td className="p-3">{getSeverityBadge(alert.severity)}</td>
                        <td className="p-3">{alert.timestamp}</td>
                        <td className="p-3 text-white">{alert.name}</td>
                        <td className="p-3">{alert.status}</td>
                        <td className="p-3 text-right">
                          <button className="text-primary hover:underline">View Details</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2, 3, 4: Dashboards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Infrastructure Health */}
            <div className="bg-[#1a2c35] rounded-xl border border-white/10 p-6 col-span-1 lg:col-span-2 xl:col-span-3">
              <h3 className="text-xl font-bold text-white mb-4">Infrastructure Health</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2 rounded-lg p-4 bg-[#101c22]">
                  <p className="text-[#90b8cb] text-sm">Server CPU</p>
                  <p className="text-green-400 text-3xl font-bold">42%</p>
                </div>
                <div className="flex flex-col gap-2 rounded-lg p-4 bg-[#101c22]">
                  <p className="text-[#90b8cb] text-sm">Memory Usage</p>
                  <p className="text-green-400 text-3xl font-bold">58%</p>
                </div>
                <div className="flex flex-col gap-2 rounded-lg p-4 bg-[#101c22]">
                  <p className="text-[#90b8cb] text-sm">Network Latency</p>
                  <p className="text-white text-3xl font-bold">32ms</p>
                </div>
                <div className="flex flex-col gap-2 rounded-lg p-4 bg-[#101c22]">
                  <p className="text-[#90b8cb] text-sm">DB Connections</p>
                  <p className="text-white text-3xl font-bold">128/200</p>
                </div>
              </div>
            </div>

            {/* Application Performance */}
            <div className="bg-[#1a2c35] rounded-xl border border-white/10 p-6 col-span-1 lg:col-span-1 xl:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">Application Performance</h3>
              <div data-alt="A line chart showing API response times over the last 24 hours, with a peak around midday.">
                <img
                  alt="API Response Time Chart"
                  className="w-full h-64 object-cover rounded-lg"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDpDQZfgQ0ZxqLuY3NhaTqfQCgqY2VLfJ-J5Yp1yEH6kgLmVhIXGskYFJsDyByyI9_S6wJ5dELZ-K-f2qmZlYQ5U2bPxcCW07V0mb4mEV31TzmofVa3e69OiDeALFLTiQ8d9zVT8XTX7XpgKvF-rkIAnA-a_yXNGCD1FMjGJcCHeM8h05c8L2cNArhAdcCk3f84v5xop2rGDIQ1uMVY-rfkHA5TyQaNri9MQ2-Mc3GYyxDDGJV2FOrk_qvD70o16p-w9cwY8-1nNGp"
                />
              </div>
            </div>

            {/* Error Rate */}
            <div className="bg-[#1a2c35] rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Error Rate</h3>
              <div className="flex items-center justify-center h-64" data-alt="A donut chart showing that 98% of requests are successful (2xx), 1.5% are client errors (4xx), and 0.5% are server errors (5xx).">
                <img
                  alt="Error Rate Donut Chart"
                  className="w-48 h-48 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0eo1dR2s_97SU3uYU13wxGs01N9IE_gz4MyYiHc0q9LWfHANA6n0a76ZTkf3SGUNrSLf5OgPIS08PE4fUS0yqTHh3np27Xjqj_817u51H9YPOyJkqJXd3BUnt2k6FYyfA2_HdmchlTCwyy-_guhE37HPSbe9v0gWMtCdQOPDBS4Rl8JtlEH3bMLbMve1CaOXuENqC_UpUnHduY-DLt1ciQ7J5-dHG_wHkxgQzqhVskYyfySbAPOQ7H5MYewarJ5iQ1JFw7YmrE5VS"
                />
              </div>
            </div>

            {/* Business Metrics */}
            <div className="bg-[#1a2c35] rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Active Users</h3>
              <div className="flex items-center gap-2">
                <p className="text-white text-5xl font-bold">1,204</p>
                <span className="text-green-400 flex items-center text-sm font-medium">
                  <span className="material-symbols-outlined text-base">arrow_upward</span>
                  +5.2%
                </span>
              </div>
            </div>

            {/* Credit Purchase Volume */}
            <div className="bg-[#1a2c35] rounded-xl border border-white/10 p-6 col-span-1 lg:col-span-1 xl:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">Credit Purchase Volume</h3>
              <div data-alt="A bar chart showing credit purchase volume increasing steadily over the last 7 days.">
                <img
                  alt="Credit Purchase Volume Chart"
                  className="w-full h-32 object-cover rounded-lg"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJHNDmIPPsMDtJ61Oeqkp9qdSg5FvG_fusa3rRxN1IUINBy_IJ_IzVHgxBm7fH5AwQu03f4ugprJZdlYLdsuFK-GO-0MLBXDnqI1LEIT1YJzDNcNiKmIwo1Rtm5a9ifEqGHQuhKzaMEvxz_57cmK9PjvqtTOwiE0KkVttGAad9VSlI5A6LZFTl57AEePQXl1ItAXQSZwli3Yww7JqjmYqYVvAxcNIr-kagsnyAwFDvpF0gq5MEieyStWUP-kFPVSM-r8CRL5U0QEzi"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

