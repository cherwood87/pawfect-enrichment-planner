
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import { MOBILITY_ISSUES, POPULAR_BREEDS } from '@/types/dog';
import ImageUpload from './ImageUpload';

interface AddDogFormProps {
  onClose: () => void;
}

const AddDogForm: React.FC<AddDogFormProps> = ({ onClose }) => {
  const { addDog } = useDog();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    breed: '',
    customBreed: '',
    mobilityIssues: [] as string[],
    image: undefined as string | undefined,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    const breed = formData.breed === 'Other' ? formData.customBreed : formData.breed;
    
    addDog({
      name: formData.name.trim(),
      age: parseInt(formData.age) || 0,
      breed: breed || 'Unknown',
      mobilityIssues: formData.mobilityIssues,
      image: formData.image,
      notes: formData.notes.trim()
    });
    
    onClose();
  };

  const handleMobilityIssueChange = (issue: string, checked: boolean) => {
    if (issue === 'None') {
      setFormData(prev => ({
        ...prev,
        mobilityIssues: checked ? ['None'] : []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        mobilityIssues: checked 
          ? [...prev.mobilityIssues.filter(i => i !== 'None'), issue]
          : prev.mobilityIssues.filter(i => i !== issue)
      }));
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
          {/* Photo Upload */}
          <div className="flex justify-center">
            <ImageUpload
              currentImage={formData.image}
              onImageChange={(image) => setFormData(prev => ({ ...prev, image }))}
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter dog's name"
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="30"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Age"
              />
            </div>
          </div>

          {/* Breed */}
          <div>
            <Label htmlFor="breed">Breed</Label>
            <Select value={formData.breed} onValueChange={(value) => setFormData(prev => ({ ...prev, breed: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_BREEDS.map((breed) => (
                  <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {formData.breed === 'Other' && (
              <Input
                className="mt-2"
                value={formData.customBreed}
                onChange={(e) => setFormData(prev => ({ ...prev, customBreed: e.target.value }))}
                placeholder="Enter breed"
              />
            )}
          </div>

          {/* Mobility Issues */}
          <div>
            <Label>Mobility Considerations</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {MOBILITY_ISSUES.map((issue) => (
                <div key={issue} className="flex items-center space-x-2">
                  <Checkbox
                    id={issue}
                    checked={formData.mobilityIssues.includes(issue)}
                    onCheckedChange={(checked) => handleMobilityIssueChange(issue, !!checked)}
                  />
                  <Label htmlFor={issue} className="text-sm cursor-pointer">
                    {issue}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Special considerations or notes"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
            disabled={!formData.name.trim()}
          >
            Add Dog
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDogForm;
