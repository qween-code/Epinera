'use client';

import { useWishlist } from '@/lib/wishlist/WishlistContext';

export default function WishlistButton({ productId }: { productId: string }) {
  const { isInWishlist, addToWishlist, removeFromWishlist, loading } = useWishlist();
  const wishlisted = isInWishlist(productId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
        wishlisted
          ? 'bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)] shadow-[var(--glow-magenta-sm)]'
          : 'bg-void/60 text-gray-400 hover:text-[var(--neon-magenta)]'
      }`}
      aria-label={wishlisted ? 'İstek listesinden çıkar' : 'İstek listesine ekle'}
    >
      <svg
        className="w-4 h-4"
        fill={wishlisted ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
