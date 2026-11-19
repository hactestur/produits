import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  ''
).trim();

export const isSupabaseConfigured = Boolean(
  rawUrl && 
  rawKey && 
  rawUrl.startsWith('http') &&
  !rawUrl.includes('placeholder') &&
  !rawKey.includes('...')
);

const supabaseUrl = rawUrl;
const supabaseAnonKey = rawKey;

// We export a clean client without rigid generic mismatch so queries don't collapse to 'never'
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const STORAGE_BUCKET_NAME = 'product-images';
