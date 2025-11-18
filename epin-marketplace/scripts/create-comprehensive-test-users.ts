/**
 * Comprehensive Test Users Creation Script
 * Creates multiple test users for comprehensive testing
 * 
 * Run with: npx tsx scripts/create-comprehensive-test-users.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface TestUser {
  email: string;
  password: string;
  role: 'buyer' | 'seller' | 'creator' | 'admin';
  fullName: string;
  metadata?: Record<string, any>;
}

const testUsers: TestUser[] = [
  // Admin
  {
    email: 'turhanhamza@gmail.com',
    password: 'dodo6171',
    role: 'admin',
    fullName: 'Admin User',
    metadata: { is_admin: true, is_test: false },
  },
  // Sellers (10 sellers)
  ...Array.from({ length: 10 }, (_, i) => ({
    email: `test-seller-${i + 1}@epinmarketplace.com`,
    password: 'test123456',
    role: 'seller' as const,
    fullName: `Test Seller ${i + 1}`,
    metadata: { is_test: true, seller_tier: i < 3 ? 'premium' : i < 7 ? 'verified' : 'standard' },
  })),
  // Buyers (20 buyers)
  ...Array.from({ length: 20 }, (_, i) => ({
    email: `test-buyer-${i + 1}@epinmarketplace.com`,
    password: 'test123456',
    role: 'buyer' as const,
    fullName: `Test Buyer ${i + 1}`,
    metadata: { is_test: true, buyer_tier: i < 5 ? 'vip' : i < 10 ? 'premium' : 'standard' },
  })),
  // Creators/Influencers (5 creators)
  ...Array.from({ length: 5 }, (_, i) => ({
    email: `test-creator-${i + 1}@epinmarketplace.com`,
    password: 'test123456',
    role: 'creator' as const,
    fullName: `Test Creator ${i + 1}`,
    metadata: { 
      is_test: true, 
      influencer_tier: i < 2 ? 'top' : i < 4 ? 'mid' : 'starter',
      platforms: ['twitch', 'youtube', 'instagram'].slice(0, i + 1),
    },
  })),
];

async function createTestUsers() {
  const results = {
    created: 0,
    updated: 0,
    errors: 0,
  };

  for (const user of testUsers) {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(user.email);

      if (existingUser?.user) {
        console.log(`User already exists: ${user.email}`);
        
        // Update profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            role: user.role,
            full_name: user.fullName,
            metadata: user.metadata || {},
          })
          .eq('id', existingUser.user.id);

        if (updateError) {
          console.error(`Error updating profile for ${user.email}:`, updateError);
          results.errors++;
        } else {
          results.updated++;
        }
        continue;
      }

      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          role: user.role,
          ...user.metadata,
        },
      });

      if (createError) {
        console.error(`Error creating user ${user.email}:`, createError);
        results.errors++;
        continue;
      }

      if (newUser.user) {
        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            role: user.role,
            full_name: user.fullName,
            metadata: user.metadata || {},
          })
          .eq('id', newUser.user.id);

        if (profileError) {
          console.error(`Error updating profile for ${user.email}:`, profileError);
        } else {
          console.log(`✅ Created: ${user.email} (${user.role})`);
          results.created++;
        }
      }
    } catch (error: any) {
      console.error(`Unexpected error for ${user.email}:`, error.message);
      results.errors++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Created: ${results.created}`);
  console.log(`🔄 Updated: ${results.updated}`);
  console.log(`❌ Errors: ${results.errors}`);
  console.log(`\n📝 Total users: ${testUsers.length}`);
}

createTestUsers();

