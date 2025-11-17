'use client';

import Link from 'next/link';

export default function AIRecommendations() {
  const recommendations = [
    {
      id: '1',
      title: 'Neon Racer',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
      aiRecommended: true,
    },
    {
      id: '2',
      title: 'Galaxy Wanderer',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
      aiRecommended: false,
    },
    {
      id: '3',
      title: 'Project Vanguard',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      aiRecommended: false,
    },
  ];

  return (
    <section>
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="bg-container-dark rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            <img
              className="w-full h-48 object-cover"
              src={item.image}
              alt={item.title}
            />
            <div className="p-4">
              <h3 className="font-bold text-white truncate">{item.title}</h3>
              <p className="text-sm text-white/60">${item.price}</p>
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

