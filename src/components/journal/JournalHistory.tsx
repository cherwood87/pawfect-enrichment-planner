
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronDown, ChevronUp, Trash2, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { JournalEntry } from '@/types/journal';
import { JournalService } from '@/services/journalService';
import { MOOD_RATINGS } from '@/constants/journalConstants';

interface JournalHistoryProps {
  dogId: string;
  dogName: string;
}

const JournalHistory: React.FC<JournalHistoryProps> = ({ dogId, dogName }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, [dogId]);

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      const journalEntries = await JournalService.getEntries(dogId);
      setEntries(journalEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (date: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await JournalService.deleteEntry(dogId, date);
        setEntries(entries.filter(entry => entry.date !== date));
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const getMoodIcon = (mood: string) => {
    const moodRating = MOOD_RATINGS.find(rating => rating.mood === mood);
    if (!moodRating) return null;
    const IconComponent = moodRating.icon;
    return <IconComponent className={`w-4 h-4 ${moodRating.color}`} />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading journal entries...</div>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Journal Entries Yet</h3>
          <p className="text-gray-500">Start writing daily reflections about {dogName} to see them here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          <span>Journal History for {dogName}</span>
          <Badge variant="outline" className="ml-auto">
            {entries.length} entries
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => {
          const isExpanded = expandedEntry === entry.date;
          const entryDate = parseISO(entry.date);
          
          return (
            <div
              key={entry.date}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedEntry(isExpanded ? null : entry.date)}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-800">
                    {format(entryDate, 'EEEE, MMMM d, yyyy')}
                  </div>
                  {entry.mood && (
                    <div className="flex items-center space-x-1">
                      {getMoodIcon(entry.mood)}
                      <span className="text-xs text-gray-600">{entry.mood}</span>
                    </div>
                  )}
                  {entry.behaviors.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {entry.behaviors.length} behaviors
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEntry(entry.date);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  {/* Prompt and Response */}
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm font-medium text-blue-800 mb-1">Prompt:</p>
                      <p className="text-sm text-blue-700">{entry.prompt}</p>
                    </div>
                    {entry.response && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-800 mb-1">Response:</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{entry.response}</p>
                      </div>
                    )}
                  </div>

                  {/* Behaviors */}
                  {entry.behaviors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-800 mb-2">Behaviors observed:</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.behaviors.map((behavior, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {behavior}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {entry.notes && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Additional notes:</p>
                      <p className="text-sm text-yellow-700 whitespace-pre-wrap">{entry.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default JournalHistory;
