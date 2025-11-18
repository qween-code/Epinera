'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface GDPRRecord {
  id: string;
  user_id: string;
  user_name: string;
  access_count: number;
  last_export_timestamp: string;
}

export default function AdminGDPRPage() {
  const router = useRouter();
  const [records, setRecords] = useState<GDPRRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/admin/gdpr');
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

        // Fetch GDPR access records from audit_logs
        let query = supabase
          .from('audit_logs')
          .select(`
            id,
            user_id,
            action,
            created_at,
            profiles!audit_logs_user_id_fkey (
              full_name,
              email
            )
          `)
          .eq('action', 'data_export')
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * 5, currentPage * 5 - 1);

        if (searchQuery) {
          query = query.or(`user_id.ilike.%${searchQuery}%,profiles.full_name.ilike.%${searchQuery}%,profiles.email.ilike.%${searchQuery}%`);
        }

        const { data: logsData, error, count } = await query;

        if (error) throw error;

        // Group by user_id to count access
        const userAccessMap = new Map<string, { count: number; lastExport: string; user_name: string }>();

        (logsData || []).forEach((log: any) => {
          const userId = log.user_id;
          const existing = userAccessMap.get(userId);
          if (existing) {
            existing.count += 1;
            if (new Date(log.created_at) > new Date(existing.lastExport)) {
              existing.lastExport = log.created_at;
            }
          } else {
            userAccessMap.set(userId, {
              count: 1,
              lastExport: log.created_at,
              user_name: log.profiles?.full_name || log.profiles?.email || `USR-${userId.substring(0, 6).toUpperCase()}`,
            });
          }
        });

        const mappedRecords: GDPRRecord[] = Array.from(userAccessMap.entries()).map(([userId, data]) => ({
          id: userId,
          user_id: `USR-${userId.substring(0, 6).toUpperCase()}`,
          user_name: data.user_name,
          access_count: data.count,
          last_export_timestamp: data.lastExport,
        }));

        setRecords(mappedRecords);
        setTotalPages(Math.ceil((count || 0) / 5));
      } catch (error) {
        console.error('Error fetching GDPR data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router, searchQuery, currentPage]);

  const handleExport = async () => {
    try {
      // Export functionality would generate a CSV/JSON file
      alert('Export functionality would generate a report file');
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* SideNavBar */}
      <aside className="w-64 flex-shrink-0 bg-[#14242c]">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-2">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                data-alt="Admin Fatma avatar"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmd6AX5AsoVE4wUJ7KOkXIs13HFfbfe-FL5taJ2idcafsdmf4xPVBSvomOIdhq4SRV-1L4upG5BmcZ6jjkR33VASz0M4MUrCkQlQi5pwlMEiAc4n0yjcmQSLTLbFr2l7pR9q_SlSfklFfWRaU38BLiGoDanc1x6XRuhbe-xDmLmpx_FaUtyluAn-IfE1GNU15-8QJj1xaFD_38YRBUXFuMGdL31jvPghvUNCMWV1YKjHyRPuwB_hl_GlH60G6rxMvai2vLgrirNnq_")',
                }}
              />
              <div className="flex flex-col">
                <h1 className="text-white text-base font-medium leading-normal">Admin Fatma</h1>
                <p className="text-slate-400 text-sm font-normal leading-normal">Platform Manager</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 mt-4">
              <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10" href="/admin">
                <span className="material-symbols-outlined">dashboard</span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10" href="/admin/users">
                <span className="material-symbols-outlined">group</span>
                <p className="text-sm font-medium leading-normal">Users</p>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10" href="/admin/financial">
                <span className="material-symbols-outlined">assessment</span>
                <p className="text-sm font-medium leading-normal">Reports</p>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10" href="/admin/settings">
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary"
                href="/admin/gdpr"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <p className="text-sm font-medium leading-normal">GDPR</p>
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-1">
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10" href="/support">
              <span className="material-symbols-outlined">help</span>
              <p className="text-sm font-medium leading-normal">Support</p>
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10 text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              <p className="text-sm font-medium leading-normal">Logout</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* PageHeading */}
          <header className="mb-8">
            <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
              GDPR Data Access Report
            </p>
          </header>

          {/* Filter and Action Bar */}
          <div className="bg-white dark:bg-[#14242c] p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-wrap items-end gap-4">
              {/* User Search Input */}
              <div className="flex-grow min-w-[200px]">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 pb-2" htmlFor="userID">
                  Filter by User ID
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                  <input
                    className="form-input w-full pl-10 pr-4 py-2.5 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-primary focus:border-primary"
                    id="userID"
                    placeholder="Search by User ID, Name, or Email..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {/* Date Range Picker */}
              <div className="flex-grow min-w-[200px]">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 pb-2" htmlFor="dateRange">
                  Date Range
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
                  <input
                    className="form-input w-full pl-10 pr-4 py-2.5 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-primary focus:border-primary"
                    id="dateRange"
                    placeholder="Select Date Range"
                    type="text"
                    value={dateRange.start && dateRange.end ? `${dateRange.start} - ${dateRange.end}` : ''}
                    readOnly
                  />
                </div>
              </div>
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setDateRange({ start: '', end: '' });
                  }}
                  className="flex items-center justify-center rounded-lg h-11 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 gap-2 text-sm font-bold min-w-0 px-4 hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  <span>Reset</span>
                </button>
                <button className="flex items-center justify-center rounded-lg h-11 bg-primary text-white gap-2 text-sm font-bold min-w-0 px-4 hover:bg-primary/90">
                  <span>Apply Filters</span>
                </button>
              </div>
              {/* Spacer */}
              <div className="flex-grow hidden lg:block"></div>
              {/* Export Button */}
              <div>
                <button
                  onClick={handleExport}
                  className="flex w-full items-center justify-center rounded-lg h-11 bg-primary/20 text-primary gap-2 text-sm font-bold min-w-0 px-4 hover:bg-primary/30"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-[#14242c] rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-[#182d38]">
                  <tr>
                    <th className="px-6 py-4 font-medium" scope="col">
                      <div className="flex items-center gap-1 cursor-pointer">
                        User ID <span className="material-symbols-outlined text-base">swap_vert</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 font-medium" scope="col">
                      <div className="flex items-center gap-1 cursor-pointer">
                        User Name <span className="material-symbols-outlined text-base">swap_vert</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 font-medium" scope="col">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Access Count <span className="material-symbols-outlined text-base">swap_vert</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 font-medium" scope="col">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Last Export Timestamp <span className="material-symbols-outlined text-base">swap_vert</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                        Loading GDPR records...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                        No data access logs found.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="border-b border-slate-200 dark:border-slate-800">
                        <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">{record.user_id}</td>
                        <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{record.user_name}</td>
                        <td className="px-6 py-4">{record.access_count}</td>
                        <td className="px-6 py-4">
                          {format(new Date(record.last_export_timestamp), 'yyyy-MM-dd HH:mm:ss')} UTC
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <nav aria-label="Table navigation" className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-white">{(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, records.length)}</span> of{' '}
                <span className="font-semibold text-slate-900 dark:text-white">100</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center px-3 h-8 text-sm font-medium text-slate-500 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center px-3 h-8 text-sm font-medium text-slate-500 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}

