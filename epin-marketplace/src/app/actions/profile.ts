'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfilePhoto(avatarUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (error) throw error;

    revalidatePath('/complete-profile');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function connectSocialAccount(provider: 'discord' | 'x' | 'steam' | 'twitch', accountId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    const currentMetadata = (profile?.metadata as any) || {};
    const socialAccounts = currentMetadata.social_accounts || {};

    // Update social account
    socialAccounts[provider] = {
      account_id: accountId,
      connected_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update({
        metadata: {
          ...currentMetadata,
          social_accounts: socialAccounts,
        },
      })
      .eq('id', user.id);

    if (error) throw error;

    revalidatePath('/complete-profile');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function applyReferralCode(code: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Check if referral code exists and is valid
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', code.toUpperCase())
      .single();

    if (referralError || !referral) {
      return { success: false, error: 'Invalid referral code' };
    }

    // Check if user already used a referral code
    const { data: profile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single();

    const metadata = (profile?.metadata as any) || {};
    if (metadata.referral_code_used) {
      return { success: false, error: 'You have already used a referral code' };
    }

    // Check if user is trying to use their own code
    if (referral.referrer_id === user.id) {
      return { success: false, error: 'You cannot use your own referral code' };
    }

    // Check if user was already referred by this code
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_id', user.id)
      .eq('referral_code', code.toUpperCase())
      .single();

    if (existingReferral) {
      return { success: false, error: 'You have already used this referral code' };
    }

    // Apply referral code
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        metadata: {
          ...metadata,
          referral_code_used: code.toUpperCase(),
          referral_applied_at: new Date().toISOString(),
        },
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Update referral relationship
    const { error: relationError } = await supabase
      .from('referrals')
      .update({
        referred_id: user.id,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', referral.id);

    if (relationError) throw relationError;

    revalidatePath('/complete-profile');
    return { success: true, message: 'Referral code applied successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateNotificationPreferences(preferences: {
  email: boolean;
  push: boolean;
  sms: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single();

    const metadata = (profile?.metadata as any) || {};

    const { error } = await supabase
      .from('profiles')
      .update({
        metadata: {
          ...metadata,
          notification_preferences: preferences,
        },
      })
      .eq('id', user.id);

    if (error) throw error;

    revalidatePath('/complete-profile');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateGameGenres(genres: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single();

    const metadata = (profile?.metadata as any) || {};

    const { error } = await supabase
      .from('profiles')
      .update({
        metadata: {
          ...metadata,
          favorite_genres: genres,
        },
      })
      .eq('id', user.id);

    if (error) throw error;

    revalidatePath('/complete-profile');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProfileCompletion() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { completion: 0, missingFields: [] };
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return { completion: 0, missingFields: ['profile'] };
    }

    const metadata = (profile.metadata as any) || {};
    let completedFields = 0;
    const totalFields = 7;
    const missingFields: string[] = [];

    // Check each field
    if (profile.avatar_url) completedFields++;
    else missingFields.push('avatar');

    if (metadata.social_accounts && Object.keys(metadata.social_accounts).length > 0) completedFields++;
    else missingFields.push('social_accounts');

    if (metadata.referral_code_used) completedFields++;
    else missingFields.push('referral_code');

    if (metadata.notification_preferences) completedFields++;
    else missingFields.push('notification_preferences');

    if (metadata.favorite_genres && metadata.favorite_genres.length > 0) completedFields++;
    else missingFields.push('favorite_genres');

    if (profile.full_name) completedFields++;
    else missingFields.push('full_name');

    if (profile.phone) completedFields++;
    else missingFields.push('phone');

    const completion = Math.round((completedFields / totalFields) * 100);

    return { completion, missingFields };
  } catch (error: any) {
    return { completion: 0, missingFields: [], error: error.message };
  }
}

