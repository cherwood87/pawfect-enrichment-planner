
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Save, ChevronDown, ChevronUp, History, Loader2, Plus } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import { format } from 'date-fns';
import { useJournalEntry } from '@/hooks/useJournalEntry';
import { useToast } from '@/hooks/use-toast';
import DailyPromptSection from './journal/DailyPromptSection';
import MoodTrackingSection from './journal/MoodTrackingSection';
import BehaviorTrackingSection from './journal/BehaviorTrackingSection';
import AdditionalNotesSection from './journal/AdditionalNotesSection';
import TodaysEntriesSection from './journal/TodaysEntriesSection';
import JournalHistory from './journal/JournalHistory';

const ReflectionJournal: React.FC = () => {
  const { currentDog, updateDog } = useDog();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const { toast } = useToast();
  
  const {
    currentEntry,
    todaysEntries,
    updateResponse,
    updateMood,
    toggleBehavior,
    updateNotes,
    saveEntry,
    createNewEntry,
    loadEntry,
    deleteEntry,
    isLoading,
    isSaving
  } = useJournalEntry(currentDog);

  const handleSave = async () => {
    if (!currentDog) return;

    const success = await saveEntry();
    
    if (success) {
      toast({
        title: "Journal Entry Saved",
        description: "Your daily reflection has been saved successfully.",
      });
    } else {
      toast({
        title: "Save Failed",
        description: "There was an error saving your journal entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateNew = () => {
    createNewEntry();
    toast({
      title: "New Entry Created",
      description: "You can now write another journal entry for today.",
    });
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!entryId) return;
    
    const success = await deleteEntry(entryId);
    if (success) {
      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted.",
      });
    } else {
      toast({
        title: "Delete Failed",
        description: "There was an error deleting your journal entry.",
        variant: "destructive",
      });
    }
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
            {todaysEntries.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {todaysEntries.length} {todaysEntries.length === 1 ? 'entry' : 'entries'} today
              </Badge>
            )}
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
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="today" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Today's Entries</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-6 mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                  <span className="ml-2 text-gray-500">Loading today's entries...</span>
                </div>
              ) : (
                <>
                  {/* Today's Existing Entries */}
                  {todaysEntries.length > 0 && (
                    <TodaysEntriesSection
                      entries={todaysEntries}
                      onLoadEntry={loadEntry}
                      onDeleteEntry={handleDeleteEntry}
                      currentEntryId={currentEntry.id}
                    />
                  )}

                  {/* Current Entry Form */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        {currentEntry.id ? 'Edit Entry' : 'New Entry'}
                      </h3>
                      {todaysEntries.length > 0 && !currentEntry.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCreateNew}
                          className="flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Another Entry</span>
                        </Button>
                      )}
                    </div>

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
                        disabled={isSaving}
                        className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {currentEntry.id ? 'Update Entry' : 'Save Entry'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <JournalHistory 
                dogId={currentDog.id}
                dogName={currentDog.name}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default ReflectionJournal;
