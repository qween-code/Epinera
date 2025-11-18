'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPublishers = async () => {
      setLoading(true);
      try {
        // Fetch publishers from profiles where role is publisher or seller
        // For now, we'll use sellers as publishers
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, bio')
          .not('full_name', 'is', null)
          .order('full_name', { ascending: true })
          .limit(50);

        if (error) throw error;

        // Map profiles to publishers format
        const publishersData = (profiles || []).map((profile) => ({
          id: profile.id,
          name: profile.full_name,
          avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || '')}&size=128&background=0ba3ea&color=fff`,
          bio: profile.bio || '',
          productCount: 0, // Will be fetched separately
        }));

        // Fetch product counts for each publisher
        for (const publisher of publishersData) {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', publisher.id)
            .eq('status', 'active');
          publisher.productCount = count || 0;
        }

        // Filter out publishers with no products
        const publishersWithProducts = publishersData.filter((p) => p.productCount > 0);

        setPublishers(publishersWithProducts);
      } catch (error) {
        console.error('Error fetching publishers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishers();
  }, [supabase]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <Header />
      <main className="px-4 sm:px-10 lg:px-20 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium leading-normal" href="/">
              Home
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
            <span className="text-black dark:text-white text-sm font-medium leading-normal">Publishers</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Publishers
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                Browse products from trusted publishers
              </p>
            </div>
          </div>

          {/* Publishers Grid */}
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              Loading publishers...
            </div>
          ) : publishers.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              No publishers found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {publishers.map((publisher) => (
                <Link
                  key={publisher.id}
                  href={`/store/${publisher.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-6 hover:border-primary transition-colors"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div
                      className="size-24 rounded-full bg-center bg-no-repeat bg-cover"
                      style={{ backgroundImage: `url('${publisher.avatar}')` }}
                    />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-black dark:text-white text-lg font-bold leading-tight">
                        {publisher.name}
                      </h3>
                      {publisher.bio && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">
                          {publisher.bio}
                        </p>
                      )}
                      <p className="text-primary text-sm font-medium leading-normal mt-2">
                        {publisher.productCount} {publisher.productCount === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

