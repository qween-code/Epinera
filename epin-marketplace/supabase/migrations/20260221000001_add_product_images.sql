-- Add image columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.products.image_url IS 'Primary product image URL from Supabase Storage';
COMMENT ON COLUMN public.products.images IS 'Array of additional product image URLs from Supabase Storage';

-- Note: Storage bucket creation needs to be done via Supabase dashboard or SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policies for product-images bucket (run these after bucket creation):
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
-- CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
