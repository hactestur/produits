import { supabase, isSupabaseConfigured, STORAGE_BUCKET_NAME } from '../config/supabase';
import { validateImageFile } from '../utils/validators';

export interface UploadResult {
  storagePath: string;
  publicUrl: string;
}

export const storageService = {
  /**
   * Upload une image dans le bucket de stockage
   */
  async uploadProductImage(productId: string, file: File): Promise<UploadResult> {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Fichier image invalide.');
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const cleanFileName = `${productId}/${timestamp}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw new Error(`Échec de l'envoi de la photo : ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        storagePath: data.path,
        publicUrl: urlData.publicUrl,
      };
    }

    // Mode Local / Démo : conversion en base64 pour persister dans l'état local
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          storagePath: `demo/${cleanFileName}`,
          publicUrl: reader.result as string,
        });
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier image.'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Supprime une photo du stockage
   */
  async deleteProductImage(storagePath: string): Promise<void> {
    if (isSupabaseConfigured && supabase && !storagePath.startsWith('demo/')) {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .remove([storagePath]);

      if (error) {
        console.warn('Storage deletion warning:', error.message);
      }
    }
  },
};
