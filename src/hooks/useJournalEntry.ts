import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { JournalEntry } from '@/types/journal';
import { DAILY_PROMPTS } from '@/constants/journalConstants';
import { Dog } from '@/types/dog';
import { JournalService } from '@/services/journalService';

export const useJournalEntry = (currentDog: Dog | null) => {
  const [todaysEntries, setTodaysEntries] = useState<JournalEntry[]>([]);
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
  const [justCreatedNew, setJustCreatedNew] = useState(false); // NEW

  // Get a random prompt for new entries
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * DAILY_PROMPTS.length);
    return DAILY_PROMPTS[randomIndex];
  };

  // Initialize with a random prompt
  useEffect(() => {
    const randomPrompt = getRandomPrompt();
    setCurrentEntry(prev => ({ ...prev, prompt: randomPrompt }));
  }, []);

  // Load existing entries for today
  useEffect(() => {
    if (!currentDog) return;

    const loadTodaysEntries = async () => {
      try {
        setIsLoading(true);
        const todaysDate = format(new Date(), 'yyyy-MM-dd');
        const entries = await JournalService.getEntriesForDate(currentDog.id, todaysDate);
        setTodaysEntries(entries);

        // If there are no entries for today, set up a new entry
        if (entries.length === 0) {
          const randomPrompt = getRandomPrompt();
          setCurrentEntry({
            date: todaysDate,
            prompt: randomPrompt,
            response: '',
            mood: '',
            behaviors: [],
            notes: ''
          });
        } else if (!justCreatedNew) {
          // Only load latest entry for editing if NOT just created new
          const latestEntry = entries[0];
          setCurrentEntry(latestEntry);
        }
        // If justCreatedNew, do not override currentEntry (leave it blank as intended)
      } catch (error) {
        console.error('Error loading today\'s entries:', error);
        if (currentDog.journalEntries) {
          const todaysEntries = currentDog.journalEntries.filter(
            entry => entry.date === format(new Date(), 'yyyy-MM-dd')
          );
          setTodaysEntries(todaysEntries);
        }
      } finally {
        setIsLoading(false);
        setJustCreatedNew(false); // Reset flag after effect runs
      }
    };

    loadTodaysEntries();
    // Only re-run when currentDog changes, not on every entry change
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      if (currentEntry.id) {
        // Update existing entry
        const updatedEntry = await JournalService.updateEntry(currentEntry.id, currentEntry);
        setTodaysEntries(prev =>
          prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry)
        );
      } else {
        // Create new entry
        const newEntry = await JournalService.createEntry(currentDog.id, currentEntry);
        setTodaysEntries(prev => [newEntry, ...prev]);
        // Instead of editing the just-saved entry, show a blank form for a new entry
        createNewEntry();
        setJustCreatedNew(true);
      }

      console.log('Journal entry saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const createNewEntry = () => {
    const newPrompt = getRandomPrompt();
    setCurrentEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      prompt: newPrompt,
      response: '',
      mood: '',
      behaviors: [],
      notes: ''
    });
    setJustCreatedNew(true); // Set flag so effect doesn't override this
  };

  const loadEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
  };

  const deleteEntry = async (entryId: string): Promise<boolean> => {
    if (!entryId) return false;

    try {
      await JournalService.deleteEntry(entryId);
      setTodaysEntries(prev => prev.filter(entry => entry.id !== entryId));

      // If we deleted the current entry, create a new one
      if (currentEntry.id === entryId) {
        createNewEntry();
      }

      return true;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      return false;
    }
  };

  return {
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
  };
};