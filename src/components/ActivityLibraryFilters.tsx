
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Zap, Users, TreePine, Target, Layers } from 'lucide-react';

interface ActivityLibraryFiltersProps {
  selectedPillar: string;
  setSelectedPillar: (pillar: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
}

const ActivityLibraryFilters: React.FC<ActivityLibraryFiltersProps> = ({
  selectedPillar,
  setSelectedPillar,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedDuration,
  setSelectedDuration
}) => {
  const pillars = [
    { id: 'all', name: 'All Pillars', icon: Layers },
    { id: 'mental', name: 'Mental', icon: Brain },
    { id: 'physical', name: 'Physical', icon: Zap },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'environmental', name: 'Environmental', icon: TreePine },
    { id: 'instinctual', name: 'Instinctual', icon: Target }
  ];

  const difficulties = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ];

  const durations = [
    { value: 'all', label: 'All Durations' },
    { value: '5', label: '5 min' },
    { value: '15', label: '15 min' },
    { value: '30', label: '30 min' },
    { value: '30plus', label: '30+ min' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Select value={selectedPillar} onValueChange={setSelectedPillar}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Pillars" />
        </SelectTrigger>
        <SelectContent>
          {pillars.map((pillar) => (
            <SelectItem key={pillar.id} value={pillar.id}>
              <div className="flex items-center space-x-2">
                <pillar.icon className="w-4 h-4 text-muted-foreground" />
                <span>{pillar.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Difficulties" />
        </SelectTrigger>
        <SelectContent>
          {difficulties.map((difficulty) => (
            <SelectItem key={difficulty.value} value={difficulty.value}>
              {difficulty.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedDuration} onValueChange={setSelectedDuration}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Durations" />
        </SelectTrigger>
        <SelectContent>
          {durations.map((duration) => (
            <SelectItem key={duration.value} value={duration.value}>
              {duration.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ActivityLibraryFilters;
