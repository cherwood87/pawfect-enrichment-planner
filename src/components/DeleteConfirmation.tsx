
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dog } from '@/types/dog';

interface DeleteConfirmationProps {
  dog: Dog;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ 
  dog, 
  onConfirm, 
  onCancel 
}) => {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-800 text-center">
          Delete {dog.name}?
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">
          This will permanently delete {dog.name}'s profile and all associated data. This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            className="flex-1"
          >
            Delete Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeleteConfirmation;
