import { supabase } from "@/integrations/supabase/client";
import type { JournalEntry } from "@/types/journal";

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
	// ✅ NEW METHOD: Always creates a new entry (allows multiple per day)
	static async createNewEntry(
		dogId: string,
		entry: Omit<JournalEntry, "id">,
	): Promise<JournalEntry> {
		console.log("Creating new journal entry for dog:", dogId, "entry:", entry);

		try {
			const { data, error } = await supabase
				.from("journal_entries")
				.insert({
					dog_id: dogId,
					date: entry.date,
					prompt: entry.prompt,
					response: entry.response,
					mood: entry.mood,
					behaviors: entry.behaviors,
					notes: entry.notes,
					entry_timestamp: new Date().toISOString(),
				})
				.select()
				.single();

			if (error) {
				console.error("Error inserting journal entry:", error);
				throw new Error("Failed to create journal entry");
			}

			return JournalService.mapToJournalEntry(data);
		} catch (error) {
			console.error("Error in createNewEntry:", error);
			throw error;
		}
	}

	// ✅ MODIFIED: Now creates new entries by default, with option to update existing
	static async createOrUpdateEntry(
		dogId: string,
		entry: Omit<JournalEntry, "id">,
		forceNew: boolean = true,
	): Promise<JournalEntry> {
		console.log(
			"Creating or updating journal entry for dog:",
			dogId,
			"entry:",
			entry,
			"forceNew:",
			forceNew,
		);

		// If forceNew is true, always create a new entry
		if (forceNew) {
			return JournalService.createNewEntry(dogId, entry);
		}

		// Original update-existing logic (kept for backward compatibility)
		try {
			const { data: existing, error: fetchError } = await supabase
				.from("journal_entries")
				.select("*")
				.eq("dog_id", dogId)
				.eq("date", entry.date)
				.limit(1)
				.maybeSingle();

			if (fetchError) {
				console.error("Error checking existing journal entry:", fetchError);
				throw new Error("Failed to check existing journal entry");
			}

			if (existing) {
				const { data: updated, error: updateError } = await supabase
					.from("journal_entries")
					.update({
						prompt: entry.prompt,
						response: entry.response,
						mood: entry.mood,
						behaviors: entry.behaviors,
						notes: entry.notes,
						updated_at: new Date().toISOString(),
					})
					.eq("id", existing.id)
					.select()
					.single();

				if (updateError) {
					console.error("Error updating journal entry:", updateError);
					throw new Error("Failed to update journal entry");
				}

				return JournalService.mapToJournalEntry(updated);
			} else {
				return JournalService.createNewEntry(dogId, entry);
			}
		} catch (error) {
			console.error("Error in createOrUpdateEntry:", error);
			throw error;
		}
	}

	static async updateEntry(
		entryId: string,
		entry: Partial<JournalEntry>,
	): Promise<JournalEntry> {
		console.log("Updating journal entry:", entryId, "with data:", entry);

		try {
			const updateData: any = {};
			if (entry.prompt !== undefined) updateData.prompt = entry.prompt;
			if (entry.response !== undefined) updateData.response = entry.response;
			if (entry.mood !== undefined) updateData.mood = entry.mood;
			if (entry.behaviors !== undefined) updateData.behaviors = entry.behaviors;
			if (entry.notes !== undefined) updateData.notes = entry.notes;

			const { data, error } = await supabase
				.from("journal_entries")
				.update(updateData)
				.eq("id", entryId)
				.select()
				.single();

			if (error) {
				console.error("Supabase error updating journal entry:", error);
				throw new Error(`Failed to update journal entry: ${error.message}`);
			}

			return JournalService.mapToJournalEntry(data);
		} catch (error) {
			console.error("Error in updateEntry:", error);
			throw error;
		}
	}

	static async getEntriesForDate(
		dogId: string,
		date: string,
	): Promise<JournalEntry[]> {
		const { data, error } = await supabase
			.from("journal_entries")
			.select("*")
			.eq("dog_id", dogId)
			.eq("date", date)
			.order("entry_timestamp", { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch journal entries: ${error.message}`);
		}

		return data.map(JournalService.mapToJournalEntry);
	}

	static async getEntries(dogId: string): Promise<JournalEntry[]> {
		const { data, error } = await supabase
			.from("journal_entries")
			.select("*")
			.eq("dog_id", dogId)
			.order("date", { ascending: false })
			.order("entry_timestamp", { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch journal entries: ${error.message}`);
		}

		return data.map(JournalService.mapToJournalEntry);
	}

	static async deleteEntry(entryId: string): Promise<void> {
		const { error } = await supabase
			.from("journal_entries")
			.delete()
			.eq("id", entryId);

		if (error) {
			throw new Error(`Failed to delete journal entry: ${error.message}`);
		}
	}

	// ✅ UPDATED: Now creates new entries by default
	static async saveEntry(dogId: string, entry: JournalEntry): Promise<void> {
		console.log("saveEntry called - creating new entry");
		await JournalService.createNewEntry(dogId, entry);
	}

	// ✅ UPDATED: Gets the most recent entry for a date (since there can be multiple)
	static async getEntry(
		dogId: string,
		date: string,
	): Promise<JournalEntry | null> {
		const entries = await JournalService.getEntriesForDate(dogId, date);
		return entries.length > 0 ? entries[0] : null; // Returns most recent entry
	}

	// ✅ NEW METHOD: Get latest entry for a date
	static async getLatestEntryForDate(
		dogId: string,
		date: string,
	): Promise<JournalEntry | null> {
		return JournalService.getEntry(dogId, date);
	}

	private static mapToJournalEntry(
		dbEntry: DatabaseJournalEntry,
	): JournalEntry {
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
			updatedAt: dbEntry.updated_at,
		};
	}
}
