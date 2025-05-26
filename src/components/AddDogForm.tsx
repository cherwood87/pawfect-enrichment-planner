
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import DogFormFields from './DogFormFields';
import { useNavigate } from 'react-router-dom';

interface AddDogFormProps {
  onClose: () => void;
}

const AddDogForm: React.FC<AddDogFormProps> = ({ onClose }) => {
  const { addDog } = useDog();
  const navigate = useNavigate();
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
      // Stay on the current dashboard instead of navigating away
    } catch (error) {
      console.error('Error adding dog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">Add New Dog</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
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
