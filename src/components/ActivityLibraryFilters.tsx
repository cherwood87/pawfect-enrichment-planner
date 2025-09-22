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
  return;
};
export default ActivityLibraryFilters;