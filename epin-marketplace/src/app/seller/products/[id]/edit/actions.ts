'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { uploadProductImage, deleteProductImages } from '@/lib/supabase/storage';
import { revalidatePath } from 'next/cache';

export type ProductVariant = {
  id?: string;
  name: string;
  price: number;
  stockQuantity: number;
  currency?: string;
  status?: string;
};

export type UpdateProductData = {
  title: string;
  description: string;
  categoryId: string;
  deliveryMethod?: string;
  averageDeliveryTime?: string;
  status: string;
  variants: ProductVariant[];
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Giriş yapmalısınız' };
  }

  // Verify ownership
  const { data: product } = await supabase
    .from('products')
    .select('seller_id')
    .eq('id', productId)
    .single();

  if (!product || product.seller_id !== user.id) {
    return { error: 'Bu ürünü düzenleme yetkiniz yok' };
  }

  // Extract form data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const deliveryMethod = formData.get('deliveryMethod') as string;
  const averageDeliveryTime = formData.get('averageDeliveryTime') as string;
  const status = formData.get('status') as string;

  // Validation
  if (!title || title.trim().length < 3) {
    return { error: 'Ürün başlığı en az 3 karakter olmalıdır' };
  }

  if (!description || description.trim().length < 10) {
    return { error: 'Ürün açıklaması en az 10 karakter olmalıdır' };
  }

  if (!categoryId) {
    return { error: 'Kategori seçmelisiniz' };
  }

  // Parse variants
  const variantsJson = formData.get('variants') as string;
  let variants: ProductVariant[] = [];

  try {
    variants = JSON.parse(variantsJson);
  } catch (e) {
    return { error: 'Varyant verisi geçersiz' };
  }

  if (!variants || variants.length === 0) {
    return { error: 'En az bir varyant gerekli' };
  }

  // Validate variants
  for (const variant of variants) {
    if (!variant.name || variant.name.trim().length < 1) {
      return { error: 'Varyant adı gerekli' };
    }
    if (!variant.price || variant.price <= 0) {
      return { error: 'Varyant fiyatı sıfırdan büyük olmalıdır' };
    }
    if (variant.stockQuantity < 0) {
      return { error: 'Stok miktarı negatif olamaz' };
    }
  }

  // Generate new slug from title
  const slug = generateSlug(title);

  // Update product
  const { error: productError } = await supabase
    .from('products')
    .update({
      title,
      description,
      category_id: categoryId,
      slug,
      delivery_method: deliveryMethod || null,
      average_delivery_time: averageDeliveryTime || null,
      status: status || 'draft',
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId);

  if (productError) {
    console.error('Product update error:', productError);
    return { error: `Ürün güncellenemedi: ${productError.message}` };
  }

  // Handle variants
  // Get existing variants
  const { data: existingVariants } = await supabase
    .from('product_variants')
    .select('id')
    .eq('product_id', productId);

  const existingVariantIds = existingVariants?.map((v) => v.id) || [];
  const updatedVariantIds = variants.filter((v) => v.id).map((v) => v.id);

  // Delete removed variants
  const variantsToDelete = existingVariantIds.filter(
    (id) => !updatedVariantIds.includes(id)
  );

  if (variantsToDelete.length > 0) {
    await supabase
      .from('product_variants')
      .delete()
      .in('id', variantsToDelete);
  }

  // Update or insert variants
  for (const variant of variants) {
    if (variant.id) {
      // Update existing variant
      await supabase
        .from('product_variants')
        .update({
          name: variant.name,
          price: variant.price,
          stock_quantity: variant.stockQuantity,
          currency: variant.currency || 'TRY',
          status: variant.status || 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', variant.id);
    } else {
      // Insert new variant
      await supabase
        .from('product_variants')
        .insert({
          product_id: productId,
          name: variant.name,
          price: variant.price,
          stock_quantity: variant.stockQuantity,
          currency: variant.currency || 'TRY',
          status: 'active',
        });
    }
  }

  // Handle image updates
  const imagesJson = formData.get('images') as string;
  const removedImagesJson = formData.get('removedImages') as string;

  if (removedImagesJson) {
    try {
      const removedUrls = JSON.parse(removedImagesJson) as string[];
      if (removedUrls.length > 0) {
        await deleteProductImages(removedUrls);
      }
    } catch (error) {
      console.error('Failed to delete images:', error);
    }
  }

  if (imagesJson) {
    try {
      const imageDataUrls = JSON.parse(imagesJson) as string[];
      const newImages = imageDataUrls.filter((url) => url.startsWith('data:'));

      if (newImages.length > 0) {
        const uploadedUrls: string[] = [];

        for (let i = 0; i < newImages.length; i++) {
          const dataUrl = newImages[i];

          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], `image-${i}.jpg`, { type: blob.type });

          try {
            const url = await uploadProductImage(file, productId, user.id);
            uploadedUrls.push(url);
          } catch (uploadError) {
            console.error('Image upload error:', uploadError);
          }
        }

        // Get existing non-data-url images
        const existingUrls = imageDataUrls.filter((url) => !url.startsWith('data:'));
        const allImages = [...existingUrls, ...uploadedUrls];

        // Update product with all images
        await supabase
          .from('products')
          .update({
            image_url: allImages[0] || null,
            images: allImages,
          })
          .eq('id', productId);
      }
    } catch (error) {
      console.error('Image processing error:', error);
    }
  }

  // Revalidate paths
  revalidatePath(`/seller/products`);
  revalidatePath(`/seller/products/${productId}/edit`);
  revalidatePath(`/product/${slug}`);

  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Giriş yapmalısınız' };
  }

  // Verify ownership
  const { data: product } = await supabase
    .from('products')
    .select('seller_id, images')
    .eq('id', productId)
    .single();

  if (!product || product.seller_id !== user.id) {
    return { error: 'Bu ürünü silme yetkiniz yok' };
  }

  // Delete images from storage
  if (product.images && product.images.length > 0) {
    try {
      await deleteProductImages(product.images);
    } catch (error) {
      console.error('Failed to delete product images:', error);
    }
  }

  // Delete product (variants will be cascade deleted)
  const { error } = await supabase.from('products').delete().eq('id', productId);

  if (error) {
    return { error: `Ürün silinemedi: ${error.message}` };
  }

  revalidatePath('/seller/products');
  redirect('/seller/products?deleted=true');
}
