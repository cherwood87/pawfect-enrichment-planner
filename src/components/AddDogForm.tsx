
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import { useIsMobile } from '@/hooks/use-mobile';
import DogFormFields from './DogFormFields';

interface AddDogFormProps {
  onClose: () => void;
}

const AddDogForm: React.FC<AddDogFormProps> = ({ onClose }) => {
  const { addDog } = useDog();
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
    
    if (!formData.name.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log('Adding dog with data:', formData);
      
      addDog({
        name: formData.name.trim(),
        age: parseInt(formData.age) || 0,
        breed: formData.breed.trim() || 'Unknown',
        gender: formData.gender as 'Male' | 'Female' | 'Unknown',
        breedGroup: formData.breedGroup,
        mobilityIssues: formData.mobilityIssues,
        image: formData.image,
        notes: formData.notes.trim()
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
    <Card className={`${isMobile ? 'w-full h-full' : 'max-w-lg'} mx-auto`}>
      <CardHeader className="mobile-card">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold text-gray-800">Add New Dog</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="touch-target">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className={`${isMobile ? 'overflow-y-auto flex-1' : ''}`}>
        <form onSubmit={handleSubmit} className="mobile-space-y">
          <DogFormFields
            formData={formData}
            onFormDataChange={setFormData}
          />

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 touch-target"
            disabled={!formData.name.trim() || isSubmitting}
          >
            {isSubmitting ? 'Adding Dog...' : 'Add Dog'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDogForm;
