'use client';

interface StorefrontProfileProps {
  storeName: string;
  storeDescription?: string;
  logoUrl?: string;
  isVerified?: boolean;
  onFollow?: () => void;
  isFollowing?: boolean;
}

export default function StorefrontProfile({
  storeName,
  storeDescription,
  logoUrl,
  isVerified = false,
  onFollow,
  isFollowing = false,
}: StorefrontProfileProps) {
  return (
    <div className="px-4 -mt-24">
      <div className="flex w-full flex-col gap-4 @container md:flex-row md:justify-between md:items-end">
        <div className="flex gap-4 items-end">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-[#101d23] shadow-lg"
            data-alt={`${storeName} store logo`}
            style={{
              backgroundImage: logoUrl ? `url("${logoUrl}")` : 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + storeName + '")',
            }}
          />
          <div className="flex flex-col justify-center pb-2">
            <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] flex items-center gap-2">
              {storeName}
              {isVerified && (
                <span className="material-symbols-outlined text-primary !text-2xl">verified</span>
              )}
            </p>
            {storeDescription && (
              <p className="text-[#90b8cb] text-base font-normal leading-normal">{storeDescription}</p>
            )}
          </div>
        </div>
        <button
          onClick={onFollow}
          className={`flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] md:w-auto transition-colors ${isFollowing
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-primary text-white hover:bg-primary/90'
            }`}
        >
          <span className="truncate">{isFollowing ? 'Unfollow' : 'Follow'}</span>
        </button>
      </div>
    </div>
  );
}

