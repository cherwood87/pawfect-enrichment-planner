
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ActivityModalHeaderProps {
  onClose: () => void;
}

const ActivityModalHeader: React.FC<ActivityModalHeaderProps> = ({ onClose }) => {
  return (
    <DialogHeader>
      <div className="flex items-center justify-between">
        <DialogTitle className="text-2xl font-bold text-gray-800">
          Activity Library
        </DialogTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </DialogHeader>
  );
};

export default ActivityModalHeader;
