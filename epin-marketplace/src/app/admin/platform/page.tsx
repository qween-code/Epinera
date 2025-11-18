'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories_count: number;
  status: 'active' | 'disabled';
  updated_at: string;
}

export default function AdminPlatformPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'categories' | 'currency' | 'language' | 'general'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/admin/platform');
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

        // Fetch categories
        const { data: categoriesData, error } = await supabase
          .from('categories')
          .select('id, name, slug, updated_at, metadata')
          .order('name', { ascending: true });

        if (error) throw error;

        // Count subcategories for each category
        const categoriesWithCounts: Category[] = await Promise.all(
          (categoriesData || []).map(async (category: any) => {
            const { count } = await supabase
              .from('categories')
              .select('id', { count: 'exact', head: true })
              .eq('parent_id', category.id);

            return {
              id: category.id,
              name: category.name,
              slug: category.slug,
              subcategories_count: count || 0,
              status: category.metadata?.status || 'active',
              updated_at: category.updated_at,
            };
          })
        );

        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error('Error fetching platform data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (categoryId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
      const { error } = await supabase
        .from('categories')
        .update({
          metadata: { status: newStatus },
          updated_at: new Date().toISOString(),
        })
        .eq('id', categoryId);

      if (error) throw error;

      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryId ? { ...cat, status: newStatus as 'active' | 'disabled' } : cat))
      );
    } catch (error) {
      console.error('Error updating category status:', error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <div className="flex h-full w-full flex-1">
        {/* SideNavBar */}
        <aside className="flex w-64 flex-col gap-4 border-r border-slate-200/10 bg-background-light p-4 dark:bg-background-dark">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat"
                data-alt="Admin Fatma avatar"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBePOAV67pfB7i4NX989AFBaY57tpigu1CDh8zA8hYVMTIyNOa3Qp7v5_S0ViBkwPRfDVhq3__UFIUfx0tG_db7HONT_XSxnpUybErIcAEN4EAS1O0bx0uBJYPpk9uU9NjjE7THspS-UCduSyxpoWONNi6wqeBoChYWDjoRP7zxxzazUc-TjCf1ZXEI8TgP8AvwsUevWEEgockMfjK7YpZr1QnmJ_GSaHuH4_TyrYnrgUH_t_vpNHBIL46YfAKL0TNZYYAb73x7DVXl")',
                }}
              />
              <div className="flex flex-col">
                <h1 className="font-medium leading-normal text-slate-900 dark:text-white">Admin Fatma</h1>
                <p className="text-sm font-normal leading-normal text-slate-500 dark:text-[#90b8cb]">Platform Administrator</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${
                  activeTab === 'categories'
                    ? 'bg-primary/10 dark:bg-[#223d49]'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className={`material-symbols-outlined ${activeTab === 'categories' ? 'fill text-primary dark:text-white' : 'text-slate-500 dark:text-white'}`}>
                  category
                </span>
                <p className={`text-sm font-medium leading-normal ${activeTab === 'categories' ? 'text-primary dark:text-white' : 'text-slate-500 dark:text-white'}`}>
                  Categories
                </p>
              </button>
              <button
                onClick={() => setActiveTab('currency')}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${
                  activeTab === 'currency'
                    ? 'bg-primary/10 dark:bg-[#223d49]'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="material-symbols-outlined text-slate-500 dark:text-white">currency_exchange</span>
                <p className="text-sm font-medium leading-normal text-slate-500 dark:text-white">Currency</p>
              </button>
              <button
                onClick={() => setActiveTab('language')}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${
                  activeTab === 'language'
                    ? 'bg-primary/10 dark:bg-[#223d49]'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="material-symbols-outlined text-slate-500 dark:text-white">translate</span>
                <p className="text-sm font-medium leading-normal text-slate-500 dark:text-white">Language</p>
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${
                  activeTab === 'general'
                    ? 'bg-primary/10 dark:bg-[#223d49]'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="material-symbols-outlined text-slate-500 dark:text-white">settings</span>
                <p className="text-sm font-medium leading-normal text-slate-500 dark:text-white">General</p>
              </button>
            </div>
          </div>
          <div className="mt-auto">
            <Link
              href="/products"
              className="flex h-10 min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white"
            >
              <span className="truncate">View Marketplace</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {/* PageHeading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                  Manage Categories
                </p>
                <p className="text-base font-normal leading-normal text-slate-500 dark:text-[#90b8cb]">
                  Organize product categories and subcategories for the marketplace.
                </p>
              </div>
              <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white">
                <span className="material-symbols-outlined">add_circle</span>
                <span className="truncate">Add New Category</span>
              </button>
            </div>

            {/* SearchBar */}
            <div className="mt-6">
              <label className="flex h-12 w-full flex-col">
                <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
                  <div className="flex items-center justify-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 pl-4 text-slate-400 dark:border-[#315768] dark:bg-[#223d49] dark:text-[#90b8cb]">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border border-l-0 border-slate-200 bg-white px-4 text-base font-normal leading-normal text-slate-900 placeholder:text-slate-400 focus:outline-0 focus:ring-0 dark:border-[#315768] dark:bg-[#223d49] dark:text-white dark:placeholder:text-[#90b8cb]"
                    placeholder="Search for a category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>

            {/* Table */}
            <div className="mt-6 @container">
              <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-background-light dark:border-[#315768] dark:bg-background-dark">
                <table className="min-w-full flex-1">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#182b34]">
                      <th className="w-16 px-4 py-3 text-left">
                        <input
                          className="h-5 w-5 rounded border-2 border-slate-300 bg-transparent text-primary checked:border-primary checked:bg-primary focus:border-primary focus:ring-0 focus:ring-offset-0 dark:border-[#315768] dark:checked:border-primary dark:checked:bg-primary dark:focus:border-primary"
                          type="checkbox"
                          checked={selectedItems.size === filteredCategories.length && filteredCategories.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(new Set(filteredCategories.map((cat) => cat.id)));
                            } else {
                              setSelectedItems(new Set());
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium leading-normal text-slate-600 dark:text-white">Category Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium leading-normal text-slate-600 dark:text-white">Subcategories</th>
                      <th className="px-4 py-3 text-left text-sm font-medium leading-normal text-slate-600 dark:text-white">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium leading-normal text-slate-600 dark:text-white">Last Updated</th>
                      <th className="px-4 py-3 text-left text-sm font-medium leading-normal text-slate-600 dark:text-[#90b8cb]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-slate-500 dark:text-[#90b8cb]">
                          Loading categories...
                        </td>
                      </tr>
                    ) : filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-slate-500 dark:text-[#90b8cb]">
                          No categories found.
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((category) => (
                        <tr key={category.id} className="border-t border-t-slate-200/80 dark:border-t-[#315768]">
                          <td className="h-[72px] px-4 py-2 text-center text-sm font-normal leading-normal">
                            <input
                              className="h-5 w-5 rounded border-2 border-slate-300 bg-transparent text-primary checked:border-primary checked:bg-primary focus:border-primary focus:ring-0 focus:ring-offset-0 dark:border-[#315768] dark:checked:border-primary dark:checked:bg-primary dark:focus:border-primary"
                              type="checkbox"
                              checked={selectedItems.has(category.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedItems);
                                if (e.target.checked) {
                                  newSelected.add(category.id);
                                } else {
                                  newSelected.delete(category.id);
                                }
                                setSelectedItems(newSelected);
                              }}
                            />
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal text-slate-800 dark:text-white">{category.name}</td>
                          <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal text-slate-500 dark:text-[#90b8cb]">
                            {category.subcategories_count}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                            <div
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                                category.status === 'active'
                                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400'
                                  : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className={`size-2 rounded-full ${category.status === 'active' ? 'bg-teal-500' : 'bg-slate-500'}`}></div>
                              {category.status === 'active' ? 'Active' : 'Disabled'}
                            </div>
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal text-slate-500 dark:text-[#90b8cb]">
                            {format(new Date(category.updated_at), 'yyyy-MM-dd')}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm font-bold leading-normal tracking-[0.015em]">
                            <button className="flex items-center gap-2 font-medium text-primary hover:underline">
                              <span className="material-symbols-outlined text-lg">edit</span>
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-[#90b8cb]">
                Showing 1 to {filteredCategories.length} of {categories.length} entries
              </p>
              <div className="flex items-center justify-center">
                <a className="flex size-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800/50" href="#">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </a>
                <a className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold leading-normal tracking-[0.015em] text-primary dark:bg-[#223d49] dark:text-white" href="#">
                  1
                </a>
                <a className="flex size-10 items-center justify-center rounded-lg text-sm font-normal leading-normal text-slate-500 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800/50" href="#">
                  2
                </a>
                <a className="flex size-10 items-center justify-center rounded-lg text-sm font-normal leading-normal text-slate-500 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800/50" href="#">
                  3
                </a>
                <span className="flex size-10 items-center justify-center rounded-lg text-sm font-normal leading-normal text-slate-500 dark:text-white" href="#">
                  ...
                </span>
                <a className="flex size-10 items-center justify-center rounded-lg text-sm font-normal leading-normal text-slate-500 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800/50" href="#">
                  8
                </a>
                <a className="flex size-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800/50" href="#">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

