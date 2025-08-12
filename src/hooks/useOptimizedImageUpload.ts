import { useState, useCallback } from 'react';
import { uploadDogImage, ImageUploadResult } from '@/utils/imageUtils';
import { useAuth } from '@/contexts/AuthContext';

interface OptimizedImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg';
}

interface UploadProgress {
  progress: number;
  stage: 'compressing' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export const useOptimizedImageUpload = (options: OptimizedImageUploadOptions = {}) => {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ progress: 0, stage: 'complete' });
  const [isUploading, setIsUploading] = useState(false);

  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    format = 'webp'
  } = options;

  const compressImage = useCallback((
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number,
    format: 'webp' | 'jpeg'
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File(
                [blob], 
                `compressed_${file.name.split('.')[0]}.${format}`, 
                { type: `image/${format}` }
              );
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const uploadOptimizedImage = useCallback(async (
    file: File,
    dogId?: string
  ): Promise<ImageUploadResult> => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setIsUploading(true);
      setUploadProgress({ progress: 10, stage: 'compressing' });

      // Compress image
      const compressedFile = await compressImage(file, maxWidth, maxHeight, quality, format);
      
      setUploadProgress({ progress: 30, stage: 'compressing' });

      // Fallback to JPEG if WebP compression failed or is too large
      let finalFile = compressedFile;
      if (format === 'webp' && compressedFile.size > file.size * 0.8) {
        const jpegFile = await compressImage(file, maxWidth, maxHeight, quality, 'jpeg');
        if (jpegFile.size < compressedFile.size) {
          finalFile = jpegFile;
        }
      }

      setUploadProgress({ progress: 50, stage: 'uploading' });

      // Upload to Supabase Storage
      const result = await uploadDogImage(finalFile, user.id, dogId);
      
      if (result.success) {
        setUploadProgress({ progress: 100, stage: 'complete' });
        return result;
      } else {
        setUploadProgress({ progress: 0, stage: 'error', error: result.error });
        return result;
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadProgress({ progress: 0, stage: 'error', error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress({ progress: 0, stage: 'complete' });
      }, 2000);
    }
  }, [user?.id, compressImage, maxWidth, maxHeight, quality, format]);

  const validateImageFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // File type validation
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select a valid image file' };
    }

    // File size validation (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'Image must be less than 5MB' };
    }

    // Supported formats
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!supportedFormats.includes(file.type)) {
      return { valid: false, error: 'Supported formats: JPEG, PNG, WebP, GIF' };
    }

    return { valid: true };
  }, []);

  return {
    uploadOptimizedImage,
    validateImageFile,
    uploadProgress,
    isUploading
  };
};