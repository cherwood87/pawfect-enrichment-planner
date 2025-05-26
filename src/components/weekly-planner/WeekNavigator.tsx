
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekNavigatorProps {
  currentWeek: number;
  currentYear: number;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
}

const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  currentWeek,
  currentYear,
  onNavigateWeek
}) => {
  return (
    <div className="flex items-center justify-between mt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigateWeek('prev')}
        className="p-1"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm font-medium text-gray-600">
        Week {currentWeek}, {currentYear}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigateWeek('next')}
        className="p-1"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default WeekNavigator;
