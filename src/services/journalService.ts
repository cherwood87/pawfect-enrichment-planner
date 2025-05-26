
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
  entry_timestamp: string;
  created_at: string;
  updated_at: string;
}

export class JournalService {
  static async createEntry(dogId: string, entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> {
    console.log('Creating new journal entry for dog:', dogId, 'entry:', entry);
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          dog_id: dogId,
          date: entry.date,
          prompt: entry.prompt,
          response: entry.response,
          mood: entry.mood,
          behaviors: entry.behaviors,
          notes: entry.notes,
          entry_timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating journal entry:', error);
        throw new Error(`Failed to create journal entry: ${error.message}`);
      }
      
      console.log('Journal entry created successfully:', data);
      return this.mapToJournalEntry(data);
    } catch (error) {
      console.error('Error in createEntry:', error);
      throw error;
    }
  }

  static async updateEntry(entryId: string, entry: Partial<JournalEntry>): Promise<JournalEntry> {
    console.log('Updating journal entry:', entryId, 'with data:', entry);
    
    try {
      const updateData: any = {};
      if (entry.prompt !== undefined) updateData.prompt = entry.prompt;
      if (entry.response !== undefined) updateData.response = entry.response;
      if (entry.mood !== undefined) updateData.mood = entry.mood;
      if (entry.behaviors !== undefined) updateData.behaviors = entry.behaviors;
      if (entry.notes !== undefined) updateData.notes = entry.notes;

      const { data, error } = await supabase
        .from('journal_entries')
        .update(updateData)
        .eq('id', entryId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating journal entry:', error);
        throw new Error(`Failed to update journal entry: ${error.message}`);
      }
      
      console.log('Journal entry updated successfully:', data);
      return this.mapToJournalEntry(data);
    } catch (error) {
      console.error('Error in updateEntry:', error);
      throw error;
    }
  }

  static async getEntriesForDate(dogId: string, date: string): Promise<JournalEntry[]> {
    console.log('Fetching journal entries for dog:', dogId, 'date:', date);
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('dog_id', dogId)
        .eq('date', date)
        .order('entry_timestamp', { ascending: false });

      if (error) {
        console.error('Supabase error fetching journal entries for date:', error);
        throw new Error(`Failed to fetch journal entries: ${error.message}`);
      }

      console.log('Fetched journal entries for date:', data);
      return data.map(this.mapToJournalEntry);
    } catch (error) {
      console.error('Error in getEntriesForDate:', error);
      throw error;
    }
  }

  static async getEntries(dogId: string): Promise<JournalEntry[]> {
    console.log('Fetching all journal entries for dog:', dogId);
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false })
        .order('entry_timestamp', { ascending: false });

      if (error) {
        console.error('Supabase error fetching journal entries:', error);
        throw new Error(`Failed to fetch journal entries: ${error.message}`);
      }

      console.log('Fetched all journal entries:', data);
      return data.map(this.mapToJournalEntry);
    } catch (error) {
      console.error('Error in getEntries:', error);
      throw error;
    }
  }

  static async deleteEntry(entryId: string): Promise<void> {
    console.log('Deleting journal entry:', entryId);
    
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

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

  // Legacy method for backward compatibility
  static async saveEntry(dogId: string, entry: JournalEntry): Promise<void> {
    console.log('Legacy saveEntry called - redirecting to createEntry');
    await this.createEntry(dogId, entry);
  }

  // Legacy method for backward compatibility  
  static async getEntry(dogId: string, date: string): Promise<JournalEntry | null> {
    console.log('Legacy getEntry called - getting latest entry for date');
    const entries = await this.getEntriesForDate(dogId, date);
    return entries.length > 0 ? entries[0] : null;
  }

  private static mapToJournalEntry(dbEntry: DatabaseJournalEntry): JournalEntry {
    return {
      id: dbEntry.id,
      date: dbEntry.date,
      prompt: dbEntry.prompt,
      response: dbEntry.response,
      mood: dbEntry.mood,
      behaviors: dbEntry.behaviors,
      notes: dbEntry.notes,
      entryTimestamp: dbEntry.entry_timestamp,
      createdAt: dbEntry.created_at,
      updatedAt: dbEntry.updated_at
    };
  }
}
