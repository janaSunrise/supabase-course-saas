import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createBrowserSupabaseClient as createClient } from '@supabase/auth-helpers-shared';

export const supabase = createBrowserSupabaseClient();

export const getServiceSupabase = () => {
  return createClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_SERVICE_KEY!,
  });
}
