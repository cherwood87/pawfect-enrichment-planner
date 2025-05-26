
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import { format } from 'date-fns';
import { useJournalEntry } from '@/hooks/useJournalEntry';
import DailyPromptSection from './journal/DailyPromptSection';
import MoodTrackingSection from './journal/MoodTrackingSection';
import BehaviorTrackingSection from './journal/BehaviorTrackingSection';
import AdditionalNotesSection from './journal/AdditionalNotesSection';

const ReflectionJournal: React.FC = () => {
  const { currentDog, updateDog } = useDog();
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    currentEntry,
    updateResponse,
    updateMood,
    toggleBehavior,
    updateNotes
  } = useJournalEntry(currentDog);

  const handleSave = () => {
    if (!currentDog) return;

    const existingEntries = currentDog.journalEntries || [];
    const updatedEntries = existingEntries.filter(entry => entry.date !== currentEntry.date);
    updatedEntries.push(currentEntry);

    updateDog({
      ...currentDog,
      journalEntries: updatedEntries
    });

    console.log('Journal entry saved for', currentDog.name);
  };

  if (!currentDog) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-lg">Daily Reflection Journal</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {format(new Date(), 'MMM d')}
            </Badge>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Daily Prompt */}
          <DailyPromptSection
            currentEntry={currentEntry}
            onResponseChange={updateResponse}
          />

          {/* Mood Tracking */}
          <MoodTrackingSection
            dogName={currentDog.name}
            selectedMood={currentEntry.mood}
            onMoodChange={updateMood}
          />

          {/* Behavior Tracking */}
          <BehaviorTrackingSection
            selectedBehaviors={currentEntry.behaviors}
            onBehaviorToggle={toggleBehavior}
          />

          {/* Additional Notes */}
          <AdditionalNotesSection
            notes={currentEntry.notes}
            onNotesChange={updateNotes}
          />

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ReflectionJournal;
