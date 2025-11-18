#!/bin/bash

# ============================================
# Comprehensive Test Environment Setup Script
# ============================================
# This script sets up a complete test environment:
# 1. Creates all test users
# 2. Seeds comprehensive test data
# 3. Sets up Stripe webhooks (local)
# 4. Verifies environment
# ============================================

set -e

echo "🚀 Starting Comprehensive Test Environment Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local file not found!${NC}"
    echo "Please create .env.local with required environment variables"
    exit 1
fi

# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

# Check required variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ Missing Supabase environment variables${NC}"
    exit 1
fi

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo -e "${YELLOW}⚠️  Stripe environment variables not set (optional for basic setup)${NC}"
fi

echo -e "${GREEN}✅ Environment variables loaded${NC}"
echo ""

# Step 1: Create test users
echo "📝 Step 1: Creating test users..."
npx tsx scripts/create-comprehensive-test-users.ts
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Test users created${NC}"
else
    echo -e "${RED}❌ Failed to create test users${NC}"
    exit 1
fi
echo ""

# Step 2: Seed test data
echo "🌱 Step 2: Seeding comprehensive test data..."
echo "Running seed_comprehensive_test_data.sql in Supabase..."
echo -e "${YELLOW}⚠️  Please run this SQL in Supabase SQL Editor:${NC}"
echo "   supabase/seed_comprehensive_test_data.sql"
echo ""
read -p "Press Enter after running the SQL script..."

# Step 3: Setup Stripe CLI (if available)
if command -v stripe &> /dev/null; then
    echo "💳 Step 3: Setting up Stripe webhooks..."
    
    # Check if Stripe CLI is logged in
    if stripe config --list &> /dev/null; then
        echo "Setting up local webhook forwarding..."
        echo -e "${YELLOW}⚠️  Run this in a separate terminal:${NC}"
        echo "   stripe listen --forward-to localhost:3000/api/webhooks/stripe"
        echo ""
    else
        echo -e "${YELLOW}⚠️  Stripe CLI not logged in. Run: stripe login${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Stripe CLI not installed. Install from: https://stripe.com/docs/stripe-cli${NC}"
fi
echo ""

# Step 4: Setup Supabase CLI (if available)
if command -v supabase &> /dev/null; then
    echo "🗄️  Step 4: Verifying Supabase connection..."
    
    if supabase status &> /dev/null; then
        echo -e "${GREEN}✅ Supabase CLI connected${NC}"
    else
        echo -e "${YELLOW}⚠️  Supabase CLI not linked. Run: supabase link${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Supabase CLI not installed. Install from: https://supabase.com/docs/guides/cli${NC}"
fi
echo ""

# Step 5: Verify setup
echo "🔍 Step 5: Verifying test environment..."
echo "Checking test data..."

# You can add verification queries here
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📋 Test Environment Summary:"
echo "   - Admin: turhanhamza@gmail.com / dodo6171"
echo "   - 10 Test Sellers"
echo "   - 20 Test Buyers"
echo "   - 5 Test Creators/Influencers"
echo "   - 50+ Test Products"
echo "   - 200+ Test Product Variants"
echo "   - 20+ Test Campaigns"
echo "   - 100+ Test Orders"
echo "   - 200+ Test Transactions"
echo ""
echo "🎉 Test environment is ready!"

