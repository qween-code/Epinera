'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getFlashDeals } from '@/app/actions/homepage';

export default function FlashDeals() {
  const [deals, setDeals] = useState<Array<{
    id: string;
    title: string;
    slug: string;
    platform: string;
    price: number;
    originalPrice: number;
    image: string;
    timeLeft: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      const data = await getFlashDeals();
      setDeals(data);
      setLoading(false);
    };
    fetchDeals();
  }, []);

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Flash Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-container-dark rounded-xl overflow-hidden animate-pulse">
              <div className="w-full h-40 bg-gray-700"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (deals.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Flash Deals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deals.map((deal) => (
          <Link key={deal.id} href={`/product/${deal.slug}`} className="bg-container-dark rounded-xl overflow-hidden group">
            <div className="relative">
              <img
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                src={deal.image}
                alt={deal.title}
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                ENDS IN: {deal.timeLeft}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-white">{deal.title}</h3>
              <p className="text-sm text-white/60 mb-2">{deal.platform}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-primary">${deal.price.toFixed(2)}</p>
                {deal.originalPrice > deal.price && (
                  <p className="text-md font-medium text-white/40 line-through">${deal.originalPrice.toFixed(2)}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

