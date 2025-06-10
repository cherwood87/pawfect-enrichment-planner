
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import DogFormFields from './DogFormFields';

interface AddDogFormProps {
  onClose: () => void;
}

const AddDogForm: React.FC<AddDogFormProps> = ({ onClose }) => {
  const { addDog } = useDog();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    breed: '',
    gender: 'Unknown' as 'Male' | 'Female' | 'Unknown',
    breedGroup: 'Unknown',
    mobilityIssues: [] as string[],
    image: undefined as string | undefined,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || isSubmitting || !user) return;
    
    try {
      setIsSubmitting(true);
      console.log('Adding dog with data:', formData);
      
      addDog({
        name: formData.name.trim(),
        age: parseInt(formData.age) || 0,
        breed: formData.breed.trim() || 'Unknown',
        weight: 0, // Default weight
        activityLevel: 'moderate', // Default activity level
        specialNeeds: '', // Default special needs
        gender: formData.gender as 'Male' | 'Female' | 'Unknown',
        breedGroup: formData.breedGroup,
        mobilityIssues: formData.mobilityIssues,
        image: formData.image,
        notes: formData.notes.trim(),
        userId: user.id // Add the required userId property
      });
      
      console.log('Dog added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding dog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <h2 className="font-bold text-gray-800">Add New Dog</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="touch-target">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 smooth-scroll">
        <form onSubmit={handleSubmit} className="mobile-space-y">
          <DogFormFields
            formData={formData}
            onFormDataChange={setFormData}
          />

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 touch-target"
            disabled={!formData.name.trim() || isSubmitting || !user}
          >
            {isSubmitting ? 'Adding Dog...' : 'Add Dog'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddDogForm;
