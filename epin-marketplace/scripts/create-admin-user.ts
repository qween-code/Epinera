/**
 * Script to create admin user
 * Run with: npx tsx scripts/create-admin-user.ts
 * 
 * This script creates an admin user in Supabase Auth
 * Email: turhanhamza@gmail.com
 * Password: dodo6171
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

async function createAdminUser() {
  const adminEmail = 'turhanhamza@gmail.com';
  const adminPassword = 'dodo6171';

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(adminEmail);

    if (existingUser?.user) {
      console.log('Admin user already exists:', adminEmail);
      
      // Update user to admin role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          metadata: {
            is_admin: true,
            is_test: false,
          },
        })
        .eq('id', existingUser.user.id);

      if (updateError) {
        console.error('Error updating admin profile:', updateError);
      } else {
        console.log('Admin profile updated successfully');
      }

      return;
    }

    // Create new admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User',
        role: 'admin',
        is_admin: true,
      },
    });

    if (createError) {
      console.error('Error creating admin user:', createError);
      return;
    }

    if (!newUser.user) {
      console.error('Failed to create admin user');
      return;
    }

    // Update profile to admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: 'admin',
        metadata: {
          is_admin: true,
          is_test: false,
        },
      })
      .eq('id', newUser.user.id);

    if (profileError) {
      console.error('Error updating admin profile:', profileError);
    } else {
      console.log('Admin user created successfully:', adminEmail);
      console.log('Password:', adminPassword);
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser();

