-- Fix: Add missing INSERT policy for order_items
-- This allows buyers to create order items during checkout

CREATE POLICY "Buyers can create order items during checkout."
  ON public.order_items FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT buyer_id FROM public.orders WHERE id = order_id)
  );

-- Add missing policies for admin management

-- Categories: Admin can manage
CREATE POLICY "Admins can insert categories."
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update categories."
  ON public.categories FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete categories."
  ON public.categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Attributes: Admin can manage
CREATE POLICY "Admins can insert attributes."
  ON public.attributes FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update attributes."
  ON public.attributes FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete attributes."
  ON public.attributes FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Sellers can manage product variant attributes
CREATE POLICY "Sellers can manage their product variant attributes."
  ON public.product_variant_attributes FOR ALL
  USING (
    auth.uid() IN (
      SELECT p.seller_id
      FROM public.products p
      JOIN public.product_variants pv ON pv.product_id = p.id
      WHERE pv.id = variant_id
    )
  );

-- Database function for atomic stock decrement
CREATE OR REPLACE FUNCTION public.decrement_stock(
  p_variant_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_stock INTEGER;
BEGIN
  -- Lock the row for update
  SELECT stock_quantity INTO v_current_stock
  FROM public.product_variants
  WHERE id = p_variant_id
  FOR UPDATE;

  -- Check if enough stock
  IF v_current_stock < p_quantity THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_current_stock, p_quantity;
  END IF;

  -- Decrement stock
  UPDATE public.product_variants
  SET stock_quantity = stock_quantity - p_quantity,
      updated_at = NOW()
  WHERE id = p_variant_id;

  RETURN TRUE;
END;
$$;

-- Database function for seller statistics
CREATE OR REPLACE FUNCTION public.get_seller_stats(p_seller_id UUID)
RETURNS TABLE (
  total_products BIGINT,
  active_products BIGINT,
  total_orders BIGINT,
  pending_orders BIGINT,
  total_revenue NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.products WHERE seller_id = p_seller_id) AS total_products,
    (SELECT COUNT(*) FROM public.products WHERE seller_id = p_seller_id AND status = 'active') AS active_products,
    (SELECT COUNT(*) FROM public.order_items WHERE seller_id = p_seller_id) AS total_orders,
    (SELECT COUNT(*) FROM public.order_items WHERE seller_id = p_seller_id AND delivery_status = 'pending') AS pending_orders,
    (SELECT COALESCE(SUM(total_price), 0) FROM public.order_items WHERE seller_id = p_seller_id) AS total_revenue;
END;
$$;

COMMENT ON FUNCTION public.decrement_stock IS 'Atomically decrements product variant stock with validation';
COMMENT ON FUNCTION public.get_seller_stats IS 'Returns aggregate statistics for a seller';
