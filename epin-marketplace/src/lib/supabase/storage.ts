import { createClient } from '@/lib/supabase/client';

/**
 * Upload a product image to Supabase Storage
 * @param file - The image file to upload
 * @param productId - The product ID to organize files
 * @param userId - The user ID for folder organization
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(
  file: File,
  productId: string,
  userId: string
): Promise<string> {
  const supabase = createClient();

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Geçersiz dosya tipi. Sadece JPG, PNG, WEBP ve GIF desteklenir.');
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('Dosya boyutu 5MB\'dan küçük olmalıdır.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${userId}/${productId}/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error(`Resim yüklenemedi: ${uploadError.message}`);
  }

  // Get public URL
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Delete a product image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  const supabase = createClient();

  // Extract file path from public URL
  const urlParts = imageUrl.split('/product-images/');
  if (urlParts.length < 2) {
    throw new Error('Geçersiz resim URL\'si');
  }

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from('product-images')
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Resim silinemedi: ${error.message}`);
  }
}

/**
 * Delete multiple product images from Supabase Storage
 * @param imageUrls - Array of public URLs to delete
 */
export async function deleteProductImages(imageUrls: string[]): Promise<void> {
  const supabase = createClient();

  const filePaths = imageUrls.map(url => {
    const urlParts = url.split('/product-images/');
    return urlParts.length >= 2 ? urlParts[1] : null;
  }).filter(Boolean) as string[];

  if (filePaths.length === 0) return;

  const { error } = await supabase.storage
    .from('product-images')
    .remove(filePaths);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Resimler silinemedi: ${error.message}`);
  }
}
