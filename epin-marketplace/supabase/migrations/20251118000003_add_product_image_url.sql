-- Add image_url column to products table
-- This field is used for product images throughout the application

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment
COMMENT ON COLUMN public.products.image_url IS 'URL of the product image';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_image_url ON public.products(image_url) WHERE image_url IS NOT NULL;

