import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Development mock user ID when auth is not configured
export const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

export const getCurrentUserId = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return session.user.id;
    }
  } catch (error) {
    console.error('Error fetching session:', error);
  }
  // Fallback to mock user ID for local development if not authenticated
  console.warn('No authenticated user found. Using MOCK_USER_ID for development.');
  return MOCK_USER_ID;
};
