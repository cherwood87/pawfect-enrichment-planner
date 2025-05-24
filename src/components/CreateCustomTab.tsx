
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Zap, Users, TreePine, Target } from 'lucide-react';

interface CreateCustomTabProps {
  activityName: string;
  setActivityName: (name: string) => void;
  pillar: string;
  setPillar: (pillar: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  materials: string;
  setMaterials: (materials: string) => void;
  instructions: string;
  setInstructions: (instructions: string) => void;
  description: string;
  setDescription: (description: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateCustomTab: React.FC<CreateCustomTabProps> = ({
  activityName,
  setActivityName,
  pillar,
  setPillar,
  duration,
  setDuration,
  materials,
  setMaterials,
  instructions,
  setInstructions,
  description,
  setDescription,
  onSubmit,
  onCancel
}) => {
  const pillars = [
    { id: 'mental', name: 'Mental', icon: Brain, color: 'purple' },
    { id: 'physical', name: 'Physical', icon: Zap, color: 'green' },
    { id: 'social', name: 'Social', icon: Users, color: 'blue' },
    { id: 'environmental', name: 'Environmental', icon: TreePine, color: 'teal' },
    { id: 'instinctual', name: 'Instinctual', icon: Target, color: 'orange' }
  ];

  return (
    <div className="space-y-4">
      {/* Pillar Selection */}
      <div>
        <Label htmlFor="pillar" className="text-sm font-medium text-gray-700">
          Enrichment Pillar
        </Label>
        <Select value={pillar} onValueChange={setPillar}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select pillar" />
          </SelectTrigger>
          <SelectContent>
            {pillars.map((p) => {
              const IconComponent = p.icon;
              return (
                <SelectItem key={p.id} value={p.id}>
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`w-4 h-4 text-${p.color}-500`} />
                    <span>{p.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Activity Name */}
      <div>
        <Label htmlFor="activity-name" className="text-sm font-medium text-gray-700">
          Activity Name
        </Label>
        <Input
          id="activity-name"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          placeholder="Enter activity name"
          className="mt-1"
        />
      </div>

      {/* Duration */}
      <div>
        <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
          Duration (minutes)
        </Label>
        <Input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="15"
          className="mt-1"
        />
      </div>

      {/* Materials Needed */}
      <div>
        <Label htmlFor="materials" className="text-sm font-medium text-gray-700">
          Materials Needed (comma-separated)
        </Label>
        <Input
          id="materials"
          value={materials}
          onChange={(e) => setMaterials(e.target.value)}
          placeholder="Treats, toys, leash..."
          className="mt-1"
        />
      </div>

      {/* Instructions */}
      <div>
        <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">
          Instructions (one per line)
        </Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Step 1: Prepare materials..."
          className="mt-1 min-h-[80px]"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Benefits/Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the benefits of this activity..."
          className="mt-1 min-h-[60px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
          disabled={!activityName || !pillar || !duration}
        >
          Create Activity
        </Button>
      </div>
    </div>
  );
};

export default CreateCustomTab;
