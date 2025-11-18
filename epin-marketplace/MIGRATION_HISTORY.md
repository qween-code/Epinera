# Migration History

This document tracks the migration from migration-based schema management to declarative schema management.

## Migration Archive

All previous migration files have been moved to `supabase/migrations/archive/` for historical reference. These migrations were:

1. `20251114135606_create_initial_schema.sql` - Initial schema setup
2. `20251114140000_add_not_started_kyc_status.sql` - KYC status enum update
3. `20251114171749_add_product_schema.sql` - Products and categories
4. `20251114174940_add_product_variants_schema.sql` - Product variants
5. `20251115184800_add_order_schema.sql` - Orders and order items
6. `20251116000001_add_cart_and_orders.sql` - Cart and orders
7. `20251116000002_add_missing_policies_and_functions.sql` - RLS policies and functions
8. `20251116194545_create_cart_and_transaction_tables.sql` - Cart and transactions
9. `20251116195949_create_order_tables.sql` - Order tables
10. `20251117000001_add_advanced_schema.sql` - Advanced features
11. `20251118000001_add_checkout_fields.sql` - Checkout fields
12. `20251118000002_add_notifications_table.sql` - Notifications
13. `20251118000003_add_product_image_url.sql` - Product images
14. `20251130000001_add_messages_table.sql` - Messaging
15. `20251201000001_add_production_tables.sql` - Production tables

## Declarative Schema Structure

All schema definitions are now in `supabase/schemas/` organized by domain:

- `01_enums.sql` - All ENUM types
- `02_profiles.sql` - User profiles
- `03_categories.sql` - Product categories
- `04_products.sql` - Products and variants
- `05_orders.sql` - Orders and order items
- `06_cart.sql` - Shopping cart
- `07_wallets.sql` - Wallet system
- `08_campaigns.sql` - Campaigns and giveaways
- `09_reviews.sql` - Reviews and ratings
- `10_forum.sql` - Forum system
- `11_messaging.sql` - Messaging
- `12_notifications.sql` - Notifications
- `13_analytics.sql` - Analytics and referrals
- `14_admin.sql` - Admin tables
- `15_functions.sql` - Database functions and triggers
- `16_policies.sql` - Row Level Security policies
- `17_storage.sql` - Storage buckets and policies

## Schema Changes Made

### Campaigns Table
- Added discount code fields: `code`, `discount_percentage`, `discount_amount`, `currency`, `valid_from`, `valid_until`
- Added indexes for code and campaign_type

## Code Updates

### Cart Operations
- Removed `carts` table dependency - now uses `cart_items` directly with `user_id`
- Changed `product_variant_id` to `variant_id` to match schema
- Removed `cart_id` references

### Wallet Transactions
- Removed `description` field (not in schema) - moved to `metadata` JSONB
- Updated all transaction inserts to use `metadata` for descriptions

### Orders
- Verified `buyer_id` usage (correct)
- Verified `delivery_status` uses `order_status` enum (correct)

### Discount Codes
- Updated queries to use new `code`, `discount_percentage`, `discount_amount` columns
- Added `campaign_type='discount'` filter
- Added validity date checks

## Remote Database Status

All 15 migrations have been applied to the remote database (project: qioaeiqrwjcbbbavhack).

## Next Steps

1. Generate migration from declarative schemas: `supabase db diff -f initial_declarative_schema`
2. Test locally with Docker Desktop running
3. Push changes to remote if needed: `supabase db push`

