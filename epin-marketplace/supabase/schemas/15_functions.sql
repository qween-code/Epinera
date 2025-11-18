-- ============================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ============================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  metadata JSONB := COALESCE(new.raw_user_meta_data, '{}'::jsonb);
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone, role, kyc_status)
  VALUES (
    new.id,
    metadata->>'full_name',
    metadata->>'avatar_url',
    metadata->>'phone',
    CASE
      WHEN metadata ? 'role'
        AND metadata->>'role' = ANY (ARRAY['buyer', 'seller', 'creator', 'admin'])
      THEN (metadata->>'role')::public.user_role
      ELSE 'buyer'
    END,
    CASE
      WHEN metadata ? 'kyc_status'
        AND metadata->>'kyc_status' = ANY (ARRAY['not_started', 'pending', 'verified', 'rejected'])
      THEN (metadata->>'kyc_status')::public.kyc_status
      ELSE 'not_started'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update cart item timestamp
CREATE OR REPLACE FUNCTION public.update_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for cart items updated_at
DROP TRIGGER IF EXISTS cart_items_update_updated_at ON public.cart_items;
CREATE TRIGGER cart_items_update_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cart_updated_at();

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = TRUE, read_at = NOW()
  WHERE id = notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = TRUE, read_at = NOW()
  WHERE user_id = user_uuid AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to update messages updated_at
CREATE OR REPLACE FUNCTION public.update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for messages updated_at
DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_messages_updated_at();

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

-- Generic function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
DROP TRIGGER IF EXISTS update_security_alerts_updated_at ON public.security_alerts;
CREATE TRIGGER update_security_alerts_updated_at
  BEFORE UPDATE ON public.security_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_risk_reviews_updated_at ON public.risk_reviews;
CREATE TRIGGER update_risk_reviews_updated_at
  BEFORE UPDATE ON public.risk_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_alerts_updated_at ON public.system_alerts;
CREATE TRIGGER update_system_alerts_updated_at
  BEFORE UPDATE ON public.system_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_support_conversations_updated_at ON public.support_conversations;
CREATE TRIGGER update_support_conversations_updated_at
  BEFORE UPDATE ON public.support_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_forum_posts_updated_at ON public.forum_posts;
CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comments
COMMENT ON FUNCTION public.decrement_stock IS 'Atomically decrements product variant stock with validation';
COMMENT ON FUNCTION public.get_seller_stats IS 'Returns aggregate statistics for a seller';

