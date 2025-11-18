-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables and create policies

-- ============================================
-- PROFILES
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- ============================================
-- CATEGORIES
-- ============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public categories are viewable by everyone."
  ON public.categories FOR SELECT
  USING ( true );

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

-- ============================================
-- PRODUCTS
-- ============================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active products are viewable by everyone."
  ON public.products FOR SELECT
  USING ( status = 'active' );

CREATE POLICY "Sellers can view their own products."
  ON public.products FOR SELECT
  USING ( auth.uid() = seller_id );

CREATE POLICY "Sellers can create products."
  ON public.products FOR INSERT
  WITH CHECK ( auth.uid() = seller_id );

CREATE POLICY "Sellers can update their own products."
  ON public.products FOR UPDATE
  USING ( auth.uid() = seller_id );

-- ============================================
-- PRODUCT VARIANTS
-- ============================================
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active product variants are viewable by everyone."
  ON public.product_variants FOR SELECT
  USING ( status = 'active' );

CREATE POLICY "Sellers can manage their own variants."
  ON public.product_variants FOR ALL
  USING ( auth.uid() IN (SELECT seller_id FROM public.products WHERE id = product_id) );

-- ============================================
-- ATTRIBUTES
-- ============================================
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attributes are public."
  ON public.attributes FOR SELECT
  USING ( true );

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

-- ============================================
-- PRODUCT VARIANT ATTRIBUTES
-- ============================================
ALTER TABLE public.product_variant_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Variant attributes are public."
  ON public.product_variant_attributes FOR SELECT
  USING ( true );

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

-- ============================================
-- CART ITEMS
-- ============================================
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cart."
  ON public.cart_items FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can add to their own cart."
  ON public.cart_items FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own cart."
  ON public.cart_items FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete from their own cart."
  ON public.cart_items FOR DELETE
  USING ( auth.uid() = user_id );

-- ============================================
-- ORDERS
-- ============================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own orders."
  ON public.orders FOR SELECT
  USING ( auth.uid() = buyer_id );

CREATE POLICY "Buyers can create orders."
  ON public.orders FOR INSERT
  WITH CHECK ( auth.uid() = buyer_id );

CREATE POLICY "Buyers can update their pending orders."
  ON public.orders FOR UPDATE
  USING ( auth.uid() = buyer_id AND status = 'pending' );

-- ============================================
-- ORDER ITEMS
-- ============================================
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their order items."
  ON public.order_items FOR SELECT
  USING ( auth.uid() IN (SELECT buyer_id FROM public.orders WHERE id = order_id) );

CREATE POLICY "Buyers can create order items during checkout."
  ON public.order_items FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT buyer_id FROM public.orders WHERE id = order_id)
  );

CREATE POLICY "Sellers can view their order items."
  ON public.order_items FOR SELECT
  USING ( auth.uid() = seller_id );

CREATE POLICY "Sellers can update their order items."
  ON public.order_items FOR UPDATE
  USING ( auth.uid() = seller_id );

-- ============================================
-- WALLETS
-- ============================================
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallets" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- WALLET TRANSACTIONS
-- ============================================
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- ESCROWS
-- ============================================
ALTER TABLE public.escrows ENABLE ROW LEVEL SECURITY;

-- Basic escrow policies (can be expanded)
CREATE POLICY "Buyers and sellers can view their escrows" ON public.escrows
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ============================================
-- DISPUTES
-- ============================================
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Basic dispute policies (can be expanded)
CREATE POLICY "Buyers and sellers can view their disputes" ON public.disputes
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ============================================
-- REVIEWS
-- ============================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT USING (moderation_status = 'approved');

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their orders" ON public.reviews
  FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_id
      AND orders.buyer_id = auth.uid()
      AND orders.status IN ('completed', 'delivered')
    )
  );

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- ============================================
-- REVIEW VOTES
-- ============================================
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

-- Basic review vote policies (can be expanded)
CREATE POLICY "Users can manage their own review votes" ON public.review_votes
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- USER STATS
-- ============================================
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- FORUM POSTS
-- ============================================
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved posts" ON public.forum_posts
  FOR SELECT USING (moderation_status = 'approved' OR auth.uid() = author_id);

CREATE POLICY "Anyone can view forum posts" ON public.forum_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create forum posts" ON public.forum_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id OR auth.uid() = user_id);

CREATE POLICY "Users can update their own forum posts" ON public.forum_posts
  FOR UPDATE USING (auth.uid() = author_id OR auth.uid() = user_id);

-- ============================================
-- FORUM REPLIES
-- ============================================
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Basic forum reply policies (can be expanded)
CREATE POLICY "Public can view approved replies" ON public.forum_replies
  FOR SELECT USING (moderation_status = 'approved' OR auth.uid() = author_id);

-- ============================================
-- FORUM CATEGORIES
-- ============================================
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum categories" ON public.forum_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage forum categories" ON public.forum_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- MESSAGES
-- ============================================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert their own messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- USER EVENTS
-- ============================================
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Basic user events policies (can be expanded)
CREATE POLICY "Users can view their own events" ON public.user_events
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- AUDIT LOGS
-- ============================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() = actor_id OR auth.uid() = user_id);

-- ============================================
-- CAMPAIGNS
-- ============================================
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Basic campaign policies (can be expanded)
CREATE POLICY "Public can view active campaigns" ON public.campaigns
  FOR SELECT USING (status = 'active');

-- ============================================
-- GIVEAWAY ENTRIES
-- ============================================
ALTER TABLE public.giveaway_entries ENABLE ROW LEVEL SECURITY;

-- Basic giveaway entry policies (can be expanded)
CREATE POLICY "Users can view their own entries" ON public.giveaway_entries
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- REFERRALS
-- ============================================
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Basic referral policies (can be expanded)
CREATE POLICY "Users can view their own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- ============================================
-- SECURITY ALERTS
-- ============================================
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all security alerts"
  ON public.security_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert security alerts"
  ON public.security_alerts FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() = user_id);

-- ============================================
-- RISK REVIEWS
-- ============================================
ALTER TABLE public.risk_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all risk reviews"
  ON public.risk_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert risk reviews"
  ON public.risk_reviews FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Admins can update risk reviews"
  ON public.risk_reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- SYSTEM ALERTS
-- ============================================
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all system alerts"
  ON public.system_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert system alerts"
  ON public.system_alerts FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Admins can update system alerts"
  ON public.system_alerts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- SUPPORT CONVERSATIONS
-- ============================================
ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own support conversations"
  ON public.support_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create support conversations"
  ON public.support_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own support conversations"
  ON public.support_conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- ACHIEVEMENTS
-- ============================================
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Basic achievement policies (can be expanded)
CREATE POLICY "Public can view active achievements" ON public.achievements
  FOR SELECT USING (is_active = true);

-- ============================================
-- USER ACHIEVEMENTS
-- ============================================
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Basic user achievement policies (can be expanded)
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

