-- ============================================
-- ENUM TYPES
-- ============================================
-- All custom enum types used throughout the database schema

-- User role enum
CREATE TYPE public.user_role AS ENUM ('buyer', 'seller', 'creator', 'admin');

-- KYC status enum
CREATE TYPE public.kyc_status AS ENUM ('not_started', 'pending', 'verified', 'rejected');

-- Product status enum
CREATE TYPE public.product_status AS ENUM ('draft', 'active', 'inactive', 'sold_out', 'suspended', 'deleted');

-- Delivery type enum
CREATE TYPE public.delivery_type AS ENUM ('instant', 'email', 'in_game_mail', 'trade', 'guild_invite', 'manual', 'other');

-- Order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'pending_payment', 'processing', 'completed', 'cancelled', 'failed', 'refunded', 'disputed');

-- Payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Payment method enum
CREATE TYPE public.payment_method AS ENUM ('credit_card', 'paypal', 'bank_transfer', 'crypto');

-- Escrow status enum
CREATE TYPE public.escrow_status AS ENUM (
  'initiated',
  'payment_held',
  'awaiting_delivery',
  'delivered',
  'confirmed',
  'completed',
  'disputed',
  'under_review',
  'expired',
  'auto_refund'
);

-- Delivery status enum
CREATE TYPE public.delivery_status AS ENUM (
  'pending',
  'processing',
  'delivered',
  'confirmed',
  'failed',
  'cancelled'
);

-- Moderation status enum
CREATE TYPE public.moderation_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'flagged'
);

-- Event type enum for analytics
CREATE TYPE public.event_type AS ENUM (
  'page_view',
  'product_view',
  'add_to_cart',
  'purchase',
  'search',
  'click',
  'scroll',
  'video_play',
  'form_submit',
  'login',
  'signup'
);

-- Audit action enum
CREATE TYPE public.audit_action AS ENUM (
  'create',
  'update',
  'delete',
  'suspend',
  'verify',
  'refund',
  'data_export',
  'login',
  'logout',
  'permission_change'
);

-- Achievement tier enum
CREATE TYPE public.achievement_tier AS ENUM (
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond'
);

