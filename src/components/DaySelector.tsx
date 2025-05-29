import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DaySelectorProps {
  selectedDayOfWeek: number;
  onDaySelect: (day: number) => void;
  targetDate?: Date;
  targetWeek?: number;
}

const DaySelector: React.FC<DaySelectorProps> = ({ 
  selectedDayOfWeek, 
  onDaySelect, 
  targetDate, 
  targetWeek 
}) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDateForDay = (dayOfWeek: number) => {
    if (targetDate && targetWeek) {
      // Calculate dates relative to the target week
      const startOfTargetWeek = new Date(targetDate);
      // Find Monday of the target week
      const dayOffset = (startOfTargetWeek.getDay() + 6) % 7; // Days since Monday
      startOfTargetWeek.setDate(startOfTargetWeek.getDate() - dayOffset);
      
      // Add the day offset
      const dayDate = new Date(startOfTargetWeek);
      dayDate.setDate(startOfTargetWeek.getDate() + dayOfWeek);
      return dayDate;
    }
    
    // Fallback to current week
    const today = new Date();
    const currentDay = today.getDay();
    const diff = dayOfWeek - currentDay;
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + diff);
    return dayDate;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isCurrentWeek = !targetDate || !targetWeek;
  const headerText = isCurrentWeek 
    ? "Select Day for Weekly Plan" 
    : `Select Day for Week ${targetWeek}`;

  return (
    <div className="card-secondary padding-content spacing-compact">
      <h3 className="font-medium text-purple-800 mb-4">{headerText}</h3>
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day, index) => {
          const dayDate = getDateForDay(index);
          const dateText = formatDate(dayDate);
          const isSelected = selectedDayOfWeek === index;
          
          return (
            <Button
              key={day}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onDaySelect(index)}
              className={cn(
                "flex flex-col items-center p-3 h-auto transition-all duration-200",
                isSelected 
                  ? "btn-primary scale-105 shadow-md" 
                  : "btn-outline hover:scale-105"
              )}
            >
              <span className="font-medium text-xs">{day.slice(0, 3)}</span>
              <span className="text-xs opacity-75 mt-1">{dateText}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelector;
