'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface ModerationItem {
  id: string;
  item_id: string;
  item_type: 'review' | 'product' | 'forum_post';
  user_id: string;
  user_name: string;
  reason: string;
  flagged_by: 'ai' | 'user';
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  content?: string;
  ai_confidence?: number;
}

export default function AdminContentModerationPage() {
  const router = useRouter();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'ai_flagged' | 'manual_review' | 'user_reports' | 'appeals' | 'approved' | 'rejected'>('ai_flagged');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/admin/content');
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

        // Fetch moderation items from reviews, products, and forum_posts
        // For now, we'll use a combination of reviews with moderation_status and products
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select(`
            id,
            comment,
            created_at,
            user_id,
            product_id,
            profiles!reviews_user_id_fkey (
              full_name
            )
          `)
          .or('comment.ilike.%spam%,comment.ilike.%profanity%,comment.ilike.%hate%')
          .limit(50);

        const { data: productsData } = await supabase
          .from('products')
          .select(`
            id,
            title,
            description,
            created_at,
            seller_id,
            profiles!products_seller_id_fkey (
              full_name
            )
          `)
          .or('title.ilike.%spam%,description.ilike.%spam%')
          .limit(50);

        const mappedItems: ModerationItem[] = [];

        // Map reviews
        (reviewsData || []).forEach((review: any) => {
          mappedItems.push({
            id: review.id,
            item_id: `Review #${review.id.substring(0, 5)}`,
            item_type: 'review',
            user_id: review.user_id,
            user_name: review.profiles?.full_name || 'Unknown',
            reason: 'AI: Profanity',
            flagged_by: 'ai',
            date: review.created_at,
            status: 'pending',
            content: review.comment,
            ai_confidence: 85,
          });
        });

        // Map products
        (productsData || []).forEach((product: any) => {
          mappedItems.push({
            id: product.id,
            item_id: `Product #${product.id.substring(0, 5)}`,
            item_type: 'product',
            user_id: product.seller_id,
            user_name: product.profiles?.full_name || 'Unknown',
            reason: 'User Report: Spam',
            flagged_by: 'user',
            date: product.created_at,
            status: 'pending',
            content: product.description || product.title,
            ai_confidence: 90,
          });
        });

        // Sort by date
        mappedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setItems(mappedItems);
        if (mappedItems.length > 0 && !selectedItem) {
          setSelectedItem(mappedItems[0]);
        }
      } catch (error) {
        console.error('Error fetching moderation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router, selectedItem]);

  const handleApprove = async (itemId: string) => {
    try {
      // Update moderation status in database
      // This would update the review/product/forum_post moderation_status
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: 'approved' } : item)));
      if (selectedItem?.id === itemId) {
        setSelectedItem((prev) => (prev ? { ...prev, status: 'approved' } : null));
      }
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };

  const handleReject = async (itemId: string, reason: string) => {
    try {
      // Update moderation status in database
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: 'rejected' } : item)));
      if (selectedItem?.id === itemId) {
        setSelectedItem((prev) => (prev ? { ...prev, status: 'rejected' } : null));
      }
    } catch (error) {
      console.error('Error rejecting item:', error);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.item_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeFilter === 'ai_flagged') {
      return matchesSearch && item.flagged_by === 'ai' && item.status === 'pending';
    }
    if (activeFilter === 'manual_review') {
      return matchesSearch && item.status === 'pending';
    }
    if (activeFilter === 'user_reports') {
      return matchesSearch && item.flagged_by === 'user';
    }
    if (activeFilter === 'approved') {
      return matchesSearch && item.status === 'approved';
    }
    if (activeFilter === 'rejected') {
      return matchesSearch && item.status === 'rejected';
    }
    return matchesSearch;
  });

  const getReasonBadge = (reason: string, flaggedBy: string) => {
    if (reason.includes('Profanity') || reason.includes('Hate Speech')) {
      return 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300';
    }
    if (reason.includes('Spam')) {
      return 'bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
    }
    return 'bg-gray-200 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return 'bg-status-green/20 text-status-green';
    }
    if (status === 'rejected') {
      return 'bg-status-red/20 text-status-red';
    }
    return 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
  };

  const aiFlaggedCount = items.filter((item) => item.flagged_by === 'ai' && item.status === 'pending').length;
  const manualReviewCount = items.filter((item) => item.status === 'pending').length;

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      {/* SideNavBar */}
      <aside className="flex w-64 flex-col bg-gray-100/50 dark:bg-background-dark/50 p-4 border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="Admin profile picture"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD33QDAHA2jV_Vle2Ona4VBRStH81qUxkpbLRTcxAIPGia2ZnerRgo9qdkm_o8apQQKv3OUzorsATHOwBvf8wjRGBls-eKp-cSyQkp2T320AN8Kx31uF4BE4CZ9dmMzkk-8b3juN2qhRh5JS40MPOsFRYutKvTzEAYXU6HQDgsL_8wSaEEh-Gjl4tLEveP36EmSCK87zKe7fxTWLhiOu9J1afYK_T3oVQTI2zJ9ReSYx3R3OwR18SFr9Tdu3PlDOdJ7Dkg2GAwE1oqa")',
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">Admin Fatma</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Platform Manager</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <button
              onClick={() => setActiveFilter('ai_flagged')}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg ${
                activeFilter === 'ai_flagged'
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">spark</span>
                <p className="text-sm font-medium leading-normal">AI Flagged</p>
              </div>
              <span className="text-xs font-semibold bg-status-yellow text-white px-2 py-0.5 rounded-full">
                {aiFlaggedCount}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('manual_review')}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg ${
                activeFilter === 'manual_review'
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">visibility</span>
                <p className="text-sm font-medium leading-normal">Manual Review</p>
              </div>
              <span className="text-xs font-semibold bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full">
                {manualReviewCount}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('user_reports')}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg ${
                activeFilter === 'user_reports'
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">flag</span>
                <p className="text-sm font-medium leading-normal">User Reports</p>
              </div>
            </button>
            <button
              onClick={() => setActiveFilter('appeals')}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg ${
                activeFilter === 'appeals'
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">gavel</span>
                <p className="text-sm font-medium leading-normal">Appeals</p>
              </div>
            </button>
            <div className="my-2 border-t border-gray-200 dark:border-gray-800"></div>
            <button
              onClick={() => setActiveFilter('approved')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activeFilter === 'approved'
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="material-symbols-outlined text-xl">check_circle</span>
              <p className="text-sm font-medium leading-normal">Approved</p>
            </button>
            <button
              onClick={() => setActiveFilter('rejected')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activeFilter === 'rejected'
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="material-symbols-outlined text-xl">cancel</span>
              <p className="text-sm font-medium leading-normal">Rejected</p>
            </button>
          </div>
        </div>
        <div className="mt-auto">
          <Link
            href="/admin/audit-logs"
            className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-white/20"
          >
            <span className="truncate">View Audit Logs</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Panel */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-col p-6 space-y-4 flex-1 overflow-y-auto">
          {/* PageHeading */}
          <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Content & Product Moderation
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4">
            {/* SearchBar */}
            <div className="w-full">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-gray-400 dark:text-gray-500 flex bg-gray-100 dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg">
                    <span className="material-symbols-outlined text-2xl">search</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-gray-100 dark:bg-gray-900/50 focus:border-none h-full placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    placeholder="Search by Item ID, User, or Keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>
            {/* Chips */}
            <div className="flex gap-2 flex-wrap">
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-200 dark:bg-gray-800 pl-3 pr-2">
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Content Type: All</p>
                <span className="material-symbols-outlined text-lg text-gray-600 dark:text-gray-400">expand_more</span>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-200 dark:bg-gray-800 pl-3 pr-2">
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Status: Pending</p>
                <span className="material-symbols-outlined text-lg text-gray-600 dark:text-gray-400">expand_more</span>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-200 dark:bg-gray-800 pl-3 pr-2">
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Date Range: Last 7 Days</p>
                <span className="material-symbols-outlined text-lg text-gray-600 dark:text-gray-400">expand_more</span>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-200 dark:bg-gray-800 pl-3 pr-2">
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Sort By: Newest</p>
                <span className="material-symbols-outlined text-lg text-gray-600 dark:text-gray-400">expand_more</span>
              </button>
            </div>
          </div>

          {/* Bulk Actions Toolbar */}
          {selectedItems.size > 0 && (
            <div className="flex justify-between gap-2 p-3 bg-primary/20 rounded-lg border border-primary/30">
              <div className="flex items-center gap-2">
                <input
                  className="form-checkbox h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                  type="checkbox"
                  checked={selectedItems.size > 0}
                  onChange={() => setSelectedItems(new Set())}
                />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {selectedItems.size} items selected
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20 hover:text-primary">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </button>
                <button className="p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20 hover:text-primary">
                  <span className="material-symbols-outlined text-2xl">cancel</span>
                </button>
                <button className="p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20 hover:text-primary">
                  <span className="material-symbols-outlined text-2xl">person_add</span>
                </button>
                <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4">
                  <span className="truncate">Bulk Actions</span>
                  <span className="material-symbols-outlined text-xl">expand_more</span>
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-900/50 text-xs text-gray-500 dark:text-gray-400 uppercase">
                <tr>
                  <th className="p-4" scope="col">
                    <input
                      className="form-checkbox h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                      type="checkbox"
                      checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(new Set(filteredItems.map((item) => item.id)));
                        } else {
                          setSelectedItems(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3" scope="col">Item</th>
                  <th className="px-6 py-3" scope="col">User</th>
                  <th className="px-6 py-3" scope="col">Reason</th>
                  <th className="px-6 py-3" scope="col">Date</th>
                  <th className="px-6 py-3" scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Loading moderation items...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No items found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer ${
                        selectedItem?.id === item.id
                          ? 'bg-primary/10 ring-2 ring-primary'
                          : 'bg-gray-50 dark:bg-gray-900'
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="w-4 p-4">
                        <input
                          className="form-checkbox h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            const newSelected = new Set(selectedItems);
                            if (e.target.checked) {
                              newSelected.add(item.id);
                            } else {
                              newSelected.delete(item.id);
                            }
                            setSelectedItems(newSelected);
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.item_id}</td>
                      <td className="px-6 py-4">{item.user_name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${getReasonBadge(item.reason, item.flagged_by)}`}
                        >
                          {item.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4">{format(new Date(item.date), 'yyyy-MM-dd')}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detail & Action Panel */}
      {selectedItem && (
        <aside className="flex w-96 flex-col bg-gray-100/50 dark:bg-background-dark/50 p-6 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {/* User Information Card */}
            <div className="p-4 bg-gray-200 dark:bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Submitter</h3>
              <div className="flex items-center gap-3">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                  data-alt="User profile picture"
                  style={{
                    backgroundImage: `url("https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedItem.user_name}")`,
                  }}
                />
                <div className="flex flex-col">
                  <Link
                    href={`/store/${selectedItem.user_name}`}
                    className="text-gray-900 dark:text-white text-base font-semibold leading-normal hover:underline"
                  >
                    {selectedItem.user_name}
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Reputation: 4.8 ★</p>
                </div>
              </div>
            </div>

            {/* Moderation Context */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Moderation Context</h3>
              <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <p>
                  <strong className="font-medium text-gray-800 dark:text-gray-200">Flagged by:</strong>{' '}
                  {selectedItem.flagged_by === 'ai' ? 'AI' : 'User Report'}
                </p>
                <p>
                  <strong className="font-medium text-gray-800 dark:text-gray-200">Reason:</strong>{' '}
                  <span className="bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded-full">
                    {selectedItem.reason}
                  </span>
                </p>
                <p>
                  <strong className="font-medium text-gray-800 dark:text-gray-200">Submission Date:</strong>{' '}
                  {format(new Date(selectedItem.date), 'MMMM d, yyyy')}
                </p>
                {selectedItem.ai_confidence && (
                  <p>
                    <strong className="font-medium text-gray-800 dark:text-gray-200">AI Confidence:</strong>{' '}
                    {selectedItem.ai_confidence}% ({selectedItem.reason.split(':')[1]?.trim() || 'Flagged'})
                  </p>
                )}
                <Link href={`/admin/audit-logs?item=${selectedItem.id}`} className="text-primary hover:underline font-medium">
                  View Moderation History
                </Link>
              </div>
            </div>

            {/* Content Preview */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Content Preview ({selectedItem.item_id})</h3>
              <div className="p-4 bg-gray-200 dark:bg-gray-900/50 rounded-lg space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  {selectedItem.item_type === 'product' ? '💎 ' : ''}
                  {selectedItem.content?.substring(0, 50) || selectedItem.item_id}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedItem.content || 'No content available'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Actions</h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleApprove(selectedItem.id)}
                  className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-status-green text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2"
                >
                  <span className="material-symbols-outlined text-xl">check</span>
                  <span className="truncate">Approve</span>
                </button>
                <button
                  onClick={() => handleReject(selectedItem.id, 'Spam / Unsolicited Promotion')}
                  className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-status-red text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                  <span className="truncate">Reject</span>
                </button>
                <button className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2">
                  <span className="material-symbols-outlined text-xl">edit</span>
                  <span className="truncate">Edit Content</span>
                </button>
              </div>
            </div>

            {/* Rejection Reason */}
            <div className="flex flex-col gap-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="rejection-reason">
                Rejection Reason
              </label>
              <select
                className="form-select w-full rounded-lg bg-gray-200 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-200"
                id="rejection-reason"
              >
                <option>Select a reason...</option>
                <option>Spam / Unsolicited Promotion</option>
                <option>Hate Speech</option>
                <option>Off-topic</option>
                <option>Scam / Fraudulent</option>
              </select>
              <textarea
                className="form-textarea w-full rounded-lg bg-gray-200 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-200"
                placeholder="Add custom notes (optional)..."
                rows={3}
              />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

