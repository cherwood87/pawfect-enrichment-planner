
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
    console.log('Saving journal entry for dog:', dogId, 'entry:', entry);
    
    try {
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
        console.error('Supabase error saving journal entry:', error);
        throw new Error(`Failed to save journal entry: ${error.message}`);
      }
      
      console.log('Journal entry saved successfully');
    } catch (error) {
      console.error('Error in saveEntry:', error);
      throw error;
    }
  }

  static async getEntries(dogId: string): Promise<JournalEntry[]> {
    console.log('Fetching journal entries for dog:', dogId);
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error fetching journal entries:', error);
        throw new Error(`Failed to fetch journal entries: ${error.message}`);
      }

      console.log('Fetched journal entries:', data);
      return data.map(this.mapToJournalEntry);
    } catch (error) {
      console.error('Error in getEntries:', error);
      throw error;
    }
  }

  static async getEntry(dogId: string, date: string): Promise<JournalEntry | null> {
    console.log('Fetching journal entry for dog:', dogId, 'date:', date);
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('dog_id', dogId)
        .eq('date', date)
        .maybeSingle();

      if (error) {
        console.error('Supabase error fetching journal entry:', error);
        throw new Error(`Failed to fetch journal entry: ${error.message}`);
      }

      console.log('Fetched journal entry:', data);
      return data ? this.mapToJournalEntry(data) : null;
    } catch (error) {
      console.error('Error in getEntry:', error);
      throw error;
    }
  }

  static async deleteEntry(dogId: string, date: string): Promise<void> {
    console.log('Deleting journal entry for dog:', dogId, 'date:', date);
    
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('dog_id', dogId)
        .eq('date', date);

      if (error) {
        console.error('Supabase error deleting journal entry:', error);
        throw new Error(`Failed to delete journal entry: ${error.message}`);
      }
      
      console.log('Journal entry deleted successfully');
    } catch (error) {
      console.error('Error in deleteEntry:', error);
      throw error;
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
