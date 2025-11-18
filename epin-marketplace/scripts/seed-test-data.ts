/**
 * Script to seed test data
 * Run with: npx tsx scripts/seed-test-data.ts
 * 
 * This script seeds test data including:
 * - Test categories (with "test" in name)
 * - Test products
 * - Test users (via Supabase Auth)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

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

async function seedTestData() {
  try {
    // Read and execute SQL seed file
    const seedSqlPath = join(process.cwd(), 'supabase', 'seed_test_data.sql');
    const seedSql = readFileSync(seedSqlPath, 'utf-8');

    // Execute SQL statements
    const { error } = await supabase.rpc('exec_sql', { sql_query: seedSql });

    if (error) {
      // If RPC doesn't exist, try executing via direct SQL
      console.log('RPC method not available, executing SQL directly...');
      
      // Split SQL into individual statements
      const statements = seedSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        try {
          // Note: Direct SQL execution requires Supabase SQL Editor or CLI
          console.log('Please execute seed_test_data.sql manually in Supabase SQL Editor');
          break;
        } catch (err) {
          console.error('Error executing statement:', err);
        }
      }
    } else {
      console.log('Test data seeded successfully');
    }

    // Create test users via Auth API
    const testUsers = [
      {
        email: 'test-seller@epinmarketplace.com',
        password: 'test123456',
        role: 'seller',
        full_name: 'Test Seller',
      },
      {
        email: 'test-buyer@epinmarketplace.com',
        password: 'test123456',
        role: 'buyer',
        full_name: 'Test Buyer',
      },
      {
        email: 'test-creator@epinmarketplace.com',
        password: 'test123456',
        role: 'creator',
        full_name: 'Test Creator',
      },
    ];

    for (const user of testUsers) {
      try {
        // Check if user exists
        const { data: existingUser } = await supabase.auth.admin.getUserByEmail(user.email);

        if (existingUser?.user) {
          console.log(`User already exists: ${user.email}`);
          continue;
        }

        // Create user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name,
            role: user.role,
            is_test: true,
          },
        });

        if (createError) {
          console.error(`Error creating user ${user.email}:`, createError);
          continue;
        }

        if (newUser.user) {
          // Update profile
          await supabase
            .from('profiles')
            .update({
              role: user.role as any,
              metadata: {
                is_test: true,
              },
            })
            .eq('id', newUser.user.id);

          console.log(`Test user created: ${user.email} (${user.role})`);
        }
      } catch (error: any) {
        console.error(`Error processing user ${user.email}:`, error.message);
      }
    }

    console.log('\n✅ Test data seeding completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Execute seed_test_data.sql in Supabase SQL Editor');
    console.log('2. Create admin user: npx tsx scripts/create-admin-user.ts');
    console.log('3. Test users created via this script');
  } catch (error: any) {
    console.error('Error seeding test data:', error);
  }
}

seedTestData();

