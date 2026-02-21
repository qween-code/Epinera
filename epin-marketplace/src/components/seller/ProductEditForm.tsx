'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/seller/ImageUpload';
import { updateProduct, deleteProduct, ProductVariant } from '@/app/seller/products/[id]/edit/actions';

const DELIVERY_METHODS = [
  { value: 'in_game_mail', label: 'Oyun İçi Posta' },
  { value: 'trade', label: 'Takas' },
  { value: 'guild_invite', label: 'Lonca Daveti' },
  { value: 'other', label: 'Diğer' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Taslak' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Pasif' },
];

interface ProductEditFormProps {
  product: any;
  variants: any[];
  categories: any[];
}

export default function ProductEditForm({
  product,
  variants: initialVariants,
  categories,
}: ProductEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialVariants.map((v) => ({
      id: v.id,
      name: v.name,
      price: parseFloat(v.price),
      stockQuantity: v.stock_quantity,
      currency: v.currency,
      status: v.status,
    }))
  );
  const [images, setImages] = useState<string[]>(product.images || []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const handleImagesChange = (newImages: string[]) => {
    const removed = images.filter((img) => !newImages.includes(img));
    setRemovedImages([...removedImages, ...removed]);
    setImages(newImages);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { name: '', price: 0, stockQuantity: 0, currency: 'TRY', status: 'active' },
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
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('variants', JSON.stringify(variants));
      formData.set('images', JSON.stringify(images));
      formData.set('removedImages', JSON.stringify(removedImages));

      const result = await updateProduct(product.id, formData);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setRemovedImages([]);
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteProduct(product.id);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Silme hatası');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan mb-2">Ürün Düzenle</h1>
        <p className="text-gray-400">Ürün bilgilerini güncelleyin</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg text-green-400">
          Ürün başarıyla güncellendi!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="neo p-6 rounded-lg space-y-6">
          <h2 className="text-xl font-bold text-magenta mb-4">Temel Bilgiler</h2>

          <div>
            <label className="block text-sm font-medium text-cyan mb-2">Ürün Başlığı *</label>
            <input
              type="text"
              name="title"
              required
              minLength={3}
              maxLength={255}
              defaultValue={product.title}
              className="w-full px-4 py-3 bg-void/50 border border-gray-700 rounded-lg text-white neo-inset-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan mb-2">Açıklama *</label>
            <textarea
              name="description"
              required
              minLength={10}
              rows={5}
              defaultValue={product.description}
              className="w-full px-4 py-3 bg-void/50 border border-gray-700 rounded-lg text-white neo-inset-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan mb-2">Kategori *</label>
              <select
                name="categoryId"
                required
                defaultValue={product.category_id}
                className="w-full px-4 py-3 bg-void/50 border border-gray-700 rounded-lg text-white neo-inset-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan mb-2">Durum *</label>
              <select
                name="status"
                required
                defaultValue={product.status}
                className="w-full px-4 py-3 bg-void/50 border border-gray-700 rounded-lg text-white neo-inset-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan mb-2">Teslimat Yöntemi</label>
            <select
              name="deliveryMethod"
              defaultValue={product.delivery_method || ''}
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

          <div>
            <label className="block text-sm font-medium text-cyan mb-2">
              Ortalama Teslimat Süresi
            </label>
            <input
              type="text"
              name="averageDeliveryTime"
              defaultValue={product.average_delivery_time || ''}
              className="w-full px-4 py-3 bg-void/50 border border-gray-700 rounded-lg text-white neo-inset-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
              placeholder="Örn: 5 dakika, 1 saat, 1 gün"
            />
          </div>
        </div>

        <div className="neo p-6 rounded-lg">
          <h2 className="text-xl font-bold text-magenta mb-4">Ürün Resimleri</h2>
          <ImageUpload
            onImagesChange={handleImagesChange}
            existingImages={images}
          />
        </div>

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
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Varyant Adı *</label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-void/50 border border-gray-700 rounded text-white neo-inset-sm focus:border-cyan outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Fiyat (TRY) *</label>
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
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Stok Miktarı *</label>
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
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-3 bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500 rounded-lg transition-all neo-sm"
            disabled={loading}
          >
            Ürünü Sil
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => router.push('/seller/products')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all neo-sm"
            disabled={loading}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-cyan hover:bg-cyan/80 text-void font-bold rounded-lg transition-all neo disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
