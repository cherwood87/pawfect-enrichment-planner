
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (image: string | undefined) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageChange, 
  className = "" 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleFileSelect = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      console.warn('Invalid file type selected:', file?.type);
      setError('Please select a valid image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.warn('File too large:', file.size);
      setError('Image must be less than 5MB');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      console.log('Processing image file:', file.name, file.size);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          console.log('Image processed successfully');
          onImageChange(result);
          setIsProcessing(false);
        } catch (error) {
          console.error('Error processing image result:', error);
          setError('Failed to process image');
          setIsProcessing(false);
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setError('Failed to read image file');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image');
      setIsProcessing(false);
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
    if (!isProcessing) {
      setError(null);
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Removing image');
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
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${currentImage ? 'border-solid' : ''}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-400 bg-red-50' : ''}
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
              disabled={isProcessing}
            >
              <X className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
            </Button>
          </>
        ) : (
          <div className="text-center">
            <Camera className={`${iconSize} text-gray-400 mx-auto mb-1`} />
            <div className="text-xs text-gray-500">
              {isProcessing ? 'Processing...' : error ? 'Try Again' : 'Add Photo'}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="absolute top-full left-0 mt-1 text-xs text-red-500 text-center w-full">
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
        disabled={isProcessing}
      />
    </div>
  );
};

export default ImageUpload;
