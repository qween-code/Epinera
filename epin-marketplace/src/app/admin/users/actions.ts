'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Giris yapmaniz gerekiyor' };

  const { data: admin } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!admin || admin.role !== 'admin') return { error: 'Yetkiniz yok' };

  const validRoles = ['buyer', 'seller', 'creator', 'admin'];
  if (!validRoles.includes(newRole)) return { error: 'Gecersiz rol' };

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) return { error: error.message };

  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateKycStatus(userId: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Giris yapmaniz gerekiyor' };

  const { data: admin } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!admin || admin.role !== 'admin') return { error: 'Yetkiniz yok' };

  const validStatuses = ['pending', 'verified', 'rejected'];
  if (!validStatuses.includes(status)) return { error: 'Gecersiz durum' };

  const { error } = await supabase
    .from('profiles')
    .update({ kyc_status: status })
    .eq('id', userId);

  if (error) return { error: error.message };

  revalidatePath('/admin/users');
  return { success: true };
}
