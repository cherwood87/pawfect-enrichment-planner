import { format, parseISO } from "date-fns";
import { Clock, Edit3, Trash2 } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MOOD_RATINGS } from "@/constants/journalConstants";
import type { JournalEntry } from "@/types/journal";

interface TodaysEntriesSectionProps {
	entries: JournalEntry[];
	onLoadEntry: (entry: JournalEntry) => void;
	onDeleteEntry: (entryId: string) => void;
	currentEntryId?: string;
}

const TodaysEntriesSection: React.FC<TodaysEntriesSectionProps> = ({
	entries,
	onLoadEntry,
	onDeleteEntry,
	currentEntryId,
}) => {
	const getMoodIcon = (mood: string) => {
		const moodRating = MOOD_RATINGS.find((rating) => rating.mood === mood);
		if (!moodRating) return null;
		const IconComponent = moodRating.icon;
		return <IconComponent className={`w-4 h-4 ${moodRating.color}`} />;
	};

	const formatTime = (timestamp?: string) => {
		if (!timestamp) return "";
		try {
			return format(parseISO(timestamp), "h:mm a");
		} catch (_error) {
			return "";
		}
	};

	return (
		<div className="space-y-3">
			<h3 className="font-medium text-gray-800 flex items-center space-x-2">
				<Clock className="w-4 h-4" />
				<span>Today's Entries ({entries.length})</span>
			</h3>

			<div className="grid gap-3">
				{entries.map((entry) => {
					const isCurrentEntry = entry.id === currentEntryId;

					return (
						<Card
							key={entry.id}
							className={`border transition-all ${
								isCurrentEntry
									? "border-blue-300 bg-blue-50"
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div className="flex-1 space-y-2">
										<div className="flex items-center space-x-2">
											{entry.entryTimestamp && (
												<Badge variant="outline" className="text-xs">
													{formatTime(entry.entryTimestamp)}
												</Badge>
											)}
											{entry.mood && (
												<div className="flex items-center space-x-1">
													{getMoodIcon(entry.mood)}
													<span className="text-xs text-gray-600">
														{entry.mood}
													</span>
												</div>
											)}
											{entry.behaviors.length > 0 && (
												<Badge variant="secondary" className="text-xs">
													{entry.behaviors.length} behaviors
												</Badge>
											)}
											{isCurrentEntry && (
												<Badge className="text-xs bg-blue-500">Editing</Badge>
											)}
										</div>

										<p className="text-sm text-gray-600 line-clamp-2">
											<span className="font-medium">Prompt:</span>{" "}
											{entry.prompt}
										</p>

										{entry.response && (
											<p className="text-sm text-gray-700 line-clamp-2">
												<span className="font-medium">Response:</span>{" "}
												{entry.response}
											</p>
										)}
									</div>

									<div className="flex items-center space-x-1 ml-4">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onLoadEntry(entry)}
											className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
											disabled={isCurrentEntry}
										>
											<Edit3 className="w-4 h-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => entry.id && onDeleteEntry(entry.id)}
											className="text-red-500 hover:text-red-700 hover:bg-red-50"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
};

export default TodaysEntriesSection;
