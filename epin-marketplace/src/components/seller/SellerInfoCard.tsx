'use client';

import Link from 'next/link';

interface SellerInfoCardProps {
  rating: number;
  reviewCount: number;
  description?: string;
  productsSold: number;
  yearsOnPlatform: number;
  followers: number;
}

export default function SellerInfoCard({
  rating,
  reviewCount,
  description,
  productsSold,
  yearsOnPlatform,
  followers,
}: SellerInfoCardProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="material-symbols-outlined !text-xl text-[#FFD700]">
          star
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="material-symbols-outlined !text-xl text-[#FFD700]">
          star_half
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="material-symbols-outlined !text-xl text-[#FFD700] opacity-30">
          star
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="bg-[#223d49] p-6 rounded-lg">
      <h3 className="text-white font-bold text-lg mb-4">Seller Information</h3>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex text-[#FFD700]">{renderStars(rating)}</div>
        <p className="text-white font-bold">
          {rating} <span className="text-[#90b8cb] font-normal">({reviewCount.toLocaleString()} reviews)</span>
        </p>
      </div>
      {description && <p className="text-[#90b8cb] text-sm mb-4">{description}</p>}
      <div className="border-t border-[#315768] pt-4 flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#90b8cb]">Products Sold</span>
          <span className="text-white font-semibold">{productsSold.toLocaleString()}+</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#90b8cb]">Years on Platform</span>
          <span className="text-white font-semibold">{yearsOnPlatform}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#90b8cb]">Followers</span>
          <span className="text-white font-semibold">{followers.toLocaleString()}</span>
        </div>
      </div>
      <div className="border-t border-[#315768] mt-4 pt-4 flex flex-col gap-2">
        <Link className="text-primary hover:underline text-sm font-semibold" href="#">
          Seller Policies
        </Link>
        <Link className="text-primary hover:underline text-sm font-semibold" href="#">
          Contact Seller
        </Link>
        <Link className="text-red-400 hover:underline text-sm font-semibold" href="#">
          Report Store
        </Link>
      </div>
    </div>
  );
}

