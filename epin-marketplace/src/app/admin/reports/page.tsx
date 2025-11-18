'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../layout';

export default function AdminReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push('/login?redirect=/admin/reports');
          return;
        }

        setUser(currentUser);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, full_name, avatar_url')
          .eq('id', currentUser.id)
          .single();

        if (!profileData || profileData.role !== 'admin') {
          router.push('/');
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-black dark:text-white">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* PageHeading */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">
                Admin Reports
              </p>
              <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
                Generate and view comprehensive platform reports.
              </p>
            </div>
          </div>

          {/* Report Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Financial Reports */}
            <Link
              href="/admin/financial"
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-primary dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl">monitoring</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-black dark:text-white">Financial Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Revenue, transactions, and financial analytics</p>
                </div>
              </div>
            </Link>

            {/* User Reports */}
            <Link
              href="/admin/users"
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-primary dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl">group</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-black dark:text-white">User Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">User activity, growth, and demographics</p>
                </div>
              </div>
            </Link>

            {/* Transaction Reports */}
            <Link
              href="/admin/transactions"
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-primary dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl">receipt_long</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-black dark:text-white">Transaction Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transaction history and analytics</p>
                </div>
              </div>
            </Link>

            {/* Security Reports */}
            <Link
              href="/admin/security"
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-primary dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl">security</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-black dark:text-white">Security Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fraud detection and security alerts</p>
                </div>
              </div>
            </Link>

            {/* Content Moderation Reports */}
            <Link
              href="/admin/content"
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-primary dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl">folder</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-black dark:text-white">Content Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Content moderation and review statistics</p>
                </div>
              </div>
            </Link>

            {/* Verification Reports */}
            <Link
              href="/admin/verification"
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-primary dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-black dark:text-white">Verification Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">KYC and verification statistics</p>
                </div>
              </div>
            </Link>

            {/* GDPR Reports */}
            <Link
              href="/admin/gdpr"
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-primary dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl">privacy_tip</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-black dark:text-white">GDPR Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data access and privacy compliance</p>
                </div>
              </div>
            </Link>

            {/* Suspicious Activity Reports */}
            <Link
              href="/admin/suspicious"
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-primary dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl">warning</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-black dark:text-white">Suspicious Activity</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Flagged activities and risk assessments</p>
                </div>
              </div>
            </Link>

            {/* Platform Settings */}
            <Link
              href="/admin/platform"
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-primary dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl">settings</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-black dark:text-white">Platform Settings</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Platform configuration and settings</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90">
                <span className="material-symbols-outlined text-lg">download</span>
                Export All Reports
              </button>
              <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-gray-100 dark:bg-surface-dark text-gray-800 dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-opacity-80">
                <span className="material-symbols-outlined text-lg">schedule</span>
                Schedule Report
              </button>
              <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-gray-100 dark:bg-surface-dark text-gray-800 dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-opacity-80">
                <span className="material-symbols-outlined text-lg">email</span>
                Email Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}

