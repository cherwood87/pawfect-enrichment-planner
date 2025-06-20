import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { JournalEntry } from "@/types/journal";
import { DAILY_PROMPTS } from "@/constants/journalConstants";
import { Dog } from "@/types/dog";
import { JournalService } from "@/services/journalService";

export const useJournalEntry = (currentDog: Dog | null) => {
  const [todaysEntries, setTodaysEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    date: format(new Date(), "yyyy-MM-dd"),
    prompt: "",
    response: "",
    mood: "",
    behaviors: [],
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const justCreatedNewRef = useRef(false);

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * DAILY_PROMPTS.length);
    return DAILY_PROMPTS[randomIndex];
  };

  useEffect(() => {
    const randomPrompt = getRandomPrompt();
    setCurrentEntry((prev) => ({ ...prev, prompt: randomPrompt }));
  }, []);

  useEffect(() => {
    if (!currentDog) return;

    const loadTodaysEntries = async () => {
      try {
        setIsLoading(true);
        const todaysDate = format(new Date(), "yyyy-MM-dd");
        const entries = await JournalService.getEntriesForDate(
          currentDog.id,
          todaysDate,
        );
        setTodaysEntries(entries);

        if (entries.length === 0) {
          const randomPrompt = getRandomPrompt();
          setCurrentEntry({
            date: todaysDate,
            prompt: randomPrompt,
            response: "",
            mood: "",
            behaviors: [],
            notes: "",
          });
        } else if (!justCreatedNewRef.current) {
          setCurrentEntry(entries[0]);
        }
      } catch (error) {
        console.error("Error loading today's entries:", error);
        if (currentDog.journalEntries) {
          const fallbackEntries = currentDog.journalEntries.filter(
            (entry) => entry.date === format(new Date(), "yyyy-MM-dd"),
          );
          setTodaysEntries(fallbackEntries);
        }
      } finally {
        setIsLoading(false);
        justCreatedNewRef.current = false;
      }
    };

    loadTodaysEntries();
  }, [currentDog]);

  const updateResponse = (response: string) => {
    setCurrentEntry((prev) => ({ ...prev, response }));
  };

  const updateMood = (mood: string) => {
    setCurrentEntry((prev) => ({ ...prev, mood }));
  };

  const toggleBehavior = (behavior: string) => {
    setCurrentEntry((prev) => ({
      ...prev,
      behaviors: prev.behaviors.includes(behavior)
        ? prev.behaviors.filter((b) => b !== behavior)
        : [...prev.behaviors, behavior],
    }));
  };

  const updateNotes = (notes: string) => {
    setCurrentEntry((prev) => ({ ...prev, notes }));
  };

  const saveEntry = async (): Promise<boolean> => {
    if (!currentDog) return false;

    try {
      setIsSaving(true);

      // Use createOrUpdateEntry instead of createEntry
      const savedEntry = await JournalService.createOrUpdateEntry(
        currentDog.id,
        currentEntry,
      );

      setTodaysEntries((prev) => {
        const updated = prev.filter((entry) => entry.id !== savedEntry.id);
        return [savedEntry, ...updated];
      });

      setCurrentEntry(savedEntry);
      justCreatedNewRef.current = true;
      return true;
    } catch (error) {
      console.error("Error saving journal entry:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const createNewEntry = () => {
    const newPrompt = getRandomPrompt();
    setCurrentEntry({
      date: format(new Date(), "yyyy-MM-dd"),
      prompt: newPrompt,
      response: "",
      mood: "",
      behaviors: [],
      notes: "",
    });
    justCreatedNewRef.current = true;
  };

  const loadEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
  };

  const deleteEntry = async (entryId: string): Promise<boolean> => {
    if (!entryId) return false;

    try {
      await JournalService.deleteEntry(entryId);
      setTodaysEntries((prev) => prev.filter((entry) => entry.id !== entryId));
      if (currentEntry.id === entryId) {
        createNewEntry();
      }
      return true;
    } catch (error) {
      console.error("Error deleting journal entry:", error);
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
    isSaving,
  };
};
