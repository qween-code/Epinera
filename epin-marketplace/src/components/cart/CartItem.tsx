'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CartItemProps {
  id: string;
  product: {
    id: string;
    title: string;
    slug: string;
    image?: string;
  };
  variant: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  platform?: string;
}

export default function CartItem({
  id,
  product,
  variant,
  quantity,
  onQuantityChange,
  onRemove,
  platform,
}: CartItemProps) {
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setLocalQuantity(newQuantity);
    setIsUpdating(true);
    await onQuantityChange(id, newQuantity);
    setIsUpdating(false);
  };

  const handleDecrease = () => {
    handleQuantityChange(localQuantity - 1);
  };

  const handleIncrease = () => {
    handleQuantityChange(localQuantity + 1);
  };

  const totalPrice = variant.price * localQuantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-background-dark p-4 sm:p-6 justify-between items-start sm:items-center">
      <div className="flex items-start gap-4 w-full">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20 shrink-0"
          style={{
            backgroundImage: product.image
              ? `url(${product.image})`
              : 'url(https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80)',
          }}
          role="img"
          aria-label={`${product.title} product image`}
        />
        <div className="flex flex-1 flex-col justify-center gap-1">
          <Link
            href={`/product/${product.slug}`}
            className="text-white text-lg font-semibold leading-tight hover:text-primary transition-colors"
          >
            {product.title}
          </Link>
          <p className="text-gray-400 text-sm font-normal">
            Unit Price: {variant.price.toLocaleString()} {variant.currency === 'USD' ? 'Credits' : variant.currency}
          </p>
          {platform && (
            <p className="text-gray-400 text-sm font-normal">Platform: {platform}</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <div className="shrink-0">
          <div className="flex items-center gap-2 text-white bg-gray-200/10 rounded-full px-1">
            <button
              onClick={handleDecrease}
              disabled={isUpdating || localQuantity <= 1}
              className="text-xl font-medium flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <input
              type="number"
              value={localQuantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                handleQuantityChange(val);
              }}
              className="text-base font-medium w-8 p-0 text-center bg-transparent focus:outline-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              min="1"
            />
            <button
              onClick={handleIncrease}
              disabled={isUpdating}
              className="text-xl font-medium flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>
        <p className="text-white text-lg font-semibold w-24 text-right">
          {totalPrice.toLocaleString()} {variant.currency === 'USD' ? 'Cr' : variant.currency}
        </p>
        <button
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
}

