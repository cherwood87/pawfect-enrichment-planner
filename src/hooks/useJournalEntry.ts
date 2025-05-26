
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { JournalEntry } from '@/types/journal';
import { DAILY_PROMPTS } from '@/constants/journalConstants';
import { Dog } from '@/types/dog';
import { JournalService } from '@/services/journalService';

export const useJournalEntry = (currentDog: Dog | null) => {
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    date: format(new Date(), 'yyyy-MM-dd'),
    prompt: '',
    response: '',
    mood: '',
    behaviors: [],
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get today's prompt
  useEffect(() => {
    const dayOfWeek = new Date().getDay();
    const todaysPrompt = DAILY_PROMPTS[dayOfWeek];
    setCurrentEntry(prev => ({ ...prev, prompt: todaysPrompt }));
  }, []);

  // Load existing entry for today if it exists
  useEffect(() => {
    if (!currentDog) return;

    const loadTodaysEntry = async () => {
      try {
        setIsLoading(true);
        const todaysDate = format(new Date(), 'yyyy-MM-dd');
        const existingEntry = await JournalService.getEntry(currentDog.id, todaysDate);
        
        if (existingEntry) {
          setCurrentEntry(existingEntry);
        } else {
          // Reset to default entry if no existing entry found
          const dayOfWeek = new Date().getDay();
          const todaysPrompt = DAILY_PROMPTS[dayOfWeek];
          setCurrentEntry({
            date: todaysDate,
            prompt: todaysPrompt,
            response: '',
            mood: '',
            behaviors: [],
            notes: ''
          });
        }
      } catch (error) {
        console.error('Error loading today\'s entry:', error);
        // Fall back to local behavior if Supabase fails
        if (currentDog.journalEntries) {
          const todaysEntry = currentDog.journalEntries.find(
            entry => entry.date === format(new Date(), 'yyyy-MM-dd')
          );
          if (todaysEntry) {
            setCurrentEntry(todaysEntry);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTodaysEntry();
  }, [currentDog]);

  const updateResponse = (response: string) => {
    setCurrentEntry(prev => ({ ...prev, response }));
  };

  const updateMood = (mood: string) => {
    setCurrentEntry(prev => ({ ...prev, mood }));
  };

  const toggleBehavior = (behavior: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      behaviors: prev.behaviors.includes(behavior)
        ? prev.behaviors.filter(b => b !== behavior)
        : [...prev.behaviors, behavior]
    }));
  };

  const updateNotes = (notes: string) => {
    setCurrentEntry(prev => ({ ...prev, notes }));
  };

  const saveEntry = async (): Promise<boolean> => {
    if (!currentDog) return false;

    try {
      setIsSaving(true);
      await JournalService.saveEntry(currentDog.id, currentEntry);
      console.log('Journal entry saved to Supabase for', currentDog.name);
      return true;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    currentEntry,
    updateResponse,
    updateMood,
    toggleBehavior,
    updateNotes,
    saveEntry,
    isLoading,
    isSaving
  };
};
