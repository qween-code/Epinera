'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

export default function ImageUpload({
  onImagesChange,
  existingImages = [],
  maxImages = 5,
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`En fazla ${maxImages} resim yükleyebilirsiniz.`);
      return;
    }

    const fileArray = Array.from(files).slice(0, remainingSlots);
    const newImages: string[] = [];

    fileArray.forEach((file) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert(`Geçersiz dosya tipi: ${file.name}. Sadece JPG, PNG, WEBP ve GIF desteklenir.`);
        return;
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`${file.name} dosyası çok büyük. Maksimum boyut 5MB.`);
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        newImages.push(dataUrl);

        if (newImages.length === fileArray.length) {
          const updatedImages = [...images, ...newImages];
          setImages(updatedImages);
          onImagesChange(updatedImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-300
          ${
            isDragging
              ? 'border-cyan bg-cyan/10 neo-inset-sm'
              : 'border-magenta/30 hover:border-magenta hover:bg-magenta/5'
          }
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileInput}
          disabled={images.length >= maxImages}
          className="hidden"
        />

        <div className="space-y-2">
          <svg
            className="w-12 h-12 mx-auto text-cyan"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <div className="text-sm text-gray-300">
            <span className="text-cyan font-medium">Tıklayın</span> veya resimleri sürükleyin
          </div>

          <p className="text-xs text-gray-400">
            PNG, JPG, WEBP, GIF (maks. 5MB, {maxImages} resme kadar)
          </p>

          <p className="text-xs text-magenta">
            {images.length} / {maxImages} resim yüklendi
          </p>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative neo rounded-lg overflow-hidden group aspect-square"
            >
              <Image
                src={image}
                alt={`Ürün resmi ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Delete Button */}
              <button
                onClick={() => handleRemoveImage(index)}
                type="button"
                className="
                  absolute top-2 right-2
                  bg-void/80 hover:bg-red-600
                  text-white rounded-full p-1.5
                  opacity-0 group-hover:opacity-100
                  transition-all duration-200
                  neo-sm
                "
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-cyan/90 text-void text-xs font-bold px-2 py-1 rounded">
                  ANA RESİM
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          İlk resim ana ürün resmi olarak kullanılacaktır.
        </p>
      )}
    </div>
  );
}
