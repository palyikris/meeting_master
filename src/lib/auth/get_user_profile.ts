import { createClient } from '../supabase/server';
import { cookies } from 'next/headers';
import { UserProfile } from '@/types';

export async function getUserProfileFromRequest(): Promise<UserProfile | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;


  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  

  return error ? null : data;
}
