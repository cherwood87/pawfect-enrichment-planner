
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Brain, Zap, Users, TreePine, Target } from 'lucide-react';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPillar?: string | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, selectedPillar }) => {
  const [activityName, setActivityName] = useState('');
  const [pillar, setPillar] = useState(selectedPillar || '');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const pillars = [
    { id: 'mental', name: 'Mental', icon: Brain, color: 'purple' },
    { id: 'physical', name: 'Physical', icon: Zap, color: 'green' },
    { id: 'social', name: 'Social', icon: Users, color: 'blue' },
    { id: 'environmental', name: 'Environmental', icon: TreePine, color: 'teal' },
    { id: 'instinctual', name: 'Instinctual', icon: Target, color: 'orange' }
  ];

  const suggestedActivities = {
    mental: [
      'Puzzle Toy Session',
      'Hide & Seek Treats',
      'Training Commands',
      'Interactive Feeder',
      'Brain Games'
    ],
    physical: [
      'Morning Walk',
      'Fetch in Park',
      'Agility Course',
      'Swimming',
      'Hiking Trail'
    ],
    social: [
      'Dog Park Visit',
      'Playdate',
      'Puppy Class',
      'Pet Store Trip',
      'Meet Neighbors'
    ],
    environmental: [
      'New Walking Route',
      'Beach Exploration',
      'Forest Sniff Walk',
      'City Adventure',
      'Garden Exploration'
    ],
    instinctual: [
      'Digging Box',
      'Sniffing Games',
      'Foraging Hunt',
      'Tug of War',
      'Chasing Bubbles'
    ]
  };

  const handleSubmit = () => {
    // Here you would typically save the activity
    console.log('Saving activity:', {
      name: activityName,
      pillar,
      duration,
      description,
      scheduledTime
    });
    
    // Reset form
    setActivityName('');
    setPillar('');
    setDuration('');
    setDescription('');
    setScheduledTime('');
    onClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setActivityName(suggestion);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800">Add New Activity</DialogTitle>
        </DialogHeader>
        
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

          {/* Suggested Activities */}
          {pillar && suggestedActivities[pillar as keyof typeof suggestedActivities] && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Suggested Activities</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedActivities[pillar as keyof typeof suggestedActivities].map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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

          {/* Scheduled Time */}
          <div>
            <Label htmlFor="scheduled-time" className="text-sm font-medium text-gray-700">
              Scheduled Time (Optional)
            </Label>
            <Input
              id="scheduled-time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Notes (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any special notes or instructions..."
              className="mt-1 min-h-[60px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
              disabled={!activityName || !pillar}
            >
              Add Activity
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityModal;
