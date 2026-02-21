-- Add Stripe-related columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Create index for faster lookups by Stripe session ID
CREATE INDEX IF NOT EXISTS orders_stripe_session_idx ON public.orders (stripe_session_id);

-- Add comments for documentation
COMMENT ON COLUMN public.orders.stripe_session_id IS 'Stripe Checkout Session ID';
COMMENT ON COLUMN public.orders.stripe_payment_intent_id IS 'Stripe Payment Intent ID after successful payment';
