import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton — nezhavaruje při buildu kdy env vars nejsou dostupné
let _supabase: SupabaseClient | null = null;

// Admin client with service role key — bypasses RLS, uses HTTPS (works regardless of IPv4/IPv6)
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Service role key bypasses RLS; anon key works too since admin_users has RLS disabled
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Missing Supabase URL or API key');
    }
    _supabaseAdmin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _supabaseAdmin;
}

export function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// Zpětná kompatibilita — proxy objekt delegující na lazy klienta
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseClient() as Record<string | symbol, unknown>)[prop];
  },
});

export const PRODUCT_IMAGES_BUCKET = 'product-images';

/**
 * Upload image to Supabase Storage
 * @param file - File to upload
 * @param folder - Optional folder path (e.g., 'skus')
 * @returns Public URL of uploaded image or null on error
 */
export async function uploadProductImage(
  file: File,
  folder: string = 'skus'
): Promise<string | null> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    const { data, error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
}
