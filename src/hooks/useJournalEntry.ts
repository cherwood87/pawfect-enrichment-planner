
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { JournalEntry } from '@/types/journal';
import { DAILY_PROMPTS } from '@/constants/journalConstants';
import { Dog } from '@/types/dog';

export const useJournalEntry = (currentDog: Dog | null) => {
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    date: format(new Date(), 'yyyy-MM-dd'),
    prompt: '',
    response: '',
    mood: '',
    behaviors: [],
    notes: ''
  });

  // Get today's prompt
  useEffect(() => {
    const dayOfWeek = new Date().getDay();
    const todaysPrompt = DAILY_PROMPTS[dayOfWeek];
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

  return {
    currentEntry,
    updateResponse,
    updateMood,
    toggleBehavior,
    updateNotes
  };
};
