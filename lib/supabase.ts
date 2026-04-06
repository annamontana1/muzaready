import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton — nezhavaruje při buildu kdy env vars nejsou dostupné
let _supabase: SupabaseClient | null = null;

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
