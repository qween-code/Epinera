'use client';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`material-symbols-outlined !text-base ${
            i < rating ? 'text-[#FFD700]' : 'text-[#FFD700] opacity-30'
          }`}
        >
          star
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="border-b border-[#315768] pb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
            data-alt={`${review.userName} avatar image`}
            style={{
              backgroundImage: review.userAvatar || 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + review.userName + '")',
            }}
          />
          <h5 className="font-bold text-white">{review.userName}</h5>
        </div>
        <span className="text-sm text-[#90b8cb]">{formatDate(review.date)}</span>
      </div>
      <div className="flex text-[#FFD700] mb-2 ml-11">{renderStars(review.rating)}</div>
      <p className="text-[#90b8cb] text-sm ml-11">{review.comment}</p>
    </div>
  );
}

