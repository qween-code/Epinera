'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReferralCode(userId: string) {
  const supabase = await createClient();

  // Check if user already has a referral code
  const { data: existing } = await supabase
    .from('referrals')
    .select('referral_code')
    .eq('referrer_id', userId)
    .limit(1)
    .single();

  if (existing?.referral_code) {
    return { success: true, referralCode: existing.referral_code };
  }

  // Generate new referral code
  const referralCode = `USER${userId.substring(0, 8).toUpperCase()}`;

  const { data, error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: userId,
      referral_code: referralCode,
      status: 'pending',
    })
    .select('referral_code')
    .single();

  if (error) {
    console.error('Error creating referral code:', error);
    return { success: false, error: error.message };
  }

  return { success: true, referralCode: data.referral_code };
}

export async function getReferralStats(userId: string) {
  const supabase = await createClient();

  const { data: referrals, error } = await supabase
    .from('referrals')
    .select('id, status, reward_amount, reward_currency')
    .eq('referrer_id', userId);

  if (error) {
    console.error('Error fetching referral stats:', error);
    return {
      success: false,
      error: error.message,
      stats: {
        totalReferrals: 0,
        completedReferrals: 0,
        totalEarnings: 0,
        currentLevel: 1,
      },
    };
  }

  const totalReferrals = referrals?.length || 0;
  const completedReferrals = referrals?.filter((r) => r.status === 'completed').length || 0;
  const totalEarnings = referrals?.reduce(
    (sum, r) => sum + parseFloat(r.reward_amount?.toString() || '0'),
    0
  );
  const currentLevel = Math.min(Math.floor(completedReferrals / 3) + 1, 4);

  return {
    success: true,
    stats: {
      totalReferrals,
      completedReferrals,
      totalEarnings,
      currentLevel,
    },
  };
}

export async function processReferral(referralCode: string, referredUserId: string) {
  const supabase = await createClient();

  // Find the referrer by referral code
  const { data: referral, error: findError } = await supabase
    .from('referrals')
    .select('id, referrer_id, status')
    .eq('referral_code', referralCode.toUpperCase())
    .single();

  if (findError || !referral) {
    return { success: false, error: 'Invalid referral code' };
  }

  // Check if this user was already referred
  const { data: existing } = await supabase
    .from('referrals')
    .select('id')
    .eq('referred_id', referredUserId)
    .single();

  if (existing) {
    return { success: false, error: 'User already has a referral' };
  }

  // Update referral with referred user
  const { error: updateError } = await supabase
    .from('referrals')
    .update({
      referred_id: referredUserId,
      status: 'pending', // Will be updated to 'completed' after first purchase
    })
    .eq('id', referral.id);

  if (updateError) {
    console.error('Error processing referral:', updateError);
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

