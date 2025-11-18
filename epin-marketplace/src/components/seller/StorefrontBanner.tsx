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
        backgroundImage: bannerImage || 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD9sjvyfNp9DmlY16IpF3p7mP0H1HYQ_hje8Eaj9ipJLFtenScjB0NkMgekJUIfT8SPl-QbvOnjuaUgnCgQ7o8U9t9V89ZO6d5cWQst-TvC_ePR-1dGjYjrshZ3WYZZ0SZV62KszE2B7xVohASmiUzse_V38Xienl4pUjh01H-0aveVgIr_TWO8PWTcdUGBdGrN0-jmcAJz1F8K2s7dQta7iL2A0Q56-VMfbhNz1_pLSxzKV4pY0IKkR9of3mdjDY4NV8GqPb0d1PuY")',
      }}
    />
  );
}

