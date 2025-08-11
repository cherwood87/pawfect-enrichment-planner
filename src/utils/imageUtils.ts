import { supabase } from '@/integrations/supabase/client';

export interface ImageUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export const uploadDogImage = async (
  imageFile: File,
  userId: string,
  dogId?: string
): Promise<ImageUploadResult> => {
  try {
    // Create unique filename
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${userId}/${dogId || 'temp'}_${Date.now()}.${fileExt}`;

    console.log('📸 Uploading dog image to storage:', fileName);

    const { data, error } = await supabase.storage
      .from('dog-images')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Error uploading image:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('dog-images')
      .getPublicUrl(data.path);

    console.log('✅ Image uploaded successfully:', publicUrl);
    return { success: true, imageUrl: publicUrl };

  } catch (error) {
    console.error('❌ Image upload failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
};

export const deleteDogImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const userId = urlParts[urlParts.length - 2];
    const filePath = `${userId}/${fileName}`;

    console.log('🗑️ Deleting dog image from storage:', filePath);

    const { error } = await supabase.storage
      .from('dog-images')
      .remove([filePath]);

    if (error) {
      console.error('❌ Error deleting image:', error);
      return false;
    }

    console.log('✅ Image deleted successfully');
    return true;

  } catch (error) {
    console.error('❌ Image deletion failed:', error);
    return false;
  }
};

export const convertBase64ToFile = (base64: string, fileName: string): File | null => {
  try {
    // Check if it's a valid base64 data URL
    if (!base64.startsWith('data:')) {
      return null;
    }

    const [header, data] = base64.split(',');
    const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
    
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: mimeType });

  } catch (error) {
    console.error('❌ Base64 conversion failed:', error);
    return null;
  }
};

// Helper to migrate existing base64 images to storage
export const migrateBase64ToStorage = async (
  base64Image: string,
  userId: string,
  dogId: string
): Promise<string | null> => {
  try {
    if (!base64Image.startsWith('data:')) {
      // Already a URL, return as-is
      return base64Image;
    }

    console.log('🔄 Migrating base64 image to storage for dog:', dogId);

    const file = convertBase64ToFile(base64Image, `dog_${dogId}.jpg`);
    if (!file) {
      console.error('❌ Failed to convert base64 to file');
      return null;
    }

    const result = await uploadDogImage(file, userId, dogId);
    if (result.success && result.imageUrl) {
      console.log('✅ Base64 image migrated to storage');
      return result.imageUrl;
    }

    return null;
  } catch (error) {
    console.error('❌ Base64 migration failed:', error);
    return null;
  }
};