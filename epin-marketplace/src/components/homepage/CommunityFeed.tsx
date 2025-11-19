'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCommunityFeed } from '@/app/actions/homepage';

export default function CommunityFeed() {
  const [feedItems, setFeedItems] = useState<Array<{
    id: string;
    type: string;
    user: string;
    action: string;
    target: string;
    excerpt: string;
    time: string;
    timeAgo?: string;
    avatar: string;
    link: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      const data = await getCommunityFeed();
      setFeedItems(data);
      setLoading(false);
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <aside className="lg:col-span-1">
        <div className="bg-container-dark rounded-xl p-6 sticky top-24">
          <h2 className="text-white text-xl font-bold mb-4">Community Feed</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="size-10 rounded-full bg-gray-700"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  if (feedItems.length === 0) {
    return null;
  }

  return (
    <aside className="lg:col-span-1">
      <div className="bg-container-dark rounded-xl p-6 sticky top-24">
        <h2 className="text-white text-xl font-bold mb-4">Community Feed</h2>
        <div className="space-y-6">
          {feedItems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="flex items-start gap-4 hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <div
                className="size-10 rounded-full object-cover bg-center bg-no-repeat bg-cover flex-shrink-0"
                style={{ backgroundImage: `url("${item.avatar}")` }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-bold text-primary">{item.user}</span> {item.action}{' '}
                  {item.target && <span className="font-semibold">{item.target}</span>}
                </p>
                <p className="text-xs text-white/50 mt-1 line-clamp-2">{item.excerpt}</p>
                <p className="text-xs text-white/40 mt-1">{item.timeAgo || item.time}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

