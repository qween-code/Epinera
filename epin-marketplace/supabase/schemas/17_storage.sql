-- ============================================
-- STORAGE BUCKETS & POLICIES
-- ============================================

-- Set up Storage security policies for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Avatar policies
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar." ON storage.objects
  FOR UPDATE WITH CHECK (auth.uid() = owner AND bucket_id = 'avatars');

CREATE POLICY "Users can delete their own avatar." ON storage.objects
  FOR DELETE USING (auth.uid() = owner AND bucket_id = 'avatars');

-- Product images bucket (if needed)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Product image policies
CREATE POLICY "Product images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Sellers can upload product images." ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('seller', 'admin')
    )
  );

CREATE POLICY "Sellers can update their product images." ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('seller', 'admin')
    )
  );

CREATE POLICY "Sellers can delete their product images." ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('seller', 'admin')
    )
  );

-- Category icons bucket (if needed)
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-icons', 'category-icons', true)
ON CONFLICT (id) DO NOTHING;

-- Category icon policies
CREATE POLICY "Category icons are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'category-icons');

CREATE POLICY "Admins can upload category icons." ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'category-icons' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update category icons." ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'category-icons' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete category icons." ON storage.objects
  FOR DELETE USING (
    bucket_id = 'category-icons' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

