
import React from 'react';
import { Button } from '@/components/ui/button';

interface DaySelectorProps {
  selectedDayOfWeek: number;
  onDaySelect: (day: number) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDayOfWeek, onDaySelect }) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-medium text-gray-800 mb-2">Select Day for Weekly Plan</h3>
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day, index) => (
          <Button
            key={day}
            variant={selectedDayOfWeek === index ? "default" : "outline"}
            size="sm"
            onClick={() => onDaySelect(index)}
            className="text-xs"
          >
            {day.slice(0, 3)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DaySelector;
