import Link from 'next/link';

interface SellerInfoBlockProps {
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    salesCount: number;
    isVerified: boolean;
    deliveryTime?: string;
  };
}

export default function SellerInfoBlock({ seller }: SellerInfoBlockProps) {
  return (
    <div className="p-6 bg-gray-100 dark:bg-white/5 rounded-xl">
      <h3 className="text-black dark:text-white text-lg font-bold mb-4">Seller Information</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
          style={{
            backgroundImage: seller.avatar
              ? `url(${seller.avatar})`
              : 'url(/placeholder-avatar.jpg)',
          }}
          role="img"
          aria-label="Seller avatar"
        />
        <div>
          <p className="text-black dark:text-white font-bold">{seller.name}</p>
          <Link
            href={`/seller/${seller.id}`}
            className="text-primary text-sm hover:underline"
          >
            View Storefront
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-2 text-black dark:text-white">
          <span className="material-symbols-outlined text-lg text-amber-500">star</span>
          {seller.rating}/5 Rating
        </div>
        <div className="flex items-center gap-2 text-black dark:text-white">
          <span className="material-symbols-outlined text-lg text-primary">local_shipping</span>
          {seller.deliveryTime || 'Instant Delivery'}
        </div>
        <div className="flex items-center gap-2 text-black dark:text-white">
          <span className="material-symbols-outlined text-lg text-primary">shopping_bag</span>
          {seller.salesCount.toLocaleString()}+ Sales
        </div>
        {seller.isVerified && (
          <div className="flex items-center gap-2 text-black dark:text-white">
            <span className="material-symbols-outlined text-lg text-emerald-500">verified_user</span>
            Verified Seller
          </div>
        )}
      </div>
    </div>
  );
}

