
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Brain, Users, TreePine, Calendar, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import { format } from 'date-fns';

interface MoodRating {
  mood: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface JournalEntry {
  date: string;
  prompt: string;
  response: string;
  mood: string;
  behaviors: string[];
  notes: string;
}

const ReflectionJournal: React.FC = () => {
  const { currentDog, updateDog } = useDog();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    date: format(new Date(), 'yyyy-MM-dd'),
    prompt: '',
    response: '',
    mood: '',
    behaviors: [],
    notes: ''
  });

  const dailyPrompts = [
    "What new activity did your dog enjoy most today?",
    "How did your dog respond to social interactions today?",
    "What signs of mental stimulation did you notice?",
    "Describe your dog's energy levels throughout the day.",
    "What environmental changes did your dog encounter?",
    "How did your dog use their natural instincts today?",
    "What made your dog happiest today?"
  ];

  const moodRatings: MoodRating[] = [
    { mood: 'Energetic', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { mood: 'Calm', icon: Heart, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { mood: 'Playful', icon: Users, color: 'text-green-600', bgColor: 'bg-green-100' },
    { mood: 'Curious', icon: Brain, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { mood: 'Relaxed', icon: TreePine, color: 'text-teal-600', bgColor: 'bg-teal-100' }
  ];

  const commonBehaviors = [
    'Active play', 'Restful sleep', 'Good appetite', 'Social interaction',
    'Training focus', 'Exploration', 'Affectionate', 'Alert/watchful',
    'Vocal communication', 'Problem solving'
  ];

  // Get today's prompt
  useEffect(() => {
    const dayOfWeek = new Date().getDay();
    const todaysPrompt = dailyPrompts[dayOfWeek];
    setCurrentEntry(prev => ({ ...prev, prompt: todaysPrompt }));
  }, []);

  // Load existing entry for today if it exists
  useEffect(() => {
    if (currentDog?.journalEntries) {
      const todaysEntry = currentDog.journalEntries.find(
        entry => entry.date === format(new Date(), 'yyyy-MM-dd')
      );
      if (todaysEntry) {
        setCurrentEntry(todaysEntry);
      }
    }
  }, [currentDog]);

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

  const toggleBehavior = (behavior: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      behaviors: prev.behaviors.includes(behavior)
        ? prev.behaviors.filter(b => b !== behavior)
        : [...prev.behaviors, behavior]
    }));
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
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Today's Reflection</h3>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-blue-800 mb-2">Prompt:</p>
              <p className="text-sm text-blue-700">{currentEntry.prompt}</p>
            </div>
            <Textarea
              placeholder="Share your thoughts about today's experiences with your dog..."
              value={currentEntry.response}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, response: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          {/* Mood Tracking */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">How was {currentDog.name}'s mood today?</h3>
            <div className="flex flex-wrap gap-2">
              {moodRatings.map((rating) => {
                const IconComponent = rating.icon;
                const isSelected = currentEntry.mood === rating.mood;
                return (
                  <button
                    key={rating.mood}
                    onClick={() => setCurrentEntry(prev => ({ 
                      ...prev, 
                      mood: isSelected ? '' : rating.mood 
                    }))}
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

          {/* Behavior Tracking */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Behaviors observed today</h3>
            <div className="flex flex-wrap gap-2">
              {commonBehaviors.map((behavior) => {
                const isSelected = currentEntry.behaviors.includes(behavior);
                return (
                  <button
                    key={behavior}
                    onClick={() => toggleBehavior(behavior)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      isSelected 
                        ? 'bg-green-100 border-green-300 text-green-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {behavior}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Additional notes</h3>
            <Textarea
              placeholder="Any other observations, concerns, or memorable moments..."
              value={currentEntry.notes}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

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
