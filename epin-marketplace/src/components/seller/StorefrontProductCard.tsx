'use client';

import { useCart } from '@/lib/cart/CartContext';

interface StorefrontProductCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  platform?: string;
  price: number;
  currency: string;
  slug?: string;
  variantId?: string;
}

export default function StorefrontProductCard({
  id,
  title,
  imageUrl,
  platform,
  price,
  currency,
  slug,
  variantId,
}: StorefrontProductCardProps) {
  const { addToCart } = useCart();

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = () => {
    if (variantId) {
      addToCart(variantId, 1);
    }
  };

  return (
    <div className="bg-[#223d49] rounded-lg overflow-hidden flex flex-col group">
      <div
        className="w-full h-40 bg-cover bg-center"
        data-alt={`${title} banner`}
        style={{
          backgroundImage: imageUrl || 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400")',
        }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-white font-bold text-base mb-1">{title}</h4>
        {platform && <p className="text-[#90b8cb] text-sm mb-4">Platform: {platform}</p>}
        <div className="mt-auto flex justify-between items-center">
          <p className="text-white text-lg font-bold">{formatPrice(price, currency)} Credits</p>
          <button
            onClick={handleAddToCart}
            className="bg-primary text-white rounded-lg h-9 px-4 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/90"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

