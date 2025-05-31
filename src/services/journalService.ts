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
  static async createOrUpdateEntry(dogId: string, entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> {
    console.log('Creating or updating journal entry for dog:', dogId, 'entry:', entry);

    try {
      const { data: existing, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('dog_id', dogId)
        .eq('date', entry.date)
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing journal entry:', fetchError);
        throw new Error('Failed to check existing journal entry');
      }

      if (existing) {
        const { data: updated, error: updateError } = await supabase
          .from('journal_entries')
          .update({
            prompt: entry.prompt,
            response: entry.response,
            mood: entry.mood,
            behaviors: entry.behaviors,
            notes: entry.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating journal entry:', updateError);
          throw new Error('Failed to update journal entry');
        }

        return this.mapToJournalEntry(updated);
      } else {
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
          console.error('Error inserting journal entry:', error);
          throw new Error('Failed to create journal entry');
        }

        return this.mapToJournalEntry(data);
      }
    } catch (error) {
      console.error('Error in createOrUpdateEntry:', error);
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

      return this.mapToJournalEntry(data);
    } catch (error) {
      console.error('Error in updateEntry:', error);
      throw error;
    }
  }

  static async getEntriesForDate(dogId: string, date: string): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('dog_id', dogId)
        .eq('date', date)
        .order('entry_timestamp', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch journal entries: ${error.message}`);
      }

      return data.map(this.mapToJournalEntry);
    } catch (error) {
      throw error;
    }
  }

  static async getEntries(dogId: string): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false })
        .order('entry_timestamp', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch journal entries: ${error.message}`);
      }

      return data.map(this.mapToJournalEntry);
    } catch (error) {
      throw error;
    }
  }

  static async deleteEntry(entryId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) {
        throw new Error(`Failed to delete journal entry: ${error.message}`);
      }
    } catch (error) {
      throw error;
    }
  }

  // ✅ Updated to use safe logic
  static async saveEntry(dogId: string, entry: JournalEntry): Promise<void> {
    console.log('saveEntry called - using createOrUpdateEntry');
    await this.createOrUpdateEntry(dogId, entry);
  }

  static async getEntry(dogId: string, date: string): Promise<JournalEntry | null> {
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
