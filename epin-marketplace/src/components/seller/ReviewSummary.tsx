'use client';

interface ReviewSummaryProps {
  rating: number;
  reviewCount: number;
  ratingBreakdown: { stars: number; percentage: number }[];
}

export default function ReviewSummary({ rating, reviewCount, ratingBreakdown }: ReviewSummaryProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="material-symbols-outlined text-[#FFD700]">
          star
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="material-symbols-outlined text-[#FFD700]">
          star_half
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="material-symbols-outlined text-[#FFD700] opacity-30">
          star
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="w-full md:w-1/3">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-4xl text-white font-bold">{rating}</h4>
        <div>
          <div className="flex text-[#FFD700]">{renderStars(rating)}</div>
          <p className="text-[#90b8cb] text-sm">Based on {reviewCount.toLocaleString()} reviews</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {ratingBreakdown.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="text-[#90b8cb]">{item.stars} star</span>
            <div className="w-full bg-[#315768] rounded-full h-2">
              <div
                className="bg-[#FFD700] h-2 rounded-full transition-all"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-white w-8 text-right">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

