
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOBILITY_ISSUES, GENDER_OPTIONS, BREED_GROUPS } from '@/types/dog';
import { useIsMobile } from '@/hooks/use-mobile';
import ImageUpload from './ImageUpload';

interface DogFormData {
  name: string;
  age: string;
  breed: string;
  gender: 'Male' | 'Female' | 'Unknown';
  breedGroup: string;
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
  const isMobile = useIsMobile();

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
    <div className="mobile-space-y">
      {/* Photo Upload */}
      <div className="flex justify-center">
        <ImageUpload
          currentImage={formData.image}
          onImageChange={(image) => updateFormData('image', image)}
          useStorageUpload={true}
        />
      </div>

      {/* Basic Info */}
      <div className={`grid ${isMobile ? 'grid-cols-1 space-y-4' : 'grid-cols-2 gap-4'}`}>
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Enter dog's name"
            required
            className="touch-target"
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
            className="touch-target"
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
          className="touch-target"
        />
      </div>

      {/* Gender and Breed Group */}
      <div className={`grid ${isMobile ? 'grid-cols-1 space-y-4' : 'grid-cols-2 gap-4'}`}>
        <div>
          <Label>Gender</Label>
          <RadioGroup 
            value={formData.gender} 
            onValueChange={(value) => updateFormData('gender', value)}
            className="mt-2"
          >
            {GENDER_OPTIONS.map((gender) => (
              <div key={gender} className="flex items-center space-x-2 touch-target">
                <RadioGroupItem value={gender} id={gender} />
                <Label htmlFor={gender} className="text-sm cursor-pointer">
                  {gender}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="breedGroup">Breed Group</Label>
          <Select value={formData.breedGroup} onValueChange={(value) => updateFormData('breedGroup', value)}>
            <SelectTrigger className="touch-target">
              <SelectValue placeholder="Select breed group" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {BREED_GROUPS.map((group) => (
                <SelectItem key={group} value={group} className="touch-target">
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobility Issues */}
      <div>
        <Label>Mobility Considerations</Label>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} mobile-gap mt-2`}>
          {MOBILITY_ISSUES.map((issue) => (
            <div key={issue} className="flex items-center space-x-2 touch-target">
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
          className="touch-target"
        />
      </div>
    </div>
  );
};

export default DogFormFields;
