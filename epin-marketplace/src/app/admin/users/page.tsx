'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../layout';

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const version = searchParams.get('version') || '1';
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: '',
    userType: 'All Types',
    accountStatus: 'All Statuses',
    paymentHistory: 'Any',
    riskScore: 75,
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push('/login?redirect=/admin/users');
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

  // Fetch all users
        const { data: usersData } = await supabase
    .from('profiles')
    .select('*')
          .order('created_at', { ascending: false });

        setUsers(usersData || []);
        setFilteredUsers(usersData || []);
      } catch (error) {
    console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          u.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
          u.id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // User type filter
    if (filters.userType !== 'All Types') {
      const roleMap: Record<string, string> = {
        Buyer: 'buyer',
        Seller: 'seller',
        Creator: 'creator',
      };
      filtered = filtered.filter((u) => u.role === roleMap[filters.userType]);
    }

    // Account status filter
    if (filters.accountStatus !== 'All Statuses') {
      if (filters.accountStatus === 'Active') {
        filtered = filtered.filter((u) => u.kyc_status === 'verified' && !u.is_suspended);
      } else if (filters.accountStatus === 'Suspended') {
        filtered = filtered.filter((u) => u.is_suspended);
      } else if (filters.accountStatus === 'Pending KYC') {
        filtered = filtered.filter((u) => u.kyc_status === 'pending');
      } else if (filters.accountStatus === 'Limited') {
        filtered = filtered.filter((u) => u.kyc_status === 'limited');
      }
    }

    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  const buyers = users.filter((u) => u.role === 'buyer');
  const sellers = users.filter((u) => u.role === 'seller' || u.role === 'creator');
  const pendingKYC = users.filter((u) => u.kyc_status === 'pending');

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-black dark:text-white">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  // Version 2 Layout
  if (version === '2') {
    return (
      <AdminLayout>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-10">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between items-center gap-3 p-4">
              <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-black dark:text-white">
                User Management
              </h1>
              <div className="flex items-center gap-3">
                <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-gray-100 dark:bg-surface-dark text-gray-800 dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-opacity-80">
                  <span className="material-symbols-outlined text-xl">download</span>
                  Export
                </button>
                <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90">
                  <span className="material-symbols-outlined text-xl">person_add</span>
                  Add User
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark">
                <p className="text-base font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                <p className="tracking-light text-2xl font-bold leading-tight text-black dark:text-white">
                  {users.length.toLocaleString()}
                </p>
                <p className="text-green-500 text-sm font-medium leading-normal">+2.5%</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark">
                <p className="text-base font-medium text-gray-600 dark:text-gray-300">Buyers</p>
                <p className="tracking-light text-2xl font-bold leading-tight text-black dark:text-white">
                  {buyers.length.toLocaleString()}
                </p>
                <p className="text-green-500 text-sm font-medium leading-normal">+3.1%</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark">
                <p className="text-base font-medium text-gray-600 dark:text-gray-300">Sellers / Creators</p>
                <p className="tracking-light text-2xl font-bold leading-tight text-black dark:text-white">
                  {sellers.length.toLocaleString()}
                </p>
                <p className="text-red-500 text-sm font-medium leading-normal">+1.8%</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark">
                <p className="text-base font-medium text-gray-600 dark:text-gray-300">Pending KYC</p>
                <p className="tracking-light text-2xl font-bold leading-tight text-black dark:text-white">
                  {pendingKYC.length}
                </p>
                <p className="text-green-500 text-sm font-medium leading-normal">+5.0%</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 p-4">
              {/* Filters Sidebar */}
              <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                <div className="sticky top-24 p-6 rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark space-y-6">
                  <h3 className="text-lg font-bold text-black dark:text-white">Advanced Filters</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="search-user">
                      Search User
                    </label>
                    <div className="relative mt-1">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">
                        search
                      </span>
                      <input
                        className="form-input w-full rounded-lg border-gray-300 dark:border-[#2f4f60] bg-gray-50 dark:bg-background-dark focus:ring-primary focus:border-primary pl-10"
                        id="search-user"
                        placeholder="Name, email, ID..."
                        type="text"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="user-type">
                      User Type
                    </label>
                    <select
                      className="form-select w-full mt-1 rounded-lg border-gray-300 dark:border-[#2f4f60] bg-gray-50 dark:bg-background-dark focus:ring-primary focus:border-primary"
                      id="user-type"
                      value={filters.userType}
                      onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                    >
                      <option>All Types</option>
                      <option>Buyer</option>
                      <option>Seller</option>
                      <option>Creator</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="account-status">
                      Account Status
                    </label>
                    <select
                      className="form-select w-full mt-1 rounded-lg border-gray-300 dark:border-[#2f4f60] bg-gray-50 dark:bg-background-dark focus:ring-primary focus:border-primary"
                      id="account-status"
                      value={filters.accountStatus}
                      onChange={(e) => setFilters({ ...filters, accountStatus: e.target.value })}
                    >
                      <option>All Statuses</option>
                      <option>Active</option>
                      <option>Suspended</option>
                      <option>Pending KYC</option>
                      <option>Limited</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="payment-history">
                      Payment History
                    </label>
                    <select
                      className="form-select w-full mt-1 rounded-lg border-gray-300 dark:border-[#2f4f60] bg-gray-50 dark:bg-background-dark focus:ring-primary focus:border-primary"
                      id="payment-history"
                      value={filters.paymentHistory}
                      onChange={(e) => setFilters({ ...filters, paymentHistory: e.target.value })}
                    >
                      <option>Any</option>
                      <option>No Transactions</option>
                      <option>Has Refunds</option>
                      <option>Chargebacks</option>
                      <option>High Volume</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="risk-score">
                      Risk Score
                    </label>
                    <input
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2 accent-primary"
                      id="risk-score"
                      max="100"
                      min="0"
                      type="range"
                      value={filters.riskScore}
                      onChange={(e) => setFilters({ ...filters, riskScore: parseInt(e.target.value) })}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>0</span>
                      <span>100</span>
                    </div>
                  </div>
                  <div className="pt-4 flex flex-col gap-2">
                    <button className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90">
                      <span className="material-symbols-outlined text-xl">filter_alt</span>
                      Apply Filters
                    </button>
                    <button
                      className="w-full flex items-center justify-center h-10 px-4 rounded-lg bg-transparent text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-surface-dark/50"
                      onClick={() =>
                        setFilters({
                          search: '',
                          userType: 'All Types',
                          accountStatus: 'All Statuses',
                          paymentHistory: 'Any',
                          riskScore: 75,
                        })
                      }
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </aside>

              {/* Users Table */}
              <div className="flex-grow">
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden">
                  {selectedUsers.size > 0 && (
                    <div className="bg-primary/20 dark:bg-primary/20 p-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {selectedUsers.size} users selected
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-white dark:bg-surface-dark text-gray-700 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-opacity-80">
                          <span className="material-symbols-outlined text-base">block</span>
                          Suspend
                        </button>
                        <button className="flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-white dark:bg-surface-dark text-gray-700 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-opacity-80">
                          <span className="material-symbols-outlined text-base">verified_user</span>
                          Verify KYC
                        </button>
                        <button className="flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-white dark:bg-surface-dark text-gray-700 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-opacity-80">
                          <span className="material-symbols-outlined text-base">mail</span>
                          Message
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-background-dark border-b border-gray-200 dark:border-border-dark">
                        <tr>
                          <th className="p-4" scope="col">
                            <div className="flex items-center">
                              <input
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-background-dark focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                id="checkbox-all"
                                type="checkbox"
                                checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                              />
                              <label className="sr-only" htmlFor="checkbox-all">
                                checkbox
                              </label>
                            </div>
                          </th>
                          <th className="px-6 py-3" scope="col">
                            User
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Type
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Status
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Limits (Sell/Spend)
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Last Login
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.slice(0, 20).map((user: any) => {
                          const isSelected = selectedUsers.has(user.id);
                          const statusColors: Record<string, string> = {
                            verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                            suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                            active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                          };
                          const statusLabels: Record<string, string> = {
                            verified: 'KYC Tier 2',
                            pending: 'Pending KYC',
                            rejected: 'Rejected',
                            suspended: 'Suspended',
                            active: 'Active',
                          };
                          const roleLabels: Record<string, string> = {
                            buyer: 'Buyer',
                            seller: 'Seller',
                            creator: 'Creator',
                            admin: 'Admin',
                          };
                          return (
                            <tr
                              key={user.id}
                              className="border-b border-gray-200 dark:border-border-dark hover:bg-gray-50 dark:hover:bg-background-dark"
                            >
                              <td className="w-4 p-4">
                                <input
                                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-background-dark focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                                />
                              </td>
                              <td className="px-6 py-4 font-medium whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <img
                                    className="w-10 h-10 rounded-full"
                                    data-alt={`User avatar for ${user.full_name || 'User'}`}
                                    src={
                                      user.avatar_url ||
                                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                                    }
                                    alt={user.full_name || 'User'}
                                  />
                                  <div>
                                    <div className="text-base font-bold text-black dark:text-white">
                                      {user.full_name || 'Unknown User'}
                                    </div>
                                    <div className="font-normal text-gray-500 dark:text-gray-400">
                                      {user.email || user.id.slice(0, 8) + '...'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-black dark:text-white">{roleLabels[user.role] || user.role}</td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full gap-1.5 ${
                                    statusColors[user.kyc_status || user.is_suspended ? 'suspended' : 'active'] ||
                                    statusColors.active
                                  }`}
                                >
                                  {user.kyc_status === 'verified' && (
                                    <span className="material-symbols-outlined text-sm">verified</span>
                                  )}
                                  {user.is_suspended && <span className="material-symbols-outlined text-sm">block</span>}
                                  {user.kyc_status === 'pending' && (
                                    <span className="material-symbols-outlined text-sm">pending</span>
                                  )}
                                  {statusLabels[user.kyc_status || (user.is_suspended ? 'suspended' : 'active')] || 'Active'}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                                {user.role === 'seller' || user.role === 'creator'
                                  ? `$${user.sell_limit || 0} / $${user.spend_limit || 0}`
                                  : `- / $${user.spend_limit || 0}`}
                              </td>
                              <td className="px-6 py-4 text-black dark:text-white">
                                {user.last_login
                                  ? new Date(user.last_login).toLocaleDateString()
                                  : new Date(user.updated_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <button className="text-primary hover:underline font-medium">Manage</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <nav aria-label="Table navigation" className="flex items-center justify-between p-4">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Showing <span className="font-semibold">1-{Math.min(20, filteredUsers.length)}</span> of{' '}
                      <span className="font-semibold">{filteredUsers.length}</span>
                    </span>
                    <ul className="inline-flex items-center -space-x-px">
                      <li>
                        <a
                          className="px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-surface-dark dark:border-border-dark dark:text-gray-400 dark:hover:bg-background-dark dark:hover:text-white flex items-center"
                          href="#"
                        >
                          Previous
                        </a>
                      </li>
                      <li>
                        <a
                          className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-surface-dark dark:border-border-dark dark:text-gray-400 dark:hover:bg-background-dark dark:hover:text-white flex items-center"
                          href="#"
                        >
                          1
                        </a>
                      </li>
                      <li>
                        <a
                          className="px-3 h-8 leading-tight text-white bg-primary border border-primary dark:bg-primary dark:border-primary dark:text-white flex items-center"
                          href="#"
                        >
                          2
                        </a>
                      </li>
                      <li>
                        <a
                          className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-surface-dark dark:border-border-dark dark:text-gray-400 dark:hover:bg-background-dark dark:hover:text-white flex items-center"
                          href="#"
                        >
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AdminLayout>
    );
  }

  // Version 1 Layout (default - existing implementation)
  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">User Management</h1>
          <Link
            href="/admin"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
          >
              Back to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Buyers</div>
            <div className="text-3xl font-bold text-blue-400">{buyers.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Sellers</div>
            <div className="text-3xl font-bold text-green-400">{sellers.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Creators</div>
              <div className="text-3xl font-bold text-purple-400">
                {users.filter((u) => u.role === 'creator').length}
              </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Admins</div>
              <div className="text-3xl font-bold text-red-400">
                {users.filter((u) => u.role === 'admin').length}
              </div>
          </div>
        </div>

        {/* User List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">KYC Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Registration Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.full_name || 'User'}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                            {(user.full_name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                            <div className="font-semibold">{user.full_name || 'Unknown User'}</div>
                          <div className="text-sm text-gray-400">{user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            user.role === 'admin'
                              ? 'bg-red-900 text-red-300'
                              : user.role === 'seller'
                                ? 'bg-green-900 text-green-300'
                                : user.role === 'creator'
                                  ? 'bg-purple-900 text-purple-300'
                                  : 'bg-blue-900 text-blue-300'
                          }`}
                        >
                        {user.role === 'admin' && 'Admin'}
                          {user.role === 'seller' && 'Seller'}
                          {user.role === 'creator' && 'Creator'}
                          {user.role === 'buyer' && 'Buyer'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.kyc_status === 'verified'
                              ? 'bg-green-900 text-green-300'
                              : user.kyc_status === 'rejected'
                                ? 'bg-red-900 text-red-300'
                                : 'bg-yellow-900 text-yellow-300'
                          }`}
                        >
                          {user.kyc_status === 'verified' && '✓ Verified'}
                          {user.kyc_status === 'rejected' && '✗ Rejected'}
                          {user.kyc_status === 'pending' && '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                          Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </main>
    </AdminLayout>
  );
}
