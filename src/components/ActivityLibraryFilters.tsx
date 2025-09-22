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
  const pillars = [{
    id: 'all',
    name: 'All Pillars',
    icon: Layers
  }, {
    id: 'mental',
    name: 'Mental',
    icon: Brain
  }, {
    id: 'physical',
    name: 'Physical',
    icon: Zap
  }, {
    id: 'social',
    name: 'Social',
    icon: Users
  }, {
    id: 'environmental',
    name: 'Environmental',
    icon: TreePine
  }, {
    id: 'instinctual',
    name: 'Instinctual',
    icon: Target
  }];
  const difficulties = [{
    value: 'all',
    label: 'All Difficulties'
  }, {
    value: 'Easy',
    label: 'Easy'
  }, {
    value: 'Medium',
    label: 'Medium'
  }, {
    value: 'Hard',
    label: 'Hard'
  }];
  const durations = [{
    value: 'all',
    label: 'All Durations'
  }, {
    value: '5',
    label: '5 min'
  }, {
    value: '15',
    label: '15 min'
  }, {
    value: '30',
    label: '30 min'
  }, {
    value: '30plus',
    label: '30+ min'
  }];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Pillar Filter */}
      <Select value={selectedPillar} onValueChange={setSelectedPillar}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select pillar" />
        </SelectTrigger>
        <SelectContent>
          {pillars.map(pillar => {
            const IconComponent = pillar.icon;
            return (
              <SelectItem key={pillar.id} value={pillar.id}>
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  {pillar.name}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Difficulty Filter */}
      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          {difficulties.map(difficulty => (
            <SelectItem key={difficulty.value} value={difficulty.value}>
              {difficulty.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Duration Filter */}
      <Select value={selectedDuration} onValueChange={setSelectedDuration}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Duration" />
        </SelectTrigger>
        <SelectContent>
          {durations.map(duration => (
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