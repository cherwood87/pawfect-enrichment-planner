
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
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200 shadow-sm">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onNavigateDay('prev')} 
        className="h-10 w-10 p-0 hover:bg-purple-100 transition-colors rounded-xl border border-purple-200"
      >
        <ChevronLeft className="w-5 h-5 text-purple-700" />
      </Button>
      
      <div className="flex items-center space-x-3">
        <Calendar className="w-5 h-5 text-purple-600" />
        <div className="text-center">
          <span className="text-lg font-bold text-purple-800 block">
            {formatDate(currentDate)}
          </span>
          {isToday(currentDate) && (
            <span className="text-xs bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-3 py-1 rounded-full font-medium">
              Today
            </span>
          )}
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onNavigateDay('next')} 
        className="h-10 w-10 p-0 hover:bg-purple-100 transition-colors rounded-xl border border-purple-200"
      >
        <ChevronRight className="w-5 h-5 text-purple-700" />
      </Button>
    </div>
  );
};

export default DayNavigator;
