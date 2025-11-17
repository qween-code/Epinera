'use client';

interface StorefrontBannerProps {
  bannerImage?: string;
}

export default function StorefrontBanner({ bannerImage }: StorefrontBannerProps) {
  return (
    <div
      className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[250px] md:min-h-80"
      data-alt="Abstract blue and purple gaming-themed banner image"
      style={{
        backgroundImage: bannerImage || 'url("https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200")',
      }}
    />
  );
}

