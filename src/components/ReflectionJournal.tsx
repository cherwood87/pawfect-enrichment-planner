import { format } from "date-fns";
import { Calendar, History, Loader2, Plus, Save } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDog } from "@/contexts/DogContext";
import { useToast } from "@/hooks/use-toast";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import AdditionalNotesSection from "./journal/AdditionalNotesSection";
import BehaviorTrackingSection from "./journal/BehaviorTrackingSection";
import DailyPromptSection from "./journal/DailyPromptSection";
import JournalHistory from "./journal/JournalHistory";
import MoodTrackingSection from "./journal/MoodTrackingSection";
import TodaysEntriesSection from "./journal/TodaysEntriesSection";

const ReflectionJournal: React.FC = () => {
	const { currentDog } = useDog();
	const [activeTab, setActiveTab] = useState("today");
	const { toast } = useToast();

	const {
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
	} = useJournalEntry(currentDog);

	const handleSave = async () => {
		if (!currentDog) return;
		const success = await saveEntry();
		toast({
			title: success ? "Journal Entry Saved" : "Save Failed",
			description: success
				? "Your daily reflection has been saved successfully."
				: "There was an error saving your journal entry. Please try again.",
			variant: success ? undefined : "destructive",
		});
	};

	const handleCreateNew = () => {
		createNewEntry();
		toast({
			title: "New Entry Created",
			description: "You can now write another journal entry for today.",
		});
	};

	const handleDeleteEntry = async (entryId: string) => {
		if (!entryId) return;
		const success = await deleteEntry(entryId);
		toast({
			title: success ? "Entry Deleted" : "Delete Failed",
			description: success
				? "Your journal entry has been deleted."
				: "There was an error deleting your journal entry.",
			variant: success ? undefined : "destructive",
		});
	};

	if (!currentDog) return null;

	return (
		<Card className="rounded-3xl shadow-lg bg-gradient-to-br from-purple-50 to-cyan-50 border border-purple-200">
			<CardHeader className="bg-gradient-to-r from-purple-500 to-cyan-500 p-6 rounded-t-3xl">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Calendar className="w-6 h-6 text-white" />
						<CardTitle className="text-white text-xl font-bold">
							Daily Reflection Journal
						</CardTitle>
					</div>
					<div className="flex items-center gap-2">
						{todaysEntries.length > 0 && (
							<Badge className="bg-white text-purple-700 text-xs rounded-full px-3 py-1 shadow">
								{todaysEntries.length}{" "}
								{todaysEntries.length === 1 ? "entry" : "entries"} today
							</Badge>
						)}
						<Badge className="bg-white text-purple-700 text-xs rounded-full px-3 py-1 shadow">
							{format(new Date(), "MMM d")}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="px-6 py-8">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2 bg-purple-100 rounded-xl mb-6">
						<TabsTrigger
							value="today"
							className="flex items-center justify-center gap-2 py-3 text-purple-800 font-semibold data-[state=active]:bg-white data-[state=active]:shadow"
						>
							<Calendar className="w-4 h-4" />
							Today’s Entries
						</TabsTrigger>
						<TabsTrigger
							value="history"
							className="flex items-center justify-center gap-2 py-3 text-purple-800 font-semibold data-[state=active]:bg-white data-[state=active]:shadow"
						>
							<History className="w-4 h-4" />
							History
						</TabsTrigger>
					</TabsList>

					<TabsContent value="today" className="space-y-6">
						{isLoading ? (
							<div className="flex items-center justify-center py-8 text-purple-600">
								<Loader2 className="w-6 h-6 animate-spin mr-2" />
								Loading today’s entries...
							</div>
						) : (
							<>
								{todaysEntries.length > 0 && (
									<TodaysEntriesSection
										entries={todaysEntries}
										onLoadEntry={loadEntry}
										onDeleteEntry={handleDeleteEntry}
										currentEntryId={currentEntry.id}
									/>
								)}

								<div className="bg-white rounded-2xl p-6 shadow border border-purple-100">
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-lg font-bold text-purple-900">
											{currentEntry.id ? "Edit Entry" : "New Entry"}
										</h3>
										{todaysEntries.length > 0 && !currentEntry.id && (
											<Button
												variant="outline"
												size="sm"
												onClick={handleCreateNew}
												className="text-purple-700 border-purple-300 hover:bg-purple-100"
											>
												<Plus className="w-4 h-4 mr-1" />
												Add Another Entry
											</Button>
										)}
									</div>

									<DailyPromptSection
										currentEntry={currentEntry}
										onResponseChange={updateResponse}
									/>
									<MoodTrackingSection
										dogName={currentDog.name}
										selectedMood={currentEntry.mood}
										onMoodChange={updateMood}
									/>
									<BehaviorTrackingSection
										selectedBehaviors={currentEntry.behaviors}
										onBehaviorToggle={toggleBehavior}
									/>
									<AdditionalNotesSection
										notes={currentEntry.notes}
										onNotesChange={updateNotes}
									/>

									<div className="flex justify-end pt-6 mt-4 border-t border-purple-200">
										<Button
											onClick={handleSave}
											disabled={isSaving}
											className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow hover:from-purple-600 hover:to-cyan-600"
										>
											{isSaving ? (
												<>
													<Loader2 className="w-4 h-4 animate-spin mr-2" />
													Saving...
												</>
											) : (
												<>
													<Save className="w-4 h-4 mr-2" />
													{currentEntry.id ? "Update Entry" : "Save Entry"}
												</>
											)}
										</Button>
									</div>
								</div>
							</>
						)}
					</TabsContent>

					<TabsContent value="history" className="mt-6">
						<JournalHistory dogId={currentDog.id} dogName={currentDog.name} />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default ReflectionJournal;
