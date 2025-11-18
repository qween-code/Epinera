-- Add checkout-related fields to orders table
-- This migration adds discount_amount, tax_amount, and shipping_address fields

-- Add discount_amount column
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0;

-- Add tax_amount column
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) DEFAULT 0;

-- Add shipping_address column (JSONB for flexibility)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Add billing_address column (JSONB for flexibility)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS billing_address JSONB;

-- Add notes column for order notes
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add subtotal column (before discount and tax)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2);

-- Update existing orders to have default values
UPDATE public.orders 
SET discount_amount = 0, tax_amount = 0, subtotal = total_amount 
WHERE discount_amount IS NULL OR tax_amount IS NULL OR subtotal IS NULL;

-- Add comments
COMMENT ON COLUMN public.orders.discount_amount IS 'Discount amount applied to the order';
COMMENT ON COLUMN public.orders.tax_amount IS 'Tax amount for the order';
COMMENT ON COLUMN public.orders.shipping_address IS 'Shipping address information (JSONB)';
COMMENT ON COLUMN public.orders.billing_address IS 'Billing address information (JSONB)';
COMMENT ON COLUMN public.orders.notes IS 'Order notes or special instructions';
COMMENT ON COLUMN public.orders.subtotal IS 'Subtotal before discount and tax';

