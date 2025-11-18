'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface SuspiciousActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  metadata?: any;
}

export default function AdminSuspiciousPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<SuspiciousActivity[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFlagsToday: 0,
    highSeverityAlerts: 0,
    usersUnderReview: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/admin/suspicious');
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

        // Fetch suspicious activities from security_alerts or audit_logs
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: alertsData } = await supabase
          .from('security_alerts')
          .select('*')
          .gte('created_at', today.toISOString())
          .order('created_at', { ascending: false })
          .limit(100);

        const { data: auditLogsData } = await supabase
          .from('audit_logs')
          .select('*')
          .in('action', ['login', 'purchase', 'data_export'])
          .gte('created_at', today.toISOString())
          .order('created_at', { ascending: false })
          .limit(100);

        // Map security alerts to suspicious activities
        const mappedActivities: SuspiciousActivity[] = (alertsData || []).map((alert: any) => ({
          id: alert.id,
          user_id: alert.user_id || 'unknown',
          activity_type: alert.alert_type || 'Suspicious Activity',
          description: alert.description || alert.message || 'Suspicious activity detected',
          timestamp: alert.created_at,
          severity: alert.severity || 'medium',
          metadata: alert.metadata,
        }));

        // Calculate stats
        const totalFlagsToday = mappedActivities.length;
        const highSeverityAlerts = mappedActivities.filter((a) => a.severity === 'critical' || a.severity === 'high').length;
        const usersUnderReview = new Set(mappedActivities.map((a) => a.user_id)).size;

        setStats({
          totalFlagsToday,
          highSeverityAlerts,
          usersUnderReview,
        });

        setActivities(mappedActivities);
      } catch (error) {
        console.error('Error fetching suspicious activity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activityTypeFilter !== 'all') {
      if (activity.activity_type.toLowerCase() !== activityTypeFilter.toLowerCase()) return false;
    }

    if (severityFilter !== 'all') {
      if (activity.severity !== severityFilter) return false;
    }

    return matchesSearch;
  });

  const getSeverityBadge = (severity: string) => {
    const severityMap: Record<string, { label: string; className: string }> = {
      critical: { label: 'Critical', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      high: { label: 'High', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      low: { label: 'Low', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    };
    const severityInfo = severityMap[severity] || { label: severity, className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${severityInfo.className}`}>
        {severityInfo.label}
      </span>
    );
  };

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      {/* SideNavBar */}
      <aside className="flex h-screen w-64 flex-col bg-white dark:bg-[#101d23] border-r border-gray-200 dark:border-gray-800 sticky top-0">
        <div className="flex h-full min-h-0 flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-2">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                data-alt="Admin Fatma's profile picture"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAtf_FsxVpwwFT7gvzhUcm3yxLQ9DZNkjg1O-kT6QNzvpV1B-IfdFIhqeeVSi4wI2zHP4bxZpnPIaEv0V8PSLp6tvQN_9dMqmrWr3OC7CCCvhZ_MMChzOwz11twiJXg45capLmvIU4O08Un8Qmuk9wiDnwecWdEI2HKA4ei76H0fDvIQqMhkw6cSme3sMlL5SP5aST-LWNeEno2Ny2RdhWR1h0BHjwDu4x0tDXtXKMyDBU5ZeryLi6w_vArguxGJ4O07CanTMNoQx5M")',
                }}
              />
              <div className="flex flex-col">
                <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">Admin Fatma</h1>
                <p className="text-gray-500 dark:text-[#90b8cb] text-sm font-normal leading-normal">Platform Manager</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <Link
                className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-white rounded-lg hover:bg-primary/10 transition-colors"
                href="/admin"
              >
                <span className="material-symbols-outlined">dashboard</span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-white rounded-lg hover:bg-primary/10 transition-colors"
                href="/admin/users"
              >
                <span className="material-symbols-outlined">group</span>
                <p className="text-sm font-medium leading-normal">User Management</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary dark:bg-[#223d49] dark:text-white"
                href="/admin/suspicious"
              >
                <span className="material-symbols-outlined">summarize</span>
                <p className="text-sm font-medium leading-normal">Reports</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-white rounded-lg hover:bg-primary/10 transition-colors"
                href="/admin/settings"
              >
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-white rounded-lg hover:bg-primary/10 transition-colors"
                href="/support"
              >
                <span className="material-symbols-outlined">help</span>
                <p className="text-sm font-medium leading-normal">Support</p>
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-white rounded-lg hover:bg-primary/10 transition-colors text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              <p className="text-sm font-medium leading-normal">Log Out</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* TopNavBar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-b-[#223d49] px-6 lg:px-10 py-3 bg-white dark:bg-[#101d23] sticky top-0 z-10">
          <div className="flex items-center gap-4 text-gray-900 dark:text-white">
            <div className="text-primary text-2xl">
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                <path d="m13.29 10.29-1.59 1.59c-.39.39-1.02.39-1.41 0l-1.59-1.59c-.63-.63-.18-1.71.71-1.71h3.17c.89 0 1.34 1.08.71 1.71z"></path>
                <path d="m11 14.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"></path>
              </svg>
            </div>
            <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
          </div>
          <div className="flex flex-1 justify-end items-center gap-4 lg:gap-8">
            <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-gray-400 dark:text-[#90b8cb] flex border-none bg-gray-100 dark:bg-[#223d49] items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-gray-100 dark:bg-[#223d49] h-full placeholder:text-gray-400 dark:placeholder:text-[#90b8cb] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  placeholder="Search"
                  value=""
                />
              </div>
            </label>
            <div className="flex gap-2">
              <Link
                href="/notifications"
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-[#223d49] text-gray-700 dark:text-white"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
              </Link>
              <Link
                href="/support"
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-[#223d49] text-gray-700 dark:text-white"
              >
                <span className="material-symbols-outlined text-xl">help</span>
              </Link>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="Admin Fatma's profile picture"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPx4z15k_AjDwexew62QVnyOWcu3UB-zDB5WZAdNeJZ17ScRQDNIhoy3myD5cNMGmNP44cghodZGb-hgzdfGGOAQBNLSPPhyhNc8CtH9iEJ9ojBSjIERjVYyru-wZX3Gapxc4SbtrKyUCaSwQQZLDEmsvGJNatSwiM-EQ8ASplxEsNihd2zskclR-k2Cf0sNTyjXiwrPZtgKVxMlpTo457gxzyu3o91aNBX7yosJC1dIcpBWi4Y04Dz3b1IlJBpcnNTi6AKFFFpXtd")',
              }}
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-10 flex-1 bg-background-light dark:bg-background-dark">
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between gap-3 mb-6">
            <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              Suspicious Activity Report
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#101d23] border border-gray-200 dark:border-[#315768]">
              <p className="text-gray-600 dark:text-white text-base font-medium leading-normal">Total Flags Today</p>
              <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">{stats.totalFlagsToday}</p>
              <p className="text-green-500 dark:text-[#0bda57] text-base font-medium leading-normal">+5%</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#101d23] border border-gray-200 dark:border-[#315768]">
              <p className="text-gray-600 dark:text-white text-base font-medium leading-normal">High-Severity Alerts</p>
              <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">{stats.highSeverityAlerts}</p>
              <p className="text-green-500 dark:text-[#0bda57] text-base font-medium leading-normal">+2%</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#101d23] border border-gray-200 dark:border-[#315768]">
              <p className="text-gray-600 dark:text-white text-base font-medium leading-normal">Users Under Review</p>
              <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">{stats.usersUnderReview}</p>
              <p className="text-red-500 dark:text-[#E74C3C] text-base font-medium leading-normal">+1%</p>
            </div>
          </div>

          {/* Main Content Area with Table */}
          <div className="bg-white dark:bg-[#101d23] rounded-xl border border-gray-200 dark:border-[#315768] overflow-hidden">
            {/* ToolBar / Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-[#315768] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  className="form-input w-full sm:w-64 rounded-lg bg-gray-100 dark:bg-[#223d49] border-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Search by User ID, details..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="form-select rounded-lg bg-gray-100 dark:bg-[#223d49] border-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                  value={activityTypeFilter}
                  onChange={(e) => setActivityTypeFilter(e.target.value)}
                >
                  <option value="all">Activity Type</option>
                  <option value="login">Login</option>
                  <option value="purchase">Purchase</option>
                  <option value="credit_top-up">Credit Top-up</option>
                </select>
                <select
                  className="form-select rounded-lg bg-gray-100 dark:bg-[#223d49] border-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="all">Severity Level</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActivityTypeFilter('all');
                    setSeverityFilter('all');
                  }}
                  className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-200 dark:bg-[#223d49] text-gray-700 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4"
                >
                  <span>Reset</span>
                </button>
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4">
                  <span className="material-symbols-outlined text-base">filter_alt</span>
                  <span className="truncate">Apply Filters</span>
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#1a2831] dark:text-gray-400">
                  <tr>
                    <th className="p-4" scope="col">
                      <div className="flex items-center">
                        <input
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          id="checkbox-all"
                          type="checkbox"
                          checked={selectedItems.size === filteredActivities.length && filteredActivities.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(new Set(filteredActivities.map((a) => a.id)));
                            } else {
                              setSelectedItems(new Set());
                            }
                          }}
                        />
                        <label className="sr-only" htmlFor="checkbox-all">
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th className="px-6 py-3" scope="col">User ID</th>
                    <th className="px-6 py-3" scope="col">Activity Type</th>
                    <th className="px-6 py-3" scope="col">Description</th>
                    <th className="px-6 py-3" scope="col">Timestamp</th>
                    <th className="px-6 py-3" scope="col">Severity</th>
                    <th className="px-6 py-3" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Loading suspicious activities...
                      </td>
                    </tr>
                  ) : filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No suspicious activities found.
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="bg-white dark:bg-[#101d23] border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#15232a]"
                      >
                        <td className="w-4 p-4">
                          <input
                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            type="checkbox"
                            checked={selectedItems.has(activity.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedItems);
                              if (e.target.checked) {
                                newSelected.add(activity.id);
                              } else {
                                newSelected.delete(activity.id);
                              }
                              setSelectedItems(newSelected);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          <Link href={`/admin/users?user=${activity.user_id}`} className="text-primary hover:underline">
                            user_{activity.user_id.substring(0, 6)}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{activity.activity_type}</td>
                        <td className="px-6 py-4">{activity.description}</td>
                        <td className="px-6 py-4">{format(new Date(activity.timestamp), 'yyyy-MM-dd HH:mm:ss')}</td>
                        <td className="px-6 py-4">{getSeverityBadge(activity.severity)}</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <Link
                            href={`/admin/users?user=${activity.user_id}`}
                            className="text-gray-500 dark:text-gray-400 hover:text-primary"
                          >
                            <span className="material-symbols-outlined">person</span>
                          </Link>
                          <button className="text-gray-500 dark:text-gray-400 hover:text-primary">
                            <span className="material-symbols-outlined">search</span>
                          </button>
                          <button className="text-gray-500 dark:text-gray-400 hover:text-green-500">
                            <span className="material-symbols-outlined">task_alt</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <nav aria-label="Table navigation" className="flex items-center justify-between p-4">
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">1-{filteredActivities.length}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">1000</span>
              </span>
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  <a
                    className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-[#1a2831] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-[#223d49] dark:hover:text-white"
                    href="#"
                  >
                    Previous
                  </a>
                </li>
                <li>
                  <a
                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#1a2831] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-[#223d49] dark:hover:text-white"
                    href="#"
                  >
                    1
                  </a>
                </li>
                <li>
                  <a
                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#1a2831] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-[#223d49] dark:hover:text-white"
                    href="#"
                  >
                    2
                  </a>
                </li>
                <li>
                  <a
                    aria-current="page"
                    className="z-10 px-3 py-2 leading-tight text-primary border border-primary bg-primary/10 hover:bg-primary/20 dark:border-gray-700 dark:bg-[#223d49] dark:text-white"
                    href="#"
                  >
                    3
                  </a>
                </li>
                <li>
                  <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-[#1a2831] dark:border-gray-700 dark:text-gray-400">
                    ...
                  </span>
                </li>
                <li>
                  <a
                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#1a2831] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-[#223d49] dark:hover:text-white"
                    href="#"
                  >
                    100
                  </a>
                </li>
                <li>
                  <a
                    className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-[#1a2831] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-[#223d49] dark:hover:text-white"
                    href="#"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}

