
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MOBILITY_ISSUES } from '@/types/dog';
import ImageUpload from './ImageUpload';

interface DogFormData {
  name: string;
  age: string;
  breed: string;
  mobilityIssues: string[];
  image: string | undefined;
  notes: string;
}

interface DogFormFieldsProps {
  formData: DogFormData;
  onFormDataChange: (data: DogFormData) => void;
}

const DogFormFields: React.FC<DogFormFieldsProps> = ({ 
  formData, 
  onFormDataChange 
}) => {
  const handleMobilityIssueChange = (issue: string, checked: boolean) => {
    if (issue === 'None') {
      onFormDataChange({
        ...formData,
        mobilityIssues: checked ? ['None'] : []
      });
    } else {
      onFormDataChange({
        ...formData,
        mobilityIssues: checked 
          ? [...formData.mobilityIssues.filter(i => i !== 'None'), issue]
          : formData.mobilityIssues.filter(i => i !== issue)
      });
    }
  };

  const updateFormData = (field: keyof DogFormData, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      {/* Photo Upload */}
      <div className="flex justify-center">
        <ImageUpload
          currentImage={formData.image}
          onImageChange={(image) => updateFormData('image', image)}
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
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
            onChange={(e) => updateFormData('age', e.target.value)}
            placeholder="Age"
          />
        </div>
      </div>

      {/* Breed */}
      <div>
        <Label htmlFor="breed">Breed</Label>
        <Input
          id="breed"
          value={formData.breed}
          onChange={(e) => updateFormData('breed', e.target.value)}
          placeholder="Enter dog's breed"
        />
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
          onChange={(e) => updateFormData('notes', e.target.value)}
          placeholder="Special considerations or notes"
        />
      </div>
    </div>
  );
};

export default DogFormFields;
