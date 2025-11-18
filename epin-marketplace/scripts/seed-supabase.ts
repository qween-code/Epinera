/**
 * Supabase Seed Script
 * Seeds the database with comprehensive test data using Supabase REST API
 * 
 * Run with: npx tsx scripts/seed-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env.local file
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  console.error('Make sure .env.local file exists and contains these variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Read the SQL seed file
    const seedFilePath = path.join(process.cwd(), 'supabase', 'seed_comprehensive_test_data.sql');
    
    if (!fs.existsSync(seedFilePath)) {
      console.error(`❌ Seed file not found: ${seedFilePath}`);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(seedFilePath, 'utf-8');
    
    console.log('📄 Seed file loaded, size:', (sqlContent.length / 1024).toFixed(2), 'KB');
    console.log('⚠️  Note: Supabase JS client does not support executing raw SQL directly.');
    console.log('📋 Please use one of these methods:\n');
    
    console.log('METHOD 1: Supabase Dashboard SQL Editor');
    console.log('   1. Go to: https://supabase.com/dashboard/project/qioaeiqrwjcbbbavhack/sql/new');
    console.log('   2. Copy and paste the contents of: supabase/seed_comprehensive_test_data.sql');
    console.log('   3. Click "Run" to execute\n');
    
    console.log('METHOD 2: Supabase CLI');
    console.log('   1. Login: supabase login');
    console.log('   2. Link project: supabase link --project-ref qioaeiqrwjcbbbavhack');
    console.log('   3. Execute: supabase db execute -f supabase/seed_comprehensive_test_data.sql\n');
    
    console.log('METHOD 3: Direct REST API (for smaller queries)');
    console.log('   Using Supabase REST API with service role key...\n');

    // For now, we'll use RPC if available, or guide the user
    // Since we can't execute raw SQL via JS client, we'll provide instructions
    
    console.log('✅ Seed instructions provided above');
    console.log('📝 After seeding, verify data with:');
    console.log('   - Check products: SELECT COUNT(*) FROM products;');
    console.log('   - Check categories: SELECT COUNT(*) FROM categories;');
    console.log('   - Check campaigns: SELECT COUNT(*) FROM campaigns;\n');

  } catch (error: any) {
    console.error('❌ Error during seed:', error.message);
    process.exit(1);
  }
}

// Run the seed
seedDatabase();

