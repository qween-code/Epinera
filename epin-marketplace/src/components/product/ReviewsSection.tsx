'use client';

interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsSectionProps {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    [key: number]: number; // rating -> count
  };
  reviews: Review[];
}

export default function ReviewsSection({
  averageRating,
  totalReviews,
  ratingBreakdown,
  reviews,
}: ReviewsSectionProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`material-symbols-outlined ${
          i < Math.floor(rating)
            ? 'text-amber-500'
            : i < rating
            ? 'text-amber-500'
            : 'text-gray-400 dark:text-gray-600'
        }`}
      >
        {i < Math.floor(rating) ? 'star' : i < rating ? 'star_half' : 'star'}
      </span>
    ));
  };

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
        Customer Reviews & Ratings
      </h2>

      {/* Rating Summary */}
      <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-5xl font-black text-black dark:text-white">{averageRating.toFixed(1)}</p>
          <div className="flex text-amber-500">{renderStars(averageRating)}</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Based on {totalReviews.toLocaleString()} reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="w-full flex-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingBreakdown[rating] || 0;
            const percentage = getPercentage(count);
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-right">{rating}</span>
                <span className="material-symbols-outlined text-amber-500 text-base">star</span>
                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-500 dark:text-gray-400 w-12 text-right">
                  {count.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="mt-6 flex flex-col gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 dark:border-white/10 pb-6 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: review.reviewer.avatar
                    ? `url(${review.reviewer.avatar})`
                    : 'url(https://api.dicebear.com/7.x/avataaars/svg?seed=default)',
                }}
                role="img"
                aria-label="Reviewer avatar"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-black dark:text-white">{review.reviewer.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                </div>
                <div className="flex text-amber-500 -ml-1">{renderStars(review.rating)}</div>
              </div>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

