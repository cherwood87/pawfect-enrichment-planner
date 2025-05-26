
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry } from '@/types/journal';

export interface DatabaseJournalEntry {
  id: string;
  dog_id: string;
  date: string;
  prompt: string;
  response: string;
  mood: string;
  behaviors: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export class JournalService {
  static async saveEntry(dogId: string, entry: JournalEntry): Promise<void> {
    const { error } = await supabase
      .from('journal_entries')
      .upsert({
        dog_id: dogId,
        date: entry.date,
        prompt: entry.prompt,
        response: entry.response,
        mood: entry.mood,
        behaviors: entry.behaviors,
        notes: entry.notes
      }, {
        onConflict: 'dog_id,date'
      });

    if (error) {
      console.error('Error saving journal entry:', error);
      throw new Error('Failed to save journal entry');
    }
  }

  static async getEntries(dogId: string): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('dog_id', dogId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
      throw new Error('Failed to fetch journal entries');
    }

    return data.map(this.mapToJournalEntry);
  }

  static async getEntry(dogId: string, date: string): Promise<JournalEntry | null> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('dog_id', dogId)
      .eq('date', date)
      .maybeSingle();

    if (error) {
      console.error('Error fetching journal entry:', error);
      throw new Error('Failed to fetch journal entry');
    }

    return data ? this.mapToJournalEntry(data) : null;
  }

  static async deleteEntry(dogId: string, date: string): Promise<void> {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('dog_id', dogId)
      .eq('date', date);

    if (error) {
      console.error('Error deleting journal entry:', error);
      throw new Error('Failed to delete journal entry');
    }
  }

  private static mapToJournalEntry(dbEntry: DatabaseJournalEntry): JournalEntry {
    return {
      date: dbEntry.date,
      prompt: dbEntry.prompt,
      response: dbEntry.response,
      mood: dbEntry.mood,
      behaviors: dbEntry.behaviors,
      notes: dbEntry.notes
    };
  }
}
