/**
 * Supabase Client for Database and Storage Operations
 * Uses Supabase JavaScript SDK instead of direct PostgreSQL connection
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/utils/env';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });
  }
  
  return supabaseClient;
}

// Export a singleton instance
export const supabase = getSupabaseClient();

// Storage helper functions
export const supabaseStorage = {
  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(bucket: string, path: string, file: Blob | Buffer, contentType?: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true, // Overwrite if exists
      });

    if (error) throw error;
    return data;
  },

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  },

  /**
   * Download a file from storage
   */
  async downloadFile(bucket: string, path: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) throw error;
    return data;
  },

  /**
   * Delete a file from storage
   */
  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  },

  /**
   * List files in a folder
   */
  async listFiles(bucket: string, folder: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);

    if (error) throw error;
    return data;
  },
};
