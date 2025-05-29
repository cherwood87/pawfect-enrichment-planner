import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
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
  const getCurrentWeek = () => {
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
  };
  const isCurrentWeek = currentWeek === getCurrentWeek() && currentYear === new Date().getFullYear();
  return <div className="flex items-center justify-between backdrop-blur-sm rounded-lg p-3 border border-white/60 bg-neutral-50">
      <Button variant="ghost" size="sm" onClick={() => onNavigateWeek('prev')} className="h-8 w-8 p-0 hover:bg-white/70 transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-semibold text-gray-800">
          Week {currentWeek}, {currentYear}
        </span>
        {isCurrentWeek && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            Current
          </span>}
      </div>
      
      <Button variant="ghost" size="sm" onClick={() => onNavigateWeek('next')} className="h-8 w-8 p-0 hover:bg-white/70 transition-colors">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>;
};
export default WeekNavigator;