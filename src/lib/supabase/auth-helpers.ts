import { SupabaseClient, User } from '@supabase/supabase-js';

export function isSuperAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.user_metadata?.role === 'super_admin';
}

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.user_metadata?.role === 'admin' || isSuperAdmin(user);
}

export async function requireSuperAdmin(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!isSuperAdmin(user)) {
    throw new Error('Unauthorized: Super admin access required');
  }

  return user;
}

export async function requireAdmin(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!isAdmin(user)) {
    throw new Error('Unauthorized: Admin access required');
  }

  return user;
}
