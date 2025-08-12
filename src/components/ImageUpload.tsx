
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOptimizedImageUpload } from '@/hooks/useOptimizedImageUpload';
import { Progress } from '@/components/ui/progress';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (image: string | undefined) => void;
  className?: string;
  dogId?: string;
  useStorageUpload?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageChange, 
  className = "",
  dogId,
  useStorageUpload = true
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const { uploadOptimizedImage, validateImageFile, uploadProgress, isUploading } = useOptimizedImageUpload({
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.85,
    format: 'webp'
  });

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setError(null);
      
      if (useStorageUpload) {
        // Upload to Supabase Storage with optimization
        const result = await uploadOptimizedImage(file, dogId);
        
        if (result.success && result.imageUrl) {
          onImageChange(result.imageUrl);
        } else {
          setError(result.error || 'Upload failed');
        }
      } else {
        // Fallback to base64 for backward compatibility
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const result = e.target?.result as string;
            onImageChange(result);
          } catch (error) {
            console.error('Error processing image result:', error);
            setError('Failed to process image');
          }
        };
        reader.onerror = () => {
          setError('Failed to read image file');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    if (!isUploading) {
      setError(null);
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onImageChange(undefined);
  };

  const avatarSize = isMobile ? 'w-20 h-20' : 'w-24 h-24';
  const removeButtonSize = isMobile ? 'w-5 h-5' : 'w-6 h-6';
  const iconSize = isMobile ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          ${avatarSize} rounded-full border-2 border-dashed cursor-pointer
          flex items-center justify-center transition-colors touch-target
          ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${currentImage ? 'border-solid' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-destructive bg-destructive/5' : ''}
        `}
      >
        {currentImage ? (
          <>
            <img 
              src={currentImage} 
              alt="Dog" 
              className={`${avatarSize} rounded-full object-cover`}
              onError={(e) => {
                console.error('Error loading image:', e);
                setError('Failed to load image');
                onImageChange(undefined);
              }}
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              className={`absolute -top-2 -right-2 ${removeButtonSize} rounded-full p-0 touch-target`}
              disabled={isUploading}
            >
              <X className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
            </Button>
          </>
        ) : (
          <div className="text-center">
            {isUploading ? (
              <Loader2 className={`${iconSize} text-muted-foreground mx-auto mb-1 animate-spin`} />
            ) : (
              <Camera className={`${iconSize} text-muted-foreground mx-auto mb-1`} />
            )}
            <div className="text-xs text-muted-foreground">
              {isUploading ? uploadProgress.stage : error ? 'Try Again' : 'Add Photo'}
            </div>
          </div>
        )}
      </div>
      
      {/* Upload Progress */}
      {isUploading && uploadProgress.progress > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full">
          <Progress value={uploadProgress.progress} className="h-1" />
          <div className="text-xs text-center text-muted-foreground mt-1">
            {uploadProgress.stage === 'compressing' ? 'Optimizing...' : 'Uploading...'}
          </div>
        </div>
      )}
      
      {error && !isUploading && (
        <div className="absolute top-full left-0 mt-1 text-xs text-destructive text-center w-full">
          {error}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUpload;
