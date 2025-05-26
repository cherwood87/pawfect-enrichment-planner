
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        setIsProcessing(true);
        console.log('Processing image file:', file.name, file.size);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          console.log('Image processed successfully');
          onImageChange(result);
          setIsProcessing(false);
        };
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image:', error);
        setIsProcessing(false);
      }
    } else {
      console.warn('Invalid file type selected:', file?.type);
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
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Removing image');
    onImageChange(undefined);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          w-24 h-24 rounded-full border-2 border-dashed cursor-pointer
          flex items-center justify-center transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${currentImage ? 'border-solid' : ''}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {currentImage ? (
          <>
            <img 
              src={currentImage} 
              alt="Dog" 
              className="w-24 h-24 rounded-full object-cover"
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              disabled={isProcessing}
            >
              <X className="w-3 h-3" />
            </Button>
          </>
        ) : (
          <div className="text-center">
            <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <div className="text-xs text-gray-500">
              {isProcessing ? 'Processing...' : 'Add Photo'}
            </div>
          </div>
        )}
      </div>
      
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
