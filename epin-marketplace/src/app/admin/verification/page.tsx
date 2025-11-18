'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface VerificationApplication {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  verification_tier: number | null;
  verification_status: string;
  created_at: string;
  metadata?: any;
}

export default function AdminVerificationPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<VerificationApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<VerificationApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/admin/verification');
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

        // Fetch verification applications from profiles
        let query = supabase
          .from('profiles')
          .select('id, full_name, role, created_at, metadata')
          .in('role', ['seller', 'creator'])
          .order('created_at', { ascending: false });

        const { data: profilesData, error } = await query;

        if (error) throw error;

        const mappedApplications: VerificationApplication[] = (profilesData || []).map((profile: any) => ({
          id: profile.id,
          user_id: profile.id,
          full_name: profile.full_name || 'Unknown',
          role: profile.role,
          verification_tier: profile.metadata?.verification_tier || null,
          verification_status: profile.metadata?.verification_status || 'pending',
          created_at: profile.created_at,
          metadata: profile.metadata,
        }));

        setApplications(mappedApplications);
        if (mappedApplications.length > 0 && !selectedApplication) {
          setSelectedApplication(mappedApplications[0]);
        }
      } catch (error) {
        console.error('Error fetching verification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router, selectedApplication]);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter !== 'all') {
      if (statusFilter === 'pending' && app.verification_status !== 'pending') return false;
      if (statusFilter === 'in_review' && app.verification_status !== 'in_review') return false;
      if (statusFilter === 'action_required' && app.verification_status !== 'action_required') return false;
    }

    if (tierFilter !== 'all') {
      if (app.verification_tier !== parseInt(tierFilter)) return false;
    }

    if (typeFilter !== 'all') {
      if (app.role !== typeFilter) return false;
    }

    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-info/20 text-info-800 dark:text-info' },
      in_review: { label: 'In Review', className: 'bg-warning/20 text-warning-800 dark:text-warning' },
      action_required: { label: 'Action Required', className: 'bg-danger/20 text-danger-800 dark:text-danger' },
      approved: { label: 'Approved', className: 'bg-success/20 text-success-800 dark:text-success' },
      rejected: { label: 'Rejected', className: 'bg-danger/20 text-danger-800 dark:text-danger' },
    };
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300' };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const handleApprove = async (applicationId: string, tier: number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          metadata: {
            verification_status: 'approved',
            verification_tier: tier,
            verified_at: new Date().toISOString(),
          },
        })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, verification_status: 'approved', verification_tier: tier }
            : app
        )
      );
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication((prev) => (prev ? { ...prev, verification_status: 'approved', verification_tier: tier } : null));
      }
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          metadata: {
            verification_status: 'rejected',
            rejected_at: new Date().toISOString(),
          },
        })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, verification_status: 'rejected' } : app))
      );
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication((prev) => (prev ? { ...prev, verification_status: 'rejected' } : null));
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      {/* SideNavBar */}
      <aside className="flex h-screen min-h-screen flex-col bg-[#182b34]/50 dark:bg-[#101d23] w-64 p-4 border-r border-slate-200/10 dark:border-white/10 sticky top-0">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="Abstract blue and teal circular logo"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHvcQUus36mnh-T8c2gTZf5xwPpHJOetv5iGfqscYybU-jyLepplJJ__GiAZ8wwlWuE94pFLVxWgmyHriP9BAZFDGUqW3bdMwPQP1J11faQuSWL-ehhWZSuWN67P4SiaQQ4Fx1qQOnLOf14CMR7MUmxlM3dSfZiuCp2qo7K9b-byMJjNkhC-RDlge5FBHScEOnKrsHX9FRLvPMZbh4MhJZH7xK2dARNPUngfGIS5rcvqPWZC7HZXVtrdFZBw9XbIiUbyMAYosibK24")',
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-slate-800 dark:text-white text-base font-medium leading-normal">Admin Panel</h1>
              <p className="text-slate-500 dark:text-[#90b8cb] text-sm font-normal leading-normal">Epin Marketplace</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/admin"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 dark:bg-[#223d49] text-primary dark:text-white"
              href="/admin/verification"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <p className="text-sm font-medium leading-normal">Verifications</p>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/admin/users"
            >
              <span className="material-symbols-outlined">storefront</span>
              <p className="text-sm font-medium leading-normal">Sellers</p>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/admin/users"
            >
              <span className="material-symbols-outlined">account_circle</span>
              <p className="text-sm font-medium leading-normal">Creators</p>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/admin/settings"
            >
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-auto">
          <Link
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            href="/support"
          >
            <span className="material-symbols-outlined">help</span>
            <p className="text-sm font-medium leading-normal">Support</p>
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
          >
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Queue */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
              {/* PageHeading */}
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex min-w-72 flex-col gap-1">
                  <p className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                    Verification Queue
                  </p>
                  <p className="text-slate-500 dark:text-[#90b8cb] text-base font-normal leading-normal">
                    Review and manage pending applications.
                  </p>
                </div>
              </div>

              {/* SearchBar */}
              <div className="w-full">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-slate-500 dark:text-[#90b8cb] flex bg-slate-200 dark:bg-[#223d49] items-center justify-center pl-4 rounded-l-lg">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-slate-200 dark:bg-[#223d49] h-full placeholder:text-slate-500 dark:placeholder:text-[#90b8cb] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      placeholder="Search by Applicant Name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </label>
              </div>

              {/* Chips */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-200 dark:bg-[#223d49] px-3"
                >
                  <span className="material-symbols-outlined text-base text-slate-500 dark:text-white">tune</span>
                  <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal">Status: All</p>
                  <span className="material-symbols-outlined text-base text-slate-500 dark:text-white">expand_more</span>
                </button>
                <button
                  onClick={() => setTierFilter('all')}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-200 dark:bg-[#223d49] px-3"
                >
                  <span className="material-symbols-outlined text-base text-slate-500 dark:text-white">layers</span>
                  <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal">Tier: All</p>
                  <span className="material-symbols-outlined text-base text-slate-500 dark:text-white">expand_more</span>
                </button>
                <button
                  onClick={() => setTypeFilter('all')}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-200 dark:bg-[#223d49] px-3"
                >
                  <span className="material-symbols-outlined text-base text-slate-500 dark:text-white">category</span>
                  <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal">Type: All</p>
                  <span className="material-symbols-outlined text-base text-slate-500 dark:text-white">expand_more</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#315768] bg-background-light dark:bg-[#182b34]/50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-[#182b34]">
                      <th className="px-4 py-3 text-left text-slate-600 dark:text-white text-xs font-medium uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-4 py-3 text-left text-slate-600 dark:text-white text-xs font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-slate-600 dark:text-white text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-4 text-center text-slate-500 dark:text-[#90b8cb]">
                          Loading applications...
                        </td>
                      </tr>
                    ) : filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-4 text-center text-slate-500 dark:text-[#90b8cb]">
                          No applications found.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => (
                        <tr
                          key={app.id}
                          className={`border-t border-t-slate-200 dark:border-t-[#315768] hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer ${
                            selectedApplication?.id === app.id
                              ? 'bg-primary/10 dark:bg-primary/20'
                              : ''
                          }`}
                          onClick={() => setSelectedApplication(app)}
                        >
                          <td className="h-[72px] px-4 py-2">
                            <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">{app.full_name}</p>
                            <p className="text-slate-500 dark:text-[#90b8cb] text-xs capitalize">
                              {app.role} / {app.verification_tier ? `Tier ${app.verification_tier}` : 'N/A'}
                            </p>
                          </td>
                          <td className="h-[72px] px-4 py-2 text-slate-500 dark:text-[#90b8cb] text-sm font-normal leading-normal">
                            {format(new Date(app.created_at), 'yyyy-MM-dd')}
                          </td>
                          <td className="h-[72px] px-4 py-2">{getStatusBadge(app.verification_status)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Details */}
            {selectedApplication && (
              <div className="col-span-12 lg:col-span-7">
                <div className="sticky top-8 flex flex-col gap-6 bg-slate-100/50 dark:bg-[#182b34]/50 rounded-xl p-6 border border-slate-200 dark:border-[#315768]">
                  {/* Main Review Panel Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedApplication.full_name}</h2>
                      <p className="text-slate-500 dark:text-[#90b8cb] capitalize">
                        {selectedApplication.role} Verification - {selectedApplication.verification_tier ? `Tier ${selectedApplication.verification_tier}` : 'N/A'}
                      </p>
                    </div>
                    {getStatusBadge(selectedApplication.verification_status)}
                  </div>

                  {/* Progressive Verification Stepper */}
                  <div>
                    <ol className="flex items-center w-full">
                      <li className="flex w-full items-center text-success dark:text-success after:content-[''] after:w-full after:h-1 after:border-b after:border-success after:border-4 after:inline-block">
                        <span className="flex items-center justify-center w-10 h-10 bg-success rounded-full lg:h-12 lg:w-12 shrink-0">
                          <span className="material-symbols-outlined text-white">check</span>
                        </span>
                      </li>
                      <li className="flex w-full items-center text-success dark:text-success after:content-[''] after:w-full after:h-1 after:border-b after:border-success after:border-4 after:inline-block">
                        <span className="flex items-center justify-center w-10 h-10 bg-success rounded-full lg:h-12 lg:w-12 shrink-0">
                          <span className="material-symbols-outlined text-white">check</span>
                        </span>
                      </li>
                      <li className="flex w-full items-center text-primary dark:text-primary after:content-[''] after:w-full after:h-1 after:border-b after:border-slate-200 after:border-4 after:inline-block dark:after:border-slate-700">
                        <span className="flex items-center justify-center w-10 h-10 bg-primary rounded-full lg:h-12 lg:w-12 shrink-0">
                          <span className="material-symbols-outlined text-white">edit</span>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="flex items-center justify-center w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full lg:h-12 lg:w-12 text-slate-500 shrink-0">
                          <span className="material-symbols-outlined">domain_verification</span>
                        </span>
                      </li>
                    </ol>
                    <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-[#90b8cb]">
                      <p>Tier 1</p>
                      <p>Tier 2</p>
                      <p className="text-primary font-bold">Tier 3</p>
                      <p>Completed</p>
                    </div>
                  </div>

                  {/* Information Accordions */}
                  <div className="space-y-4">
                    {/* Identity Document */}
                    <details className="group p-4 rounded-lg bg-slate-200 dark:bg-[#223d49]" open>
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-success">check_circle</span>
                          <h3 className="font-medium text-slate-900 dark:text-white">Identity Document & Phone</h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400">(Tier 1 - Verified)</span>
                        </div>
                        <span className="transition group-open:rotate-180 material-symbols-outlined text-slate-500 dark:text-slate-400">
                          expand_more
                        </span>
                      </summary>
                      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 space-y-3 pl-9">
                        <p>
                          Passport: <span className="font-mono bg-slate-300 dark:bg-slate-600 rounded px-1">**********234</span>
                        </p>
                        <p>
                          Phone: <span className="font-mono bg-slate-300 dark:bg-slate-600 rounded px-1">+1-***-***-5678</span>
                        </p>
                        <p>
                          AI Check: <span className="text-success font-medium">Match Confirmed</span>
                        </p>
                      </div>
                    </details>

                    {/* Video KYC */}
                    <details className="group p-4 rounded-lg bg-slate-200 dark:bg-[#223d49]" open>
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-success">check_circle</span>
                          <h3 className="font-medium text-slate-900 dark:text-white">Video KYC Call</h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400">(Tier 2 - Verified)</span>
                        </div>
                        <span className="transition group-open:rotate-180 material-symbols-outlined text-slate-500 dark:text-slate-400">
                          expand_more
                        </span>
                      </summary>
                      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 pl-9">
                        <button className="inline-flex items-center gap-2 text-info hover:underline">
                          <span className="material-symbols-outlined text-base">videocam</span>
                          <span>Watch Recorded Call</span>
                        </button>
                        <p className="mt-2">
                          Admin Note: <span className="italic">"User confirmed details clearly. No issues."</span>
                        </p>
                      </div>
                    </details>

                    {/* Business Documents */}
                    <details className="group p-4 rounded-lg bg-slate-200 dark:bg-[#223d49]" open>
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-warning animate-pulse">pending</span>
                          <h3 className="font-medium text-slate-900 dark:text-white">Business Documents & Address</h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400">(Tier 3 - Pending Review)</span>
                        </div>
                        <span className="transition group-open:rotate-180 material-symbols-outlined text-slate-500 dark:text-slate-400">
                          expand_more
                        </span>
                      </summary>
                      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 pl-9 space-y-3">
                        <button className="inline-flex items-center gap-2 text-info hover:underline">
                          <span className="material-symbols-outlined text-base">description</span>
                          <span>View Business License.pdf</span>
                        </button>
                        <button className="inline-flex items-center gap-2 text-info hover:underline">
                          <span className="material-symbols-outlined text-base">description</span>
                          <span>View Utility Bill.pdf</span>
                        </button>
                      </div>
                    </details>
                  </div>

                  {/* Internal Notes / Activity Log */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="internal-notes">
                      Internal Notes
                    </label>
                    <textarea
                      className="form-textarea block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-background-light dark:bg-background-dark text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                      id="internal-notes"
                      name="internal-notes"
                      placeholder="Add a comment for the team..."
                      rows={3}
                    />
                    <div className="text-right mt-2">
                      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity ml-auto">
                        <span className="truncate">Add Note</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <button
                      onClick={() => handleReject(selectedApplication.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg h-12 bg-danger/80 hover:bg-danger text-white font-bold transition-colors"
                    >
                      <span className="material-symbols-outlined">close</span>
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApplication.id, 3)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg h-12 bg-success/80 hover:bg-success text-white font-bold transition-colors"
                    >
                      <span className="material-symbols-outlined">check</span>
                      Approve Tier 3
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

