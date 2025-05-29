
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DayNavigatorProps {
  currentDate: Date;
  onNavigateDay: (direction: 'prev' | 'next') => void;
}

const DayNavigator: React.FC<DayNavigatorProps> = ({
  currentDate,
  onNavigateDay
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="flex items-center justify-between backdrop-blur-sm rounded-lg p-3 border border-white/60 bg-purple-300">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onNavigateDay('prev')} 
        className="h-8 w-8 p-0 hover:bg-white/70 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-semibold text-gray-800">
          {formatDate(currentDate)}
        </span>
        {isToday(currentDate) && (
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            Today
          </span>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onNavigateDay('next')} 
        className="h-8 w-8 p-0 hover:bg-white/70 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default DayNavigator;
