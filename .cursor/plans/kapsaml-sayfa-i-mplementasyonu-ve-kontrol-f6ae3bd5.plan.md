<!-- f6ae3bd5-403a-4fec-ad2a-c5a76e24f906 06914ab3-4684-490f-97cd-5fe993ff8c52 -->
# Database Schema Migration and Codebase Audit Plan

## Phase 1: Codebase Audit and Analysis

### 1.1 Routing Structure Audit

- Review all route files in `src/app/` directory
- Verify route naming conventions and structure
- Check for broken or missing routes
- Document all routes and their purposes
- Identify routes that need database operations

### 1.2 Database Operations Audit

- Review all Server Actions in `src/app/actions/`:
- `cart.ts` - Cart operations
- `checkout.ts` - Checkout and order processing
- `deposit.ts` - Wallet deposit operations
- `notifications.ts` - Notification management
- `order.ts` - Order management
- `payout.ts` - Payout operations
- `referral.ts` - Referral system
- `transactions.ts` - Transaction history
- `wallet.ts` - Wallet balance operations
- Review client-side database queries in page components
- Check for hardcoded table/column names
- Verify foreign key relationships match declarative schema
- Identify queries using deprecated or incorrect column names

### 1.3 Declarative Schema Verification

- Compare `supabase/schemas/*.sql` files with actual database usage
- Verify all tables referenced in code exist in schema files
- Check ENUM types match usage in code
- Verify RLS policies align with code expectations
- Check storage bucket definitions match usage

## Phase 2: Database Operations Alignment

### 2.1 Fix Table/Column Name Mismatches

- Update all queries to use correct table names from declarative schema
- Fix column name inconsistencies (e.g., `user_id` vs `userId`, snake_case vs camelCase)
- Ensure foreign key references match schema definitions
- Update JOIN queries to match schema relationships

### 2.2 Fix ENUM Type Usage

- Verify all ENUM values in code match `01_enums.sql`
- Update any hardcoded status strings to use proper ENUM values
- Fix type mismatches in queries

### 2.3 Update RLS Policy Dependencies

- Ensure all queries respect RLS policies defined in `16_policies.sql`
- Fix queries that may fail due to RLS restrictions
- Add proper error handling for RLS violations

### 2.4 Storage Bucket Alignment

- Verify storage bucket names match `17_storage.sql`
- Update file upload operations to use correct bucket names
- Fix storage policy references

## Phase 3: Migration File Management

### 3.1 Archive Old Migrations

- Create `supabase/migrations/archive/` directory
- Move all 15 existing migration files to archive
- Keep migrations for historical reference
- Document migration history in `MIGRATION_HISTORY.md`

### 3.2 Verify Declarative Schema Completeness

- Ensure all tables from migrations exist in declarative schemas
- Verify all functions from migrations exist in `15_functions.sql`
- Check all triggers are included
- Confirm all indexes are defined

## Phase 4: Supabase CLI Setup Verification

### 4.1 CLI Installation Check

- Verify Supabase CLI is installed: `supabase --version`
- Check if linked to remote project: `supabase projects list`
- Verify project reference: `qioaeiqrwjcbbbavhack`

### 4.2 Config.toml Verification

- Verify `schema_paths = ["./schemas/*.sql"]` is set
- Verify `sql_paths = ["./seeds/comprehensive_test_data.sql"]` is set
- Check storage bucket configuration
- Verify database version matches remote

### 4.3 Remote Database Sync Status

- Check migration status: `supabase migration list --linked`
- Verify all migrations are applied remotely
- Document any pending migrations

## Phase 5: Routing Fixes

### 5.1 Fix Broken Routes

- Identify routes with 404 or errors
- Fix missing route handlers
- Update route parameters to match usage

### 5.2 Update Route Database Queries

- Fix queries in route handlers to match declarative schema
- Update dynamic route parameters (e.g., `[slug]`, `[id]`)
- Fix server component queries

### 5.3 Authentication Route Alignment

- Verify auth routes (`/login`, `/signup`, `/auth/callback`) work correctly
- Check redirect logic
- Verify session handling

## Phase 6: Testing and Validation

### 6.1 Database Query Testing

- Test all Server Actions with correct schema
- Verify queries return expected data
- Check error handling

### 6.2 Route Testing

- Test all routes for proper rendering
- Verify database operations in routes
- Check authentication flows

### 6.3 Schema Validation

- Run `supabase db diff` to check for schema drift
- Verify no unexpected differences
- Document any manual fixes needed

## Files to Modify

### Server Actions (Priority Order)

1. `src/app/actions/cart.ts` - Fix cart table references
2. `src/app/actions/checkout.ts` - Fix order and payment references
3. `src/app/actions/wallet.ts` - Fix wallet table references
4. `src/app/actions/order.ts` - Fix order table references
5. `src/app/actions/transactions.ts` - Fix transaction table references
6. `src/app/actions/deposit.ts` - Fix deposit operations
7. `src/app/actions/payout.ts` - Fix payout operations
8. `src/app/actions/notifications.ts` - Fix notification table references
9. `src/app/actions/referral.ts` - Fix referral table references

### Page Components (Priority Order)

1. `src/app/products/page.tsx` - Fix product queries
2. `src/app/product/[slug]/page.tsx` - Fix product detail queries
3. `src/app/store/[slug]/page.tsx` - Fix store queries
4. `src/app/cart/page.tsx` - Fix cart queries
5. `src/app/checkout/page.tsx` - Fix checkout queries
6. `src/app/orders/[id]/page.tsx` - Fix order queries
7. `src/app/seller/*/page.tsx` - Fix seller dashboard queries
8. `src/app/admin/*/page.tsx` - Fix admin queries

### Configuration Files

1. `supabase/config.toml` - Verify and update if needed
2. Create `MIGRATION_HISTORY.md` - Document migration archive

## Important Notes

- All database operations must use table/column names from declarative schemas
- ENUM values must match `01_enums.sql` exactly
- RLS policies must be respected in all queries
- Storage bucket names must match `17_storage.sql`
- Migration files are archived, not deleted, for reference
- Test each fix before moving to the next
- Document any schema discrepancies found

## Verification Steps

1. Run `supabase db diff` - Should show no unexpected differences
2. Test all Server Actions - Should work without errors
3. Test all routes - Should render correctly
4. Check Supabase Dashboard - Verify all tables exist
5. Test authentication flow - Should work end-to-end
6. Test checkout flow - Should complete successfully

### To-dos

- [ ] Install Supabase CLI on Windows (manual download or Scoop)
- [ ] Create supabase/schemas/ directory structure
- [ ] Extract all ENUM types from migrations into supabase/schemas/01_enums.sql
- [ ] Extract all table definitions from migrations into organized schema files (02-14)
- [ ] Extract all functions and triggers into supabase/schemas/15_functions.sql
- [ ] Extract all RLS policies into supabase/schemas/16_policies.sql
- [ ] Create supabase/schemas/17_storage.sql with all storage buckets and policies
- [ ] Create supabase/seeds/ directory and move seed_comprehensive_test_data.sql
- [ ] Update supabase/config.toml with schema_paths and seed paths
- [ ] Run supabase db diff to generate initial migration from declarative schemas
- [ ] Test local Supabase instance with new schema structure
- [ ] Create DATABASE_SCHEMA.md and update README.md with CLI instructions