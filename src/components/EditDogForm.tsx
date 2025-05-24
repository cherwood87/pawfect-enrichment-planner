
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import { Dog } from '@/types/dog';
import DeleteConfirmation from './DeleteConfirmation';
import DogFormFields from './DogFormFields';

interface EditDogFormProps {
  dog: Dog;
  onClose: () => void;
}

const EditDogForm: React.FC<EditDogFormProps> = ({ dog, onClose }) => {
  const { updateDog, deleteDog } = useDog();
  const [formData, setFormData] = useState({
    name: dog.name,
    age: dog.age.toString(),
    breed: dog.breed,
    mobilityIssues: dog.mobilityIssues,
    image: dog.image,
    notes: dog.notes || ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    updateDog({
      ...dog,
      name: formData.name.trim(),
      age: parseInt(formData.age) || 0,
      breed: formData.breed.trim() || 'Unknown',
      mobilityIssues: formData.mobilityIssues,
      image: formData.image,
      notes: formData.notes.trim()
    });
    
    // Close the modal and stay on the current page (dogs dashboard)
    onClose();
  };

  const handleDelete = () => {
    deleteDog(dog.id);
    onClose();
  };

  if (showDeleteConfirm) {
    return (
      <DeleteConfirmation
        dog={dog}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">Edit {dog.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DogFormFields
            formData={formData}
            onFormDataChange={setFormData}
          />

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
            disabled={!formData.name.trim()}
          >
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditDogForm;
