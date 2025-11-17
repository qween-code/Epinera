'use client';

import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productTitle: string;
}

export default function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const mainImage = images[selectedImage] || images[0] || '/placeholder-game.jpg';
  const thumbnails = images.slice(0, 5);
  const remainingCount = images.length > 5 ? images.length - 5 : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Hero Image */}
      <div
        className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-gray-200 dark:bg-white/5 rounded-xl aspect-video"
        style={{
          backgroundImage: `url(${mainImage})`,
        }}
        role="img"
        aria-label={`Hero image of ${productTitle}`}
      >
        {/* Optional overlay for text */}
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-5 gap-4">
        {thumbnails.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-full bg-center bg-no-repeat bg-cover rounded-lg aspect-video border-2 transition-all ${
              selectedImage === index
                ? 'border-primary opacity-100'
                : 'border-transparent opacity-50 hover:opacity-75'
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
            aria-label={`Thumbnail ${index + 1} of ${productTitle}`}
          />
        ))}
        {remainingCount > 0 && (
          <div className="w-full bg-black/20 rounded-lg aspect-video flex items-center justify-center text-black dark:text-white font-bold">
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}

