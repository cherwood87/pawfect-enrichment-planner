
import React from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-medium text-gray-800 mb-2">{headerText}</h3>
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day, index) => {
          const dayDate = getDateForDay(index);
          const dateText = formatDate(dayDate);
          
          return (
            <Button
              key={day}
              variant={selectedDayOfWeek === index ? "default" : "outline"}
              size="sm"
              onClick={() => onDaySelect(index)}
              className="text-xs flex flex-col p-2 h-auto"
            >
              <span className="font-medium">{day.slice(0, 3)}</span>
              <span className="text-xs opacity-75">{dateText}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelector;
