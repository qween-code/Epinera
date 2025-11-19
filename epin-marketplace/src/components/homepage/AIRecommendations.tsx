'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAIRecommendations } from '@/app/actions/homepage';

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    currency: string;
    image: string;
    aiRecommended: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const data = await getAIRecommendations();
      setRecommendations(data);
      setLoading(false);
    };
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Recommended For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-container-dark rounded-xl overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-700"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.slug}`}
            className="bg-container-dark rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            <img
              className="w-full h-48 object-cover"
              src={item.image}
              alt={item.title}
            />
            <div className="p-4">
              <h3 className="font-bold text-white truncate">{item.title}</h3>
              <p className="text-sm text-white/60">${item.price.toFixed(2)}</p>
              {item.aiRecommended && (
                <div className="flex items-center gap-1 text-primary text-xs mt-1">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>AI Recommended</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

