# Database Schema Documentation

## Overview

This project uses Supabase's **Declarative Schema Management** approach. All database schema definitions are stored in `supabase/schemas/` directory as `.sql` files, which are then automatically converted to migration files using `supabase db diff`.

## Schema File Organization

Schema files are executed in lexicographic order. The current organization:

1. **01_enums.sql** - All custom ENUM types
2. **02_profiles.sql** - User profiles table
3. **03_categories.sql** - Product categories
4. **04_products.sql** - Products, variants, attributes
5. **05_orders.sql** - Orders and order items
6. **06_cart.sql** - Shopping cart
7. **07_wallets.sql** - Wallet system
8. **08_campaigns.sql** - Campaigns, giveaways, referrals
9. **09_reviews.sql** - Reviews and ratings
10. **10_forum.sql** - Forum system
11. **11_messaging.sql** - User messaging
12. **12_notifications.sql** - Notifications
13. **13_analytics.sql** - User events tracking
14. **14_admin.sql** - Admin tables (escrows, disputes, audit logs, security, gamification)
15. **15_functions.sql** - Database functions and triggers
16. **16_policies.sql** - Row Level Security (RLS) policies
17. **17_storage.sql** - Storage buckets and policies

## Workflow

### Making Schema Changes

1. **Stop local Supabase** (if running):
   ```bash
   supabase stop
   ```

2. **Edit schema files** in `supabase/schemas/`:
   - Modify the relevant `.sql` file(s)
   - Ensure proper dependency order (foreign keys, etc.)

3. **Generate migration**:
   ```bash
   supabase db diff -f <migration_name>
   ```
   This creates a new migration file in `supabase/migrations/` that captures the differences.

4. **Test locally**:
   ```bash
   supabase start
   supabase db reset  # This applies migrations and seeds
   ```

5. **Push to remote** (if needed):
   ```bash
   supabase db push
   ```

### Adding New Tables

1. Create a new `.sql` file in `supabase/schemas/` with appropriate naming (e.g., `18_new_feature.sql`)
2. Define the table, indexes, and comments
3. Add RLS policies in `16_policies.sql`
4. Generate migration: `supabase db diff -f add_new_feature`
5. Test and push

### Known Caveats

The `migra` diff tool used by Supabase CLI has some limitations. For these cases, you may need to create manual migration files:

- **DML statements** (INSERT, UPDATE, DELETE) - not captured by schema diff
- **View ownership** and grants
- **Security invoker** on views
- **Materialized views**
- **RLS policy alterations** (ALTER POLICY)
- **Column privileges**
- **Schema privileges**
- **Comments** (may not be tracked)
- **Partitions**
- **Domain statements**

## Seed Data

Seed data is stored in `supabase/seeds/comprehensive_test_data.sql` and is automatically loaded during `supabase db reset`.

## Storage Buckets

Storage buckets are defined in `supabase/schemas/17_storage.sql`:

- **avatars** - User avatar images (public)
- **product-images** - Product images (public, seller/admin upload)
- **category-icons** - Category icons (public, admin upload)

## CLI Setup

### Windows Installation

**Option 1: Scoop (Recommended)**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Option 2: Manual Installation**
1. Download from https://github.com/supabase/cli/releases
2. Extract and add to PATH

### Login and Link

```bash
supabase login
supabase link --project-ref qioaeiqrwjcbbbavhack
```

## Important Notes

1. **Migration Order**: Schema files execute in lexicographic order - naming is critical
2. **Dependencies**: Ensure foreign key dependencies are respected (e.g., profiles before products)
3. **Testing**: Always test migrations locally before pushing to remote
4. **Backup**: Ensure remote database is backed up before major schema changes
5. **RLS Policies**: All tables have RLS enabled - ensure policies are comprehensive

## Current Schema Status

- ✅ All ENUM types defined
- ✅ All core tables defined (profiles, products, orders, cart, wallets)
- ✅ All advanced tables defined (campaigns, reviews, forum, messaging, notifications)
- ✅ All admin tables defined (escrows, disputes, audit logs, security)
- ✅ All functions and triggers defined
- ✅ All RLS policies defined
- ✅ Storage buckets and policies defined
- ✅ Config.toml updated with schema_paths and seed paths

## Next Steps

1. Install Supabase CLI (if not already installed)
2. Generate initial migration: `supabase db diff -f initial_declarative_schema`
3. Test locally: `supabase start` and `supabase db reset`
4. Review generated migration file
5. Push to remote if needed: `supabase db push`

