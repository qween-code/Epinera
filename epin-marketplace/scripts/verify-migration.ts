import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase environment variables not found!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function verifyMigration() {
  console.log('🔍 Migration doğrulanıyor...\n');

  // Check if discount code columns exist
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('code, discount_percentage, discount_amount, currency, valid_from, valid_until')
      .limit(1);

    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('❌ Migration henüz uygulanmamış!');
        console.log('\n📝 Migration\'ı uygulamak için:');
        console.log('1. Supabase Dashboard\'a gidin: https://supabase.com/dashboard');
        console.log('2. SQL Editor\'ü açın');
        console.log('3. Şu dosyayı çalıştırın: supabase/migrations/20251202000001_add_discount_code_fields.sql');
        return;
      }
      throw error;
    }

    console.log('✅ Discount code alanları mevcut!');
    console.log('\n📊 Test verisi ekleniyor...');

    // Try to insert a test discount campaign
    const { data: testCampaign, error: insertError } = await supabase
      .from('campaigns')
      .insert({
        name: 'Test Discount Campaign',
        campaign_type: 'discount',
        status: 'active',
        code: 'TEST20',
        discount_percentage: 20.00,
        currency: 'USD',
        valid_from: new Date().toISOString(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      })
      .select()
      .single();

    if (insertError) {
      console.log(`⚠️  Test verisi eklenemedi: ${insertError.message}`);
    } else {
      console.log('✅ Test discount campaign oluşturuldu!');
      console.log(`   Code: ${testCampaign.code}`);
      console.log(`   Discount: ${testCampaign.discount_percentage}%`);

      // Clean up test data
      await supabase.from('campaigns').delete().eq('id', testCampaign.id);
      console.log('🧹 Test verisi temizlendi');
    }

    console.log('\n🎉 Migration başarıyla doğrulandı!');
  } catch (err: any) {
    console.error('❌ Hata:', err.message);
    process.exit(1);
  }
}

verifyMigration();


