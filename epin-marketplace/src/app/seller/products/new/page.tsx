'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/seller/ImageUpload';
import { createProduct, ProductVariant } from './actions';

// This would be fetched from the API in a real app
const DELIVERY_METHODS = [
  { value: 'in_game_mail', label: 'Oyun İçi Posta' },
  { value: 'trade', label: 'Takas' },
  { value: 'guild_invite', label: 'Lonca Daveti' },
  { value: 'other', label: 'Diğer' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([
    { name: '', price: 0, stockQuantity: 0, currency: 'TRY' },
  ]);
  const [images, setImages] = useState<string[]>([]);

  // Fetch categories on mount
  useState(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    fetchCategories();
  });

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { name: '', price: 0, stockQuantity: 0, currency: 'TRY' },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length === 1) {
      setError('En az bir varyant gerekli');
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('variants', JSON.stringify(variants));
      formData.set('images', JSON.stringify(images));

      const result = await createProduct(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // Success - will redirect via server action
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan mb-2">Yeni Ürün Ekle</h1>
        <p className="text-gray-400">
          Marketplace\'te satmak istediğiniz ürünü oluşturun
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="neo p-6 rounded-lg space-y-6">
          <h2 className="text-xl font-bold text-magenta mb-4">Temel Bilgiler</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-cyan mb-2">
              Ürün Başlığı *
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={3}
              maxLength={255}
              className="w-full px-4 py-3 bg-void/50 border border-gray-700 rounded-lg text-white neo-inset-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
              placeholder="Örn: Valorant Points 1000 VP"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-cyan mb-2">
              Açıklama *
            </label>
            <textarea
              name="description"
              required
              minLength={10}
              rows={5}
              className="w-full px-4 py-3 bg-void/50 border border-gray-700 rounded-lg text-white neo-inset-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all resize-none"
              placeholder="Ürününüz hakkında detaylı bilgi verin..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-cyan mb-2">
              Kategori *
            </label>
            <select
              name="categoryId"
              required
              className="w-full px-4 py-3 bg-void/50 border border-gray-700 rounded-lg text-white neo-inset-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
            >
              <option value="">Kategori seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-cyan mb-2">
              Teslimat Yöntemi
            </label>
            <select
              name="deliveryMethod"
              className="w-full px-4 py-3 bg-void/50 border border-gray-700 rounded-lg text-white neo-inset-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
            >
              <option value="">Seçin (opsiyonel)</option>
              {DELIVERY_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Average Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-cyan mb-2">
              Ortalama Teslimat Süresi
            </label>
            <input
              type="text"
              name="averageDeliveryTime"
              className="w-full px-4 py-3 bg-void/50 border border-gray-700 rounded-lg text-white neo-inset-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
              placeholder="Örn: 5 dakika, 1 saat, 1 gün"
            />
          </div>
        </div>

        {/* Product Images */}
        <div className="neo p-6 rounded-lg">
          <h2 className="text-xl font-bold text-magenta mb-4">Ürün Resimleri</h2>
          <ImageUpload onImagesChange={setImages} existingImages={images} />
        </div>

        {/* Variants */}
        <div className="neo p-6 rounded-lg space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-magenta">Ürün Varyantları *</h2>
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-4 py-2 bg-cyan/20 hover:bg-cyan/30 text-cyan border border-cyan rounded-lg transition-all neo-sm"
            >
              + Varyant Ekle
            </button>
          </div>

          <p className="text-sm text-gray-400">
            Ürününüzün farklı seçeneklerini ekleyin (örn: 850 VP, 1450 VP)
          </p>

          {variants.map((variant, index) => (
            <div
              key={index}
              className="p-4 bg-void/30 border border-gray-700 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Varyant #{index + 1}</span>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Kaldır
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Variant Name */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Varyant Adı *
                  </label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) =>
                      handleVariantChange(index, 'name', e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 bg-void/50 border border-gray-700 rounded text-white neo-inset-sm focus:border-cyan outline-none"
                    placeholder="Örn: 850 VP"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Fiyat (TRY) *
                  </label>
                  <input
                    type="number"
                    value={variant.price || ''}
                    onChange={(e) =>
                      handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)
                    }
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 bg-void/50 border border-gray-700 rounded text-white neo-inset-sm focus:border-cyan outline-none"
                    placeholder="0.00"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Stok Miktarı *
                  </label>
                  <input
                    type="number"
                    value={variant.stockQuantity || ''}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        'stockQuantity',
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-void/50 border border-gray-700 rounded text-white neo-inset-sm focus:border-cyan outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all neo-sm"
            disabled={loading}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-cyan hover:bg-cyan/80 text-void font-bold rounded-lg transition-all neo disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Oluşturuluyor...' : 'Ürün Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
}
