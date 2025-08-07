
import React from 'react';
import { MOOD_RATINGS } from '@/constants/journalConstants';

interface MoodTrackingSectionProps {
  dogName: string;
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

const MoodTrackingSection: React.FC<MoodTrackingSectionProps> = ({
  dogName,
  selectedMood,
  onMoodChange
}) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-800">How was {dogName}'s mood today?</h3>
      <div className="flex flex-wrap gap-2">
        {MOOD_RATINGS.map((rating) => {
          const IconComponent = rating.icon;
          const isSelected = selectedMood === rating.mood;
          return (
            <button
              key={rating.mood}
              onClick={() => onMoodChange(isSelected ? '' : rating.mood)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                isSelected 
                  ? `${rating.bgColor} border-current ${rating.color}` 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isSelected ? rating.color : 'text-gray-500'}`} />
              <span className={`text-sm ${isSelected ? rating.color : 'text-gray-700'}`}>
                {rating.mood}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodTrackingSection;
