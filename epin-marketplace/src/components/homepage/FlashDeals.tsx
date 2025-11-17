'use client';

import Link from 'next/link';

export default function FlashDeals() {
  const deals = [
    {
      id: '1',
      title: 'Cyber Renegade 2088',
      platform: 'Steam Key',
      price: 29.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      timeLeft: '12:45:33',
    },
    {
      id: '2',
      title: "Aethelgard's Chronicle",
      platform: 'PlayStation Gift Card',
      price: 44.99,
      originalPrice: 50.0,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
      timeLeft: '08:15:10',
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Flash Deals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deals.map((deal) => (
          <Link key={deal.id} href={`/product/${deal.id}`} className="bg-container-dark rounded-xl overflow-hidden group">
            <div className="relative">
              <img
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                src={deal.image}
                alt={deal.title}
              />
              <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold py-1 px-3 rounded-full">
                ENDS IN: {deal.timeLeft}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-white">{deal.title}</h3>
              <p className="text-sm text-white/60 mb-2">{deal.platform}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-primary">${deal.price}</p>
                <p className="text-md font-medium text-white/40 line-through">${deal.originalPrice}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

