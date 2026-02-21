'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { uploadProductImage } from '@/lib/supabase/storage';

export type ProductVariant = {
  name: string;
  price: number;
  stockQuantity: number;
  currency?: string;
};

export type CreateProductData = {
  title: string;
  description: string;
  categoryId: string;
  deliveryMethod?: string;
  averageDeliveryTime?: string;
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

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Giriş yapmalısınız' };
  }

  // Verify user is a seller
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'seller' && profile.role !== 'admin')) {
    return { error: 'Sadece satıcılar ürün oluşturabilir' };
  }

  // Extract form data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const deliveryMethod = formData.get('deliveryMethod') as string;
  const averageDeliveryTime = formData.get('averageDeliveryTime') as string;

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
    return { error: 'En az bir varyant eklemelisiniz' };
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

  // Generate slug
  const slug = generateSlug(title);

  // Check if slug already exists
  const { data: existingProduct } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existingProduct) {
    // Add random suffix to make slug unique
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const uniqueSlug = `${slug}-${randomSuffix}`;

    // Create product with unique slug
    return await createProductWithSlug(
      supabase,
      user.id,
      title,
      description,
      categoryId,
      deliveryMethod,
      averageDeliveryTime,
      variants,
      uniqueSlug,
      formData
    );
  }

  return await createProductWithSlug(
    supabase,
    user.id,
    title,
    description,
    categoryId,
    deliveryMethod,
    averageDeliveryTime,
    variants,
    slug,
    formData
  );
}

async function createProductWithSlug(
  supabase: any,
  userId: string,
  title: string,
  description: string,
  categoryId: string,
  deliveryMethod: string,
  averageDeliveryTime: string,
  variants: ProductVariant[],
  slug: string,
  formData: FormData
) {
  // Create product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      seller_id: userId,
      title,
      description,
      category_id: categoryId,
      slug,
      delivery_method: deliveryMethod || null,
      average_delivery_time: averageDeliveryTime || null,
      status: 'draft', // Default to draft
    })
    .select()
    .single();

  if (productError) {
    console.error('Product creation error:', productError);
    return { error: `Ürün oluşturulamadı: ${productError.message}` };
  }

  // Create variants
  const variantInserts = variants.map((variant) => ({
    product_id: product.id,
    name: variant.name,
    price: variant.price,
    stock_quantity: variant.stockQuantity,
    currency: variant.currency || 'TRY',
    status: 'active',
  }));

  const { error: variantsError } = await supabase
    .from('product_variants')
    .insert(variantInserts);

  if (variantsError) {
    console.error('Variants creation error:', variantsError);
    // Rollback: delete product
    await supabase.from('products').delete().eq('id', product.id);
    return { error: `Varyantlar oluşturulamadı: ${variantsError.message}` };
  }

  // Handle image uploads
  const imagesJson = formData.get('images') as string;
  if (imagesJson) {
    try {
      const imageDataUrls = JSON.parse(imagesJson) as string[];

      if (imageDataUrls.length > 0) {
        const uploadedUrls: string[] = [];

        for (let i = 0; i < imageDataUrls.length; i++) {
          const dataUrl = imageDataUrls[i];

          // Convert data URL to File
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], `image-${i}.jpg`, { type: blob.type });

          try {
            const url = await uploadProductImage(file, product.id, userId);
            uploadedUrls.push(url);
          } catch (uploadError) {
            console.error('Image upload error:', uploadError);
            // Continue with other images
          }
        }

        // Update product with images
        if (uploadedUrls.length > 0) {
          const { error: updateError } = await supabase
            .from('products')
            .update({
              image_url: uploadedUrls[0],
              images: uploadedUrls,
            })
            .eq('id', product.id);

          if (updateError) {
            console.error('Product update error:', updateError);
          }
        }
      }
    } catch (error) {
      console.error('Image processing error:', error);
      // Don't fail the whole operation for image errors
    }
  }

  // Redirect to product edit page or product list
  redirect(`/seller/products/${product.id}/edit?success=created`);
}
